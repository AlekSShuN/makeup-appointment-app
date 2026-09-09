import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import styles from './BookingForm.module.css';
import { useValidation } from "../hooks/useValidation.js";
import Calendar from './Calendar.jsx';
import { apiFetch } from '../lib/api.js';
import { toLocalISODate } from '../lib/dates.js';

const DEFAULT_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
];

const SLOTS_TIMEOUT_MS = 8000;
const WORKDAY_END_MINUTES = 20 * 60;

const formatPrice = (value) =>
    `${Number(value || 0).toLocaleString('ru-RU')} ₽`;

const timeToMinutes = (time) => {
    const [hours, minutes] = String(time).split(':').map(Number);
    return hours * 60 + minutes;
};

const BookingForm = ({ services = [], initialServiceId = '' }) => {
    const [selectedServiceIds, setSelectedServiceIds] = useState(() =>
        initialServiceId ? [String(initialServiceId)] : []
    );
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsNotice, setSlotsNotice] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [clientData, setClientData] = useState({
        name: '',
        phone: '',
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [touched, setTouched] = useState({});
    const abortControllerRef = useRef(null);

    const { errors, validateForm, clearError, clearAllErrors } = useValidation();

    const selectedServices = useMemo(
        () => services.filter(service => selectedServiceIds.includes(String(service.id))),
        [services, selectedServiceIds]
    );

    const totalPrice = useMemo(
        () => selectedServices.reduce((sum, service) => sum + Number(service.price || 0), 0),
        [selectedServices]
    );

    const totalDurationMinutes = useMemo(() => {
        const duration = selectedServices.reduce(
            (sum, service) => sum + Number(service.durationMinutes || 0),
            0
        );
        return duration > 0 ? duration : 60;
    }, [selectedServices]);

    const requestedServiceIds = selectedServiceIds.join(',');

    useEffect(() => {
        if (initialServiceId) {
            setSelectedServiceIds(prev =>
                prev.includes(String(initialServiceId))
                    ? prev
                    : [String(initialServiceId), ...prev]
            );
        }
    }, [initialServiceId]);

    const isPastTimeSlot = useCallback((date, time) => {
        if (!date || !time) return false;

        const [hours, minutes] = time.split(':').map(Number);
        const slotDateTime = new Date(`${date}T00:00:00`);
        slotDateTime.setHours(hours, minutes, 0, 0);

        return slotDateTime < new Date();
    }, []);

    const getLocalSlots = useCallback((date, durationMinutes) => (
        DEFAULT_SLOTS.filter((slot) => {
            if (isPastTimeSlot(date, slot)) {
                return false;
            }

            return timeToMinutes(slot) + durationMinutes <= WORKDAY_END_MINUTES;
        })
    ), [isPastTimeSlot]);

    const fetchSlots = useCallback(async (date, serviceIds) => {
        if (!date || !serviceIds) {
            setAvailableSlots([]);
            setSlotsNotice('');
            setSlotsLoading(false);
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), SLOTS_TIMEOUT_MS);

        setSelectedTime('');
        setSlotsLoading(true);
        setSlotsNotice('');

        const localSlots = getLocalSlots(date, totalDurationMinutes);
        setAvailableSlots(localSlots);

        try {
            const response = await apiFetch(
                `/bookings/booking-slots?date=${date}&serviceId=${encodeURIComponent(serviceIds)}`,
                { signal: controller.signal },
                { timeoutMs: SLOTS_TIMEOUT_MS }
            );

            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const slots = await response.json();
            const filteredSlots = (Array.isArray(slots) ? slots : [])
                .filter(slot => !isPastTimeSlot(date, slot));

            if (!controller.signal.aborted) {
                setAvailableSlots(filteredSlots.length > 0 ? filteredSlots : localSlots);
                setSlotsNotice(
                    filteredSlots.length > 0
                        ? ''
                        : localSlots.length > 0
                            ? ''
                            : 'На эту дату нет свободного времени. Выберите другой день.'
                );
            }
        } catch (error) {
            if (error.name === 'AbortError' && abortControllerRef.current !== controller) {
                return;
            }
            if (!controller.signal.aborted || abortControllerRef.current === controller) {
                setAvailableSlots(localSlots);
                setSlotsNotice(
                    localSlots.length > 0
                        ? ''
                        : 'На эту дату нет свободного времени. Выберите другой день.'
                );
            }
        } finally {
            clearTimeout(timeoutId);
            if (abortControllerRef.current === controller) {
                setSlotsLoading(false);
            }
        }
    }, [getLocalSlots, isPastTimeSlot, totalDurationMinutes]);

    useEffect(() => {
        return () => abortControllerRef.current?.abort();
    }, []);

    const validateFormDebounced = useCallback(() => {
        if (Object.keys(touched).length > 0) {
            validateForm({
                serviceId: selectedServiceIds,
                date: selectedDate,
                time: selectedTime,
                client: clientData
            });
        }
    }, [selectedServiceIds, selectedDate, selectedTime, clientData, touched, validateForm]);

    useEffect(() => {
        const timeoutId = setTimeout(validateFormDebounced, 300);
        return () => clearTimeout(timeoutId);
    }, [validateFormDebounced]);

    useEffect(() => {
        if (selectedDate && selectedTime && isPastTimeSlot(selectedDate, selectedTime)) {
            setSelectedTime('');
            clearError('time');
        }
    }, [selectedDate, selectedTime, isPastTimeSlot, clearError]);

    useEffect(() => {
        if (selectedDate && requestedServiceIds) {
            fetchSlots(selectedDate, requestedServiceIds);
            return;
        }

        setAvailableSlots([]);
        setSlotsNotice('');
        setSlotsLoading(false);
    }, [selectedDate, requestedServiceIds, fetchSlots]);

    const handleServiceToggle = useCallback((serviceId) => {
        const id = String(serviceId);
        setSelectedServiceIds(prev => {
            const next = prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id];

            if (next.length === 0) {
                setSelectedTime('');
                setAvailableSlots([]);
                setSlotsNotice('');
            }

            return next;
        });
        setTouched(state => ({ ...state, serviceId: true }));
        clearError('serviceId');
    }, [clearError]);

    const handleDateChange = useCallback((date) => {
        setSelectedDate(date);
        setSelectedTime('');
        setTouched(prev => ({ ...prev, date: true }));
        clearError('date');
    }, [clearError]);

    const handleInputChange = useCallback((field, value) => {
        setClientData(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));
        clearError(field);
    }, [clearError]);

    const handleBlur = useCallback((field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    }, []);

    const formatPhone = useCallback((value) => {
        const numbers = String(value || '').replace(/\D/g, '').replace(/^8/, '7');
        const local = numbers.startsWith('7') ? numbers.slice(1) : numbers;

        let formattedValue = '+7';
        if (local.length > 0) formattedValue += ' (' + local.slice(0, 3);
        if (local.length > 3) formattedValue += ') ' + local.slice(3, 6);
        if (local.length > 6) formattedValue += '-' + local.slice(6, 8);
        if (local.length > 8) formattedValue += '-' + local.slice(8, 10);
        return formattedValue;
    }, []);

    const handlePhoneChange = useCallback((value) => {
        handleInputChange('phone', formatPhone(value));
    }, [formatPhone, handleInputChange]);

    const handlePhoneKeyDown = useCallback((e) => {
        const cursorPosition = e.target.selectionStart;
        if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 2) {
            e.preventDefault();
        }
    }, []);

    const handleTimeSelect = useCallback((time) => {
        if (selectedDate && isPastTimeSlot(selectedDate, time)) {
            return;
        }

        setSelectedTime(time);
        setTouched(prev => ({ ...prev, time: true }));
        clearError('time');
    }, [selectedDate, isPastTimeSlot, clearError]);

    const formSubmissionHandler = async (event) => {
        event.preventDefault();

        setTouched({
            serviceId: true,
            date: true,
            time: true,
            name: true,
            phone: true,
        });

        if (selectedDate && selectedTime && isPastTimeSlot(selectedDate, selectedTime)) {
            setSubmitMessage('Выбранное время уже прошло. Пожалуйста, выберите другое время.');
            setSelectedTime('');
            return;
        }

        const formData = {
            serviceId: selectedServiceIds,
            date: selectedDate,
            time: selectedTime,
            client: clientData
        };

        const isValid = validateForm(formData);
        if (!isValid) {
            requestAnimationFrame(() => {
                const errorElement = document.querySelector(`.${styles.errorText}`);
                errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        const serviceNames = selectedServices
            .map(service => service.name || service.title)
            .join(', ');

        const payload = {
            serviceId: selectedServiceIds.join(','),
            serviceIds: selectedServiceIds.map(Number),
            date: selectedDate,
            time: selectedTime,
            totalPrice,
            client: {
                ...clientData,
                comment: [
                    clientData.comment?.trim(),
                    selectedServices.length > 1
                        ? `Услуги: ${serviceNames}. Итого: ${formatPrice(totalPrice)}`
                        : '',
                ].filter(Boolean).join('\n'),
            },
        };

        try {
            const response = await apiFetch(
                '/bookings',
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
                { timeoutMs: 12000 }
            );

            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                setSubmitMessage('Ваша заявка принята! Мы свяжемся с вами для подтверждения.');
                setSelectedServiceIds([]);
                setSelectedDate('');
                setSelectedTime('');
                setClientData({ name: '', phone: '', comment: '' });
                setTouched({});
                clearAllErrors();
                setAvailableSlots([]);
                setSlotsNotice('');
            } else {
                setSubmitMessage(result.message || 'Не удалось отправить заявку');
            }
        } catch {
            setSubmitMessage('Ошибка сети. Проверьте соединение и попробуйте ещё раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = selectedServiceIds.length > 0 && selectedDate && selectedTime &&
        clientData.name?.trim() &&
        clientData.phone?.replace(/\D/g, '').length === 11 &&
        !isPastTimeSlot(selectedDate, selectedTime);

    const isSuccess = submitMessage.includes('принята');
    const showTimeSection = selectedServiceIds.length > 0 && selectedDate;

    return (
        <form onSubmit={formSubmissionHandler} className={styles.form} noValidate>
            <div className={styles.form_group} data-field="serviceId">
                <span className={styles.label}>Услуги</span>
                <p className={styles.hint}>Можно выбрать несколько — итоговая сумма обновится сразу</p>
                <div className={styles.servicesList} role="group" aria-label="Услуги">
                    {services.map(service => {
                        const id = String(service.id);
                        const checked = selectedServiceIds.includes(id);
                        return (
                            <label
                                key={id}
                                className={`${styles.serviceOption} ${checked ? styles.serviceOptionActive : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleServiceToggle(id)}
                                    onBlur={() => handleBlur('serviceId')}
                                />
                                <span className={styles.serviceOptionBody}>
                                    <span className={styles.serviceOptionName}>
                                        {service.name || service.title}
                                    </span>
                                    <span className={styles.serviceOptionPrice}>
                                        {formatPrice(service.price)}
                                    </span>
                                </span>
                            </label>
                        );
                    })}
                </div>
                {errors.serviceId && (
                    <span className={styles.errorText}>{errors.serviceId}</span>
                )}
            </div>

            {selectedServices.length > 0 && (
                <div className={styles.totalCard} aria-live="polite">
                    <div className={styles.totalList}>
                        {selectedServices.map(service => (
                            <div key={service.id} className={styles.totalRow}>
                                <span>{service.name || service.title}</span>
                                <span>{formatPrice(service.price)}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.totalSum}>
                        <span>Итого</span>
                        <strong>{formatPrice(totalPrice)}</strong>
                    </div>
                </div>
            )}

            <div className={styles.form_group} data-field="date">
                <label className={styles.label}>Дата</label>
                <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    onBlur={() => handleBlur('date')}
                    minDate={toLocalISODate(new Date())}
                    className={styles.calendar}
                    error={errors.date}
                    disabledDays={[]}
                />
                {errors.date && (
                    <span className={styles.errorText}>{errors.date}</span>
                )}
            </div>

            {showTimeSection && (
                <div className={styles.form_group} data-field="time">
                    <label className={styles.label}>Доступное время</label>
                    {slotsLoading && <p className={styles.hint}>Проверяем свободные слоты...</p>}
                    {slotsNotice && !slotsLoading && <p className={styles.hint}>{slotsNotice}</p>}
                    {availableSlots.length > 0 ? (
                        <div className={styles.time_slots}>
                            {availableSlots.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`${styles.time_slot} ${selectedTime === slot ? styles.time_slotSelected : ''}`}
                                    onClick={() => handleTimeSelect(slot)}
                                    aria-pressed={selectedTime === slot}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : (
                        !slotsLoading && (
                            <p className={styles.hint}>На эту дату нет свободного времени.</p>
                        )
                    )}
                    {errors.time && (
                        <span className={styles.errorText}>{errors.time}</span>
                    )}
                </div>
            )}

            <div className={styles.form_group} data-field="name">
                <label className={styles.label} htmlFor="name">Имя</label>
                <input
                    id="name"
                    type="text"
                    value={clientData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                    placeholder="Введите ваше имя"
                    autoComplete="name"
                    required
                />
                {errors.name && (
                    <span className={styles.errorText}>{errors.name}</span>
                )}
            </div>

            <div className={styles.form_group} data-field="phone">
                <label className={styles.label} htmlFor="phone">Телефон</label>
                <input
                    id="phone"
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyDown={handlePhoneKeyDown}
                    onBlur={() => handleBlur('phone')}
                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                    placeholder="+7 (999) 999-99-99"
                    autoComplete="tel"
                    required
                    onPaste={(e) => {
                        e.preventDefault();
                        handlePhoneChange(e.clipboardData.getData('text'));
                    }}
                />
                {errors.phone && (
                    <span className={styles.errorText}>{errors.phone}</span>
                )}
            </div>

            <div className={`${styles.form_group} ${styles.optional}`}>
                <label className={styles.label} htmlFor="comment">Комментарий</label>
                <textarea
                    id="comment"
                    value={clientData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    className={styles.textarea}
                    rows="4"
                    placeholder="Дополнительные пожелания или референсы..."
                />
            </div>

            <button
                className={styles.submit_button}
                type="submit"
                disabled={isSubmitting || !isFormValid}
            >
                {isSubmitting ? (
                    <>
                        <span className={styles.spinner}></span>
                        Отправка...
                    </>
                ) : (
                    selectedServiceIds.length > 0
                        ? `Записаться · ${formatPrice(totalPrice)}`
                        : 'Записаться'
                )}
            </button>

            {submitMessage && (
                <div
                    className={`${styles.message} ${isSuccess ? styles.messageSuccess : styles.messageError}`}
                    role="status"
                >
                    {submitMessage}
                </div>
            )}
        </form>
    );
};

export default BookingForm;

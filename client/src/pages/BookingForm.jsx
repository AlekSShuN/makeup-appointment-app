import { useState, useEffect, useCallback, useRef } from "react";
import styles from './BookingForm.module.css';
import { useValidation } from "../hooks/useValidation.js";
import Calendar from './Calendar.jsx';
import { API_BASE_URL } from '../lib/api.js';
import { toLocalISODate } from '../lib/dates.js';

const BookingForm = ({ services = [], initialServiceId = '' }) => {
    const [selectedService, setSelectedService] = useState(String(initialServiceId || ''));
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState('');
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

    useEffect(() => {
        if (initialServiceId) {
            setSelectedService(String(initialServiceId));
        }
    }, [initialServiceId]);

    const isPastTimeSlot = useCallback((date, time) => {
        if (!date || !time) return false;

        const [hours, minutes] = time.split(':').map(Number);
        const slotDateTime = new Date(`${date}T00:00:00`);
        slotDateTime.setHours(hours, minutes, 0, 0);

        return slotDateTime < new Date();
    }, []);

    const fetchSlots = useCallback(async (date, serviceId) => {
        if (!date || !serviceId) {
            setAvailableSlots([]);
            setSlotsError('');
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setSelectedTime('');
        setSlotsLoading(true);
        setSlotsError('');

        try {
            const response = await fetch(
                `${API_BASE_URL}/bookings/booking-slots?date=${date}&serviceId=${serviceId}`,
                { signal: controller.signal }
            );

            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const slots = await response.json();
            const filteredSlots = (Array.isArray(slots) ? slots : [])
                .filter(slot => !isPastTimeSlot(date, slot));
            setAvailableSlots(filteredSlots);
            if (filteredSlots.length === 0) {
                setSlotsError('На эту дату нет свободного времени. Выберите другой день.');
            }
        } catch (error) {
            if (error.name === 'AbortError') return;
            setAvailableSlots([]);
            setSlotsError('Не удалось загрузить свободное время. Попробуйте ещё раз.');
        } finally {
            if (!controller.signal.aborted) {
                setSlotsLoading(false);
            }
        }
    }, [isPastTimeSlot]);

    useEffect(() => {
        return () => abortControllerRef.current?.abort();
    }, []);

    const validateFormDebounced = useCallback(() => {
        if (Object.keys(touched).length > 0) {
            validateForm({
                serviceId: selectedService,
                date: selectedDate,
                time: selectedTime,
                client: clientData
            });
        }
    }, [selectedService, selectedDate, selectedTime, clientData, touched, validateForm]);

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

    const handleServiceChange = useCallback((serviceId) => {
        setSelectedService(serviceId);
        setSelectedTime('');
        setAvailableSlots([]);
        setTouched(prev => ({ ...prev, serviceId: true }));
        clearError('serviceId');

        if (selectedDate && serviceId) {
            fetchSlots(selectedDate, serviceId);
        }
    }, [selectedDate, fetchSlots, clearError]);

    const handleDateChange = useCallback((date) => {
        setSelectedDate(date);
        setSelectedTime('');
        setTouched(prev => ({ ...prev, date: true }));
        clearError('date');

        if (date && selectedService) {
            fetchSlots(date, selectedService);
        }
    }, [selectedService, fetchSlots, clearError]);

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
            serviceId: selectedService,
            date: selectedDate,
            time: selectedTime,
            client: clientData
        };

        const isValid = validateForm(formData);
        if (!isValid) {
            requestAnimationFrame(() => {
                const firstErrorField = Object.keys(errors).find(field => errors[field]);
                const errorElement = firstErrorField
                    ? document.querySelector(`[data-field="${firstErrorField}"]`)
                    : document.querySelector(`.${styles.errorText}`);
                errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                setSubmitMessage('Ваша заявка принята! Мы свяжемся с вами для подтверждения.');
                setSelectedService('');
                setSelectedDate('');
                setSelectedTime('');
                setClientData({ name: '', phone: '', comment: '' });
                setTouched({});
                clearAllErrors();
                setAvailableSlots([]);
            } else {
                setSubmitMessage(result.message || 'Не удалось отправить заявку');
            }
        } catch {
            setSubmitMessage('Ошибка сети. Проверьте соединение и попробуйте ещё раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = selectedService && selectedDate && selectedTime &&
        clientData.name?.trim() &&
        clientData.phone?.replace(/\D/g, '').length === 11 &&
        !isPastTimeSlot(selectedDate, selectedTime);

    const isSuccess = submitMessage.includes('принята');

    return (
        <form onSubmit={formSubmissionHandler} className={styles.form} noValidate>
            <div className={styles.form_group} data-field="serviceId">
                <label className={styles.label} htmlFor="service">Услуга</label>
                <select
                    id="service"
                    aria-label="Услуга"
                    value={selectedService}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    onBlur={() => handleBlur('serviceId')}
                    className={`${styles.select} ${errors.serviceId ? styles.error : ''}`}
                    required
                >
                    <option value="">Выберите услугу</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name || service.title} ({service.price} ₽)
                        </option>
                    ))}
                </select>
                {errors.serviceId && (
                    <span className={styles.errorText}>{errors.serviceId}</span>
                )}
            </div>

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

            {(slotsLoading || slotsError || availableSlots.length > 0) && (
                <div className={styles.form_group} data-field="time">
                    <label className={styles.label}>Доступное время</label>
                    {slotsLoading && <p className={styles.hint}>Ищем свободные слоты...</p>}
                    {slotsError && !slotsLoading && <p className={styles.hint}>{slotsError}</p>}
                    {availableSlots.length > 0 && (
                        <div className={styles.time_slots}>
                            {availableSlots.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`${styles.time_slot} ${selectedTime === slot ? styles.selected : ''}`}
                                    onClick={() => handleTimeSelect(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
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
                    'Записаться'
                )}
            </button>

            {submitMessage && (
                <div className={`${styles.message} ${isSuccess ? styles.success : styles.error}`} role="status">
                    {submitMessage}
                </div>
            )}
        </form>
    );
};

export default BookingForm;

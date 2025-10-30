import { useState, useEffect, useCallback, useRef } from "react";
import styles from './BookingForm.module.css';
import { useValidation } from "../hooks/useValidation.js";
import Calendar from './Calendar.jsx';

const API_BASE_URL = 'https://makeup-appointment-app-backend.onrender.com/api';

const BookingForm = ({ services = [] }) => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
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

    const isPastTimeSlot = useCallback((date, time) => {
        if (!date || !time) return false;

        const [hours, minutes] = time.split(':').map(Number);
        const slotDateTime = new Date(date);
        slotDateTime.setHours(hours, minutes, 0, 0);

        return slotDateTime < new Date();
    }, []);

    const fetchSlots = useCallback(async (date, serviceId) => {
        if (!date || !serviceId) {
            setAvailableSlots([]);
            return;
        }
        setSelectedTime('');
        setTimeout(async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/bookings/booking-slots?date=${date}&serviceId=${serviceId}`
                );

                if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

                const slots = await response.json();
                const filteredSlots = slots.filter(slot => !isPastTimeSlot(date, slot));
                setAvailableSlots(filteredSlots);

            } catch (error) {
                console.error('Error fetching slots:', error);
                // Fallback на мок данные при ошибке
                const mockSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
                const filteredSlots = mockSlots.filter(slot => !isPastTimeSlot(date, slot));
                setAvailableSlots(filteredSlots);
            }
        }, 500);

    }, [isPastTimeSlot]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
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

    // Валидация с дебаунсингом
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
        if (!value || !value.startsWith('+7')) {
            return '+7';
        }

        const numbers = value.replace(/\D/g, '').slice(1);

        let formattedValue = '+7';

        if (numbers.length > 0) {
            formattedValue += ' (' + numbers.slice(0, 3);
        }
        if (numbers.length > 3) {
            formattedValue += ') ' + numbers.slice(3, 6);
        }
        if (numbers.length > 6) {
            formattedValue += '-' + numbers.slice(6, 8);
        }
        if (numbers.length > 8) {
            formattedValue += '-' + numbers.slice(8, 10);
        }

        return formattedValue;
    }, [])

    const handlePhoneChange = useCallback((value) => {
        if (!value.startsWith('+7')) {
            handleInputChange('phone', '+7');
            return;
        }
        const formattedPhone = formatPhone(value);
        handleInputChange('phone', formattedPhone);
    }, [formatPhone, handleInputChange]);

    const handlePhoneKeyDown = useCallback((e) => {
        const cursorPosition = e.target.selectionStart;
        if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 2) {
            e.preventDefault();
            return;
        }
        if (!/[\d]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
            e.preventDefault();
        }
    }, []);

    const handleTimeSelect = useCallback((time) => {
        if (selectedDate && isPastTimeSlot(selectedDate, time)) {
            clearError('time');
            return;
        }

        setSelectedTime(time);
        setTouched(prev => ({ ...prev, time: true }));
        clearError('time');
    }, [selectedDate, isPastTimeSlot, clearError]);

    const formSubmissionHandler = async (event) => {
        event.preventDefault();

        const allTouchedFields = {
            serviceId: true,
            date: true,
            time: true,
            name: true,
            phone: true,
        };
        setTouched(allTouchedFields);

        // Финальная проверка на прошедшее время
        if (selectedDate && selectedTime && isPastTimeSlot(selectedDate, selectedTime)) {
            setSubmitMessage('❌ Выбранное время уже прошло. Пожалуйста, выберите другое время.');
            setSelectedTime('');
            return;
        }

        const formData = {
            serviceId: selectedService,
            date: selectedDate,
            time: selectedTime,
            client: clientData
        };

        // Финальная валидация
        const isValid = validateForm(formData);
        if (!isValid) {
            const firstErrorField = Object.keys(errors).find(field => errors[field]);
            if (firstErrorField) {
                const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`);
                if (errorElement) {
                    errorElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitMessage('✅ Ваша заявка принята! Мы свяжемся с вами для подтверждения.');

                const currentDate = selectedDate;
                const currentService = selectedService;
                setSelectedService('');
                setSelectedDate('');
                setSelectedTime('');
                setClientData({ name: '', phone: '', comment: '' });
                setTouched({});
                clearAllErrors();
                setAvailableSlots([]);

                if (currentDate && currentService) {
                    setTimeout(() => {
                        fetchSlots(currentDate, currentService);
                    }, 100);
                }
            } else {
                setSubmitMessage(`❌ Ошибка: ${result.message || 'Не удалось отправить заявку'}`);
            }
        } catch (error) {
            setSubmitMessage('❌ Ошибка сети. Пожалуйста, проверьте соединение и попробуйте еще раз!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = selectedService && selectedDate && selectedTime &&
        clientData.name?.trim() &&
        clientData.phone?.replace(/\D/g, '').length >= 11 &&
        !isPastTimeSlot(selectedDate, selectedTime);

    return (
        <form onSubmit={formSubmissionHandler} className={styles.form} noValidate>
            {/* Выбор услуги */}
            <div className={styles.form_group} data-field="serviceId">
                <label className={styles.label}>Услуга:</label>
                <select aria-label="Услуга"
                    value={selectedService}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    onBlur={() => handleBlur('serviceId')}
                    className={`${styles.select} ${errors.serviceId ? styles.error : ''}`}
                    required
                >
                    <option value="">Выберите услугу</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name} ({service.price}руб.)
                        </option>
                    ))}
                </select>
                {errors.serviceId && (
                    <span className={styles.errorText}>{errors.serviceId}</span>
                )}
            </div>

            {/* Выбор даты */}
            <div className={styles.form_group} data-field="date">
                <label className={styles.label}>Дата:</label>
                <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    onBlur={() => handleBlur('date')}
                    minDate={new Date().toISOString().split('T')[0]}
                    className={styles.calendar}
                    error={errors.date}
                    disabledDays={[]}
                />
                {errors.date && (
                    <span className={styles.errorText}>{errors.date}</span>
                )}
            </div>

            {/* Выбор времени */}
            {availableSlots.length > 0 && (
                <div className={styles.form_group} data-field="time">
                    <label className={styles.label}>Доступное время:</label>
                    <div className={styles.time_slots}>
                        {availableSlots.map(slot => {
                            const isPast = isPastTimeSlot(selectedDate, slot);
                            return (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`${styles.time_slot} ${selectedTime === slot ? styles.selected : ''
                                        } ${isPast ? styles.past_slot : ''}`}
                                    onClick={() => !isPast && handleTimeSelect(slot)}
                                    disabled={isPast}
                                    title={isPast ? "Это время уже прошло" : ""}
                                >
                                    {slot}
                                    {isPast && <span className={styles.past_badge}>прошло</span>}
                                </button>
                            );
                        })}
                    </div>
                    {errors.time && (
                        <span className={styles.errorText}>{errors.time}</span>
                    )}
                </div>
            )}

            {/* Данные клиента */}
            <div className={styles.form_group} data-field="name">
                <label className={styles.label}>Имя:</label>
                <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                    placeholder="Введите ваше имя"
                    required
                />
                {errors.name && (
                    <span className={styles.errorText}>{errors.name}</span>
                )}
            </div>

            <div className={styles.form_group} data-field="phone">
                <label className={styles.label}>Телефон:</label>
                <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyDown={handlePhoneKeyDown}
                    onBlur={() => handleBlur('phone')}
                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                    placeholder="+7 (999) 999-99-99"
                    required
                    onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        const numbers = pastedText.replace(/\D/g, '');
                        if (numbers) {
                            handlePhoneChange('+7' + numbers);
                        }
                    }}
                />
                {errors.phone && (
                    <span className={styles.errorText}>{errors.phone}</span>
                )}
            </div>

            {/* Комментарий */}
            <div className={styles.form_group}>
                <label className={styles.label}>Комментарий:</label>
                <textarea
                    value={clientData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    className={styles.textarea}
                    rows="4"
                    placeholder="Дополнительные пожелания или референсы..."
                />
            </div>

            {/* Кнопка отправки */}
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
                    '📅 Записаться'
                )}
            </button>

            {/* Сообщение о результате */}
            {submitMessage && (
                <div className={`${styles.message} ${submitMessage.includes('✅') ? styles.success : styles.error
                    }`}>
                    {submitMessage}
                </div>
            )}
        </form>
    );
};

export default BookingForm;
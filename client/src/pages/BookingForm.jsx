import { useState, useEffect, useCallback } from "react";
import styles from './BookingForm.module.css';
import { useValidation } from "../hooks/useValidation.js";

const BookingForm = ({ services }) => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [clientData, setClientData] = useState({ name: '', phone: '', email: '', comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [touched, setTouched] = useState({});
    const { errors, validateForm, clearError, clearAllErrors } = useValidation();

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

    const safeServices = Array.isArray(services) ? services : [];

    const handleDateChange = async (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        setSelectedTime('');
        setTouched(prev => ({ ...prev, date: true }));
        clearError('date');

        if (!date || !selectedService) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/booking-slots?date=${date}&serviceId=${selectedService}`);
            const slots = await response.json();
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Error fetching slots:', error);
            setAvailableSlots([]);
        }
    };

    const handleInputChange = useCallback((field, value) => {
        setClientData(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));
        clearError(field);
    }, [clearError]);

    const handleBlur = useCallback((field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    }, []);

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        let formattedValue = value;

        if (numbers.length <= 1) {
            formattedValue = numbers ? '+7' : '';
        } else if (numbers.length <= 4) {
            formattedValue = `+7(${numbers.slice(1, 4)}`;
        } else if (numbers.length <= 7) {
            formattedValue = `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`;
        } else if (numbers.length <= 9) {
            formattedValue = `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)} - ${numbers.slice(7, 9)}`;
        } else {
            formattedValue = `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
        }
        return formattedValue;
    };

    const handlePhoneChange = useCallback((value) => {
        const formattedPhone = formatPhone(value);
        handleInputChange('phone', formattedPhone);
    }, [handleInputChange]);

    const formSubmissionHandler = async (event) => {
        event.preventDefault();

        const allTouchedFields = {
            serviceId: true,
            date: true,
            time: true,
            name: true,
            phone: true,
            email: true
        };
        setTouched(allTouchedFields);

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
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitMessage('Ваша заявка принята!');
                // Сброс формы
                setSelectedService('');
                setSelectedDate('');
                setSelectedTime('');
                setClientData({ name: '', phone: '', email: '', comment: '' });
                setTouched({});
                clearAllErrors();
                setAvailableSlots([]);
            } else {
                setSubmitMessage(`Ошибка: ${result.message}`);
            }
        } catch (error) {
            setSubmitMessage('Ошибка в отправке. Пожалуйста, Попробуйте еще раз!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={formSubmissionHandler} className={styles.form} noValidate>
            {/* выбор услуги */}
            <div className={styles.form_group} data-field="serviceId">
                <label className={styles.label_service}>Услуга: </label>
                <select
                    value={selectedService}
                    onChange={(e) => {
                        setSelectedService(e.target.value);
                        setTouched(prev => ({ ...prev, serviceId: true }));
                        clearError('serviceId');
                    }}
                    onBlur={() => handleBlur('serviceId')}
                    className={`${styles.select} ${errors.serviceId ? styles.error : ''}`}
                    required
                >
                    <option value="">Выберите услугу</option>
                    {safeServices.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name} ({service.price}руб.)
                        </option>
                    ))}
                </select>
                {errors.serviceId && <span className={styles.errorText}>{errors.serviceId}</span>}
            </div>

            {/* Выбор даты */}
            <div className={styles.form_group} data-field="date">
                <label className={styles.label}>Дата: </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    onBlur={() => handleBlur('date')}
                    className={`${styles.input} ${errors.date ? styles.error : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    required
                />
                {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>

            {/* Выбор времени */}
            {availableSlots.length > 0 && (
                <div className={styles.form_group} data-field="time">
                    <label className={styles.label}>Доступное время: </label>
                    <div className={styles.time_slots}>
                        {availableSlots.map(slot => (
                            <button
                                key={slot}
                                type="button"
                                className={`${styles.time_slot} ${selectedTime === slot ? styles.selected : ''}`}
                                onClick={() => {
                                    setSelectedTime(slot);
                                    setTouched(prev => ({ ...prev, time: true }));
                                    clearError('time');
                                }}>
                                {slot}
                            </button>
                        ))}
                    </div>
                    {errors.time && <span className={styles.errorText}>{errors.time}</span>}
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
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            {/* Телефон */}
            <div className={styles.form_group} data-field="phone">
                <label className={styles.label}>Телефон:</label>
                <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                    placeholder="+7(999) 999-99-99"
                    required
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            {/* Email */}
            <div className={styles.form_group} data-field="email">
                <label className={styles.label}>Email: </label>
                <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
                    placeholder="email@mail.ru"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            {/* Комментарий */}
            <div className={styles.form_group}>
                <label className={styles.label}>Комментарии:</label>
                <textarea
                    value={clientData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    className={styles.textarea}
                    rows="4"
                    placeholder="Дополнительные пожелания и информация"
                />
            </div>

            <button
                className={styles.submit_button}
                type="submit"
                disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>

            {submitMessage && (
                <div className={`${styles.message} ${submitMessage.includes('Ошибка') ? styles.error : styles.success}`}>
                    {submitMessage}
                </div>
            )}
        </form>
    );
};

export default BookingForm;
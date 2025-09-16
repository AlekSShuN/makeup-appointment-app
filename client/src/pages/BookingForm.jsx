import { useState } from "react";
import styles from './BookingForm.module.css';


const BookingForm = ({ services }) => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailebleSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [clientData, setClientData] = useState({ name: '', phone: '', email: '', comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const safeServices = Array.isArray(services) ? services : [];



    //Выбор даты
    const datePickerHandler = async (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedTime('');

        if (!date || !selectedService)
            return;

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/booking-slots?date=${date}`);
            const slots = await response.json();
            setAvailebleSlots(slots);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    //отправка формы
    const formSubmissionHandel = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const bookingDate = {
            serviceId: parseInt(selectedService),
            date: selectedDate,
            time: selectedTime,
            client: clientData,
        };

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDate),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitMessage('Ваша заявка принята!');
                selectedService('');
                setSelectedDate('');
                setSelectedTime('');
                setClientData({ name: '', phone: '', email: '', comment: '' });
            } else {
                setSubmitMessage(`Ошибка: ${result.message}`);
            }
        } catch (error) {
            setSubmitMessage('Ошибка в отправке. Попробуйте еще раз');
        } finally {
            setIsSend(false);
        }
    };

    return (
        <form onSubmit={formSubmissionHandel} className={styles.form}>
            {/*выбор услуги*/}
            <div className={styles.form_group}>
                <label className={styles.label_service}>Услуга: </label>
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={styles.select}
                    required>
                    <option className={styles.select_service} value="">Выберите услугу </option>
                    {safeServices.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name} ({service.price}руб.)
                        </option >
                    ))}
                </select>
            </div>


            {/*Выбор даты*/}
            <div className={styles.form_group}>
                <label className={styles.label}>Дата: </label>
                <input type="date"
                    value={selectedDate}
                    onChange={datePickerHandler}
                    className={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                    required />
            </div>

            {/*Выбор времени */}
            {availableSlots.length > 0 && (
                <div className={styles.form_group}>
                    <label className={styles.label}>Доступное время: </label>
                    <div className={styles.time_slots}>
                        {availableSlots.map(slot => (
                            <button
                                key={slot}
                                type="button"
                                className={`${styles.time_slot} ${selectedTime === slot ? styles.selected : ''}`}
                                onClick={() => setSelectedTime(slot)}>
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/*Данные клиента */}
            <div className={styles.form_group}>
                <label className={styles.label}>Имя:</label>
                <input type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className={styles.input}
                    required />
            </div>

            <div className={styles.form_group}>
                <label className={styles.label}>Телефон:</label>
                <input type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className={styles.input}
                    required />
            </div>

            <div className={styles.form_group}>
                <label className={styles.label}>email: </label>
                <input type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className={styles.input}
                />
            </div>

            <div className={styles.form_group}>
                <label className={styles.label}>Комментарии:</label>
                <textarea
                    value={clientData.comment}
                    onChange={(e) => setClientData({ ...clientData, comment: e.target.value })}
                    className={styles.textarea}
                    rows="4"
                />
            </div>

            <button
                className={styles.submit_button}
                type="submit"
                disabled={isSubmitting}>
                {isSubmitting ? 'Отправка' : 'Отправить заявку'}
            </button>

            {submitMessage && (
                <div className={`${styles.message} ${submitMessage.includes('ошибка') ? styles.error : styles.success}`}>
                    {submitMessage}
                </div>
            )}
        </ form >
    );
};

export default BookingForm;
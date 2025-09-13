import { useState } from "react";
import styles from './BookingForm.module.css';


const BookingForm = ({ services }) => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailebleSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [clientData, setClientData] = useState({ name: '', phone: '', email: '', comment: '' });
    const [isSend, setIsSend] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const safeServices = Array.isArray(services) ? services : [];



    //Выбор даты
    const datePickerHandler = async (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedTime('');

        if (!date || setSelectedService)
            return;

        try {
            const response = await fetch(`http://localhost:5000/api/booking/booking_slots?date=${date}`);
            const slots = await response.json();
            setAvailebleSlots(slots);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    //отправка формы
    const formSubmissionHandel = async (e) => {
        e.preventDefault();
        setSubmiting(true);

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
                    'content-type': 'application/json',
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
            setSubmitMessage(false);
        }
    };

    return (
        <form onSubmit={formSubmissionHandel} className={styles.form}>
            {/*выбор услуги*/}
            <label>Услуга:
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required>
                    <option value="">Выберите услугу </option>
                    {safeServices.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name} ({service.price}руб.)
                        </option >
                    ))}
                </select>
            </label>

            {/*Выбор даты*/}
            <label>Дата:
                <input type="date"
                    value={selectedDate}
                    onChange={datePickerHandler}
                    min={new Date().toISOString().split('T')[0]}
                    required />
            </label>

            {/*Выбор времени */}
            {availableSlots.length > 0 && (
                <label >Доступное время:
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required>
                        <option value="">Выберите время</option>
                        {availableSlots.map(slot => {
                            <option key={slot} value={slot}>{slot}</option>
                        })};
                    </select>
                </label>
            )}

            {/*Данные клиента */}
            <label>Имя:
                <input type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    required />
            </label>
            <label>Телефон:
                <input type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    required />
            </label>
            <label>email:
                <input type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })} />
            </label>

            <button type="submit" disabled={isSend}>
                {isSend ? 'Отправка' : 'Отправить заявку'}
            </button>

            {submitMessage && <p>{submitMessage}</p>}
        </ form >
    );
};

export default BookingForm;
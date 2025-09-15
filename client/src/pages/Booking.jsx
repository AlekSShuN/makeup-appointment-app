import { useState, useEffect } from "react";
import styles from './Booking.module.css';
import BookingForm from './BookingForm.jsx';

const Booking = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //получение данных с сервера
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/services');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setServices(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            };
        };
        fetchServices();
    }, []);

    if (loading) return <div className={styles.loading}>Загрузка услуг</div>;

    if (error) return <div className={styles.error}>
        <h3>Не удалось загрузить услуги</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
    </div>;

    if (!loading && !error && services.length === 0) {
        return <div>Нет доступных услуг для записи</div>;
    }

    return (
        <div className={styles.Booking}>
            <h1 className={styles.title}>Записаться на услугу</h1>
            <p className={styles.sub_title}>Выберите услугу и время</p>
            <BookingForm services={services} />
        </div>
    );
};



export default Booking;
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

    if (loading) {
        return (
            <div className={styles.booking}>
                <div className={styles.container}>
                    <div className={styles.loading}>Загрузка услуг</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.booking}>
                <div className={styles.container}>
                    <div className={styles.error}>
                        Ошибка: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.booking}>
            <div className={styles.container}>
                <h1 className={styles.title}>Запись на услугу</h1>
                <p className={styles.sub_title}>
                    Выберите услугу и удобное время для визита. Мы свяжемся с вами для подтверждения записи.
                </p>
                <BookingForm services={services} />
            </div>
        </div>
    );
};




export default Booking;
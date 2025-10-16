import { useState, useEffect } from "react";
import styles from './Booking.module.css';
import BookingForm from './BookingForm.jsx';

const Booking = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching services from /api/services');
            const response = await fetch('https://makeup-appointment-app-backend.onrender.com/api/services');

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Received data:', result);
            setServices(result);

        } catch (error) {
            console.error('Error fetching services:', error);
            setError(error.message || 'Произошла ошибка при загрузке услуг');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [retryCount]);

    const retryFetch = () => {
        setRetryCount(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className={styles.booking}>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        Загрузка услуг...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.booking}>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Ошибка загрузки</h2>
                        <p>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={retryFetch}
                        >
                            Попробовать снова
                        </button>
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
                    Выберите услугу и удобное время для визита.
                    Мы свяжемся с вами для подтверждения записи.
                </p>
                <BookingForm services={services} />
            </div>
        </div>
    );
};

export default Booking;
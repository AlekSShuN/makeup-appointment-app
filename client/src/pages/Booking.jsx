import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Booking.module.css';
import BookingForm from './BookingForm.jsx';
import { useServices } from '../hooks/useServices.js';
import { FALLBACK_SERVICES } from '../data/services.js';
import Loader from '../component/Loader/Loader.jsx';

const Booking = () => {
    const [searchParams] = useSearchParams();
    const { data, isLoading, isError, refetch } = useServices();

    const services = useMemo(() => {
        if (Array.isArray(data) && data.length > 0) {
            return data;
        }
        return FALLBACK_SERVICES;
    }, [data]);

    const initialServiceId = searchParams.get('service') || '';

    return (
        <div className={styles.booking}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>Онлайн-запись</p>
                <h1 className={styles.title}>Запись на услугу</h1>
                <p className={styles.sub_title}>
                    Выберите услугу и удобное время для визита.
                    Мы свяжемся с вами для подтверждения записи.
                </p>

                {isLoading && services.length === 0 && (
                    <Loader text="Загрузка услуг..." />
                )}

                {isError && !data?.length && (
                    <p className={styles.softNotice}>
                        Не удалось обновить список услуг.{' '}
                        <button type="button" className={styles.retryLink} onClick={() => refetch()}>
                            Повторить
                        </button>
                    </p>
                )}

                <BookingForm services={services} initialServiceId={initialServiceId} />
            </div>
        </div>
    );
};

export default Booking;

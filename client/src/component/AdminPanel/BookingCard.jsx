import React from 'react';
import styles from './BookingCard.module.css';

const BookingCard = ({ booking, onCancel }) => {
    const isPast = new Date(booking.date) < new Date();

    // Используем правильные поля из сервера
    const customerName = booking.client_name || 'Не указано';
    const phone = booking.client_phone || 'Не указано';
    const serviceName = booking.service_name
        || String(booking.service_id || '')
            .split(',')
            .map(id => id.trim())
            .filter(Boolean)
            .map(id => `Услуга #${id}`)
            .join(', ')
        || 'Не указано';
    const comment = booking.client_comment || booking.comment;

    return (
        <div className={`${styles.bookingCard} ${isPast ? styles.past : ''}`}>
            <div className={styles.bookingHeader}>
                <h3>{customerName}</h3>
                <span className={styles.bookingTime}>{booking.time}</span>
            </div>

            <div className={styles.bookingDetails}>
                <p><strong>Телефон:</strong> {phone}</p>
                <p><strong>Услуга:</strong> {serviceName}</p>
                <p><strong>Дата:</strong> {booking.date}</p>
                {comment && (
                    <p><strong>Комментарий:</strong> {comment}</p>
                )}
            </div>

            {!isPast && (
                <div className={styles.bookingActions}>
                    <button
                        className={styles.cancelBtn}
                        onClick={() => onCancel(booking.id)}
                    >
                        Отменить
                    </button>
                    <button className={styles.confirmBtn}>
                        Подтвердить
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingCard;
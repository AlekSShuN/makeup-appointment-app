import React from 'react';
import styles from './BookingList.module.css';

const BookingList = ({ bookings, onCancelBooking }) => {
    if (!bookings || bookings.length === 0) {
        return (
            <div className={styles.noBookings}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📅</div>
                    <h3>Нет записей</h3>
                    <p>Записи не найдены</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.bookingList}>
            {bookings.map(booking => (
                <div key={booking.id} className={styles.bookingItem}>
                    <div className={styles.bookingInfo}>
                        <h3 className={styles.clientName}>{booking.client_name}</h3>
                        <div className={styles.contactInfo}>
                            <span className={styles.phone}>📞 {booking.client_phone}</span>
                        </div>
                        <div className={styles.datetime}>
                            <span className={styles.date}>📅 {booking.date}</span>
                            <span className={styles.time}>в {booking.time}</span>
                        </div>
                        {booking.client_comment && (
                            <div className={styles.comment}>
                                <span className={styles.commentIcon}>💬</span>
                                <p className={styles.commentText}>{booking.client_comment}</p>
                            </div>
                        )}
                    </div>
                    <button
                        className={styles.cancelButton}
                        onClick={() => onCancelBooking(booking.id)}
                    >
                        Отменить
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BookingList;
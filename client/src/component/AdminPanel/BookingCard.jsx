import React from 'react';
import './BookingCard.modele.css';

const BookingCard = ({ booking, onCancel }) => {
    const isPast = new Date(booking.date) < new Date();

    return (
        <div className={`booking-card ${isPast ? 'past' : ''}`}>
            <div className="booking-header">
                <h3>{booking.client.name}</h3>
                <span className="booking-time">{booking.time}</span>
            </div>

            <div className="booking-details">
                <p><strong>Телефон:</strong> {booking.client.phone}</p>
                <p><strong>Услуга:</strong> {booking.service?.name}</p>
                <p><strong>Дата:</strong> {booking.date}</p>
                {booking.client.comment && (
                    <p><strong>Комментарий:</strong> {booking.client.comment}</p>
                )}
            </div>

            {!isPast && (
                <div className="booking-actions">
                    <button
                        className="cancel-btn"
                        onClick={() => onCancel(booking.id)}
                    >
                        Отменить
                    </button>
                    <button className="confirm-btn">
                        Подтвердить
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingCard;
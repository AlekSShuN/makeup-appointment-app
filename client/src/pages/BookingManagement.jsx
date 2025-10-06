import React, { useState } from 'react';
import BookingList from '../component/AdminPanel/BookingList.jsx';
import styles from './BookingManagement.module.css';

const BookingManagement = ({ bookings, onDeleteBooking, onRefresh }) => {
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Вы уверены, что хотите отменить запись?')) {
            try {
                setLoading(true);
                setError('');

                console.log('🔄 Starting cancel process for booking:', bookingId);

                const success = await onDeleteBooking(bookingId);

                if (success) {
                    console.log('✅ Booking cancelled successfully:', bookingId);
                    alert('✅ Запись успешно отменена');
                } else {
                    throw new Error('Не удалось отменить запись. Попробуйте еще раз.');
                }
            } catch (error) {
                console.error('❌ Ошибка отмены записи:', error);
                setError(error.message);
                alert(`❌ Не удалось отменить запись: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        onRefresh();
        // Загрузка закончится когда onRefresh завершится
        setTimeout(() => setLoading(false), 1000);
    };

    const filteredBookings = bookings.filter(booking => {
        const today = new Date().toISOString().split('T')[0];
        switch (filter) {
            case 'today':
                return booking.date === today;
            case 'upcoming':
                return booking.date >= today;
            case 'past':
                return booking.date < today;
            default:
                return true;
        }
    });

    // Реальная статистика для фильтров
    const todayBookings = bookings.filter(booking => booking.date === new Date().toISOString().split('T')[0]).length;
    const upcomingBookings = bookings.filter(booking => booking.date >= new Date().toISOString().split('T')[0]).length;
    const pastBookings = bookings.filter(booking => booking.date < new Date().toISOString().split('T')[0]).length;

    return (
        <div className={styles.bookingManagement}>
            <div className={styles.managementHeader}>
                <div className={styles.headerTop}>
                    <h2>Управление записями</h2>
                    <button
                        className={styles.refreshButton}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        {loading ? '🔄' : '↻'} Обновить
                    </button>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div className={styles.filters}>
                    <button
                        className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Все ({bookings.length})
                    </button>
                    <button
                        className={`${styles.filterButton} ${filter === 'today' ? styles.active : ''}`}
                        onClick={() => setFilter('today')}
                    >
                        Сегодня ({todayBookings})
                    </button>
                    <button
                        className={`${styles.filterButton} ${filter === 'upcoming' ? styles.active : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Предстоящие ({upcomingBookings})
                    </button>
                    <button
                        className={`${styles.filterButton} ${filter === 'past' ? styles.active : ''}`}
                        onClick={() => setFilter('past')}
                    >
                        Прошедшие ({pastBookings})
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Загрузка записей...</p>
                </div>
            ) : (
                <BookingList
                    bookings={filteredBookings}
                    onCancelBooking={handleCancelBooking}
                />
            )}
        </div>
    );
};

export default BookingManagement;
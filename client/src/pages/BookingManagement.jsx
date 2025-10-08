import React, { useState } from 'react';
import BookingList from '../component/AdminPanel/BookingList.jsx';
import styles from './BookingManagement.module.css';

const BookingManagement = ({ bookings, onDeleteBooking, onRefresh }) => {
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Добавляем состояние для успешных сообщений

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Вы уверены, что хотите отменить запись?')) {
            try {
                setLoading(true);
                setError('');
                setSuccessMessage(''); // Очищаем предыдущие сообщения

                console.log('🗑️ Deleting booking:', bookingId);

                const response = await fetch(`http://localhost:5002/api/bookings/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📡 Delete response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('✅ Delete result:', result);

                // Показываем успешное сообщение
                setSuccessMessage('✅ Запись успешно удалена');

                // Автоматически скрываем сообщение через 3 секунды
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);

                // Обновляем список бронирований
                onRefresh();
                return true;

            } catch (error) {
                console.error('❌ Delete error:', error);
                setError(`❌ Ошибка при удалении: ${error.message}`);
                return false;
            } finally {
                setLoading(false);
            }
        }
        return false;
    };

    const handleRefresh = () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
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

                {/* Показываем успешное сообщение */}
                {successMessage && (
                    <div className={styles.successMessage}>
                        {successMessage}
                    </div>
                )}

                {/* Показываем ошибку */}
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
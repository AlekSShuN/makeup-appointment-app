import React, { useState, useEffect } from 'react';
import BookingList from '../component/AdminPanel/BookingList.jsx';
import styles from './BookingManagement.module.css';

const BookingManagement = ({ onStatsUpdate }) => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📋 Fetching bookings from API...');
            const response = await fetch('/api/bookings');

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Bookings loaded:', data.length, 'records');

            setBookings(data);

            // Уведомляем родительский компонент об обновлении статистики
            if (onStatsUpdate) {
                onStatsUpdate();
            }

        } catch (error) {
            console.error('❌ Ошибка загрузки записей:', error);
            setError('Не удалось загрузить записи. Проверьте подключение к серверу.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Вы уверены, что хотите отменить запись?')) {
            try {
                const response = await fetch(`/api/bookings/${bookingId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const result = await response.json();
                    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
                    console.log('✅ Booking cancelled:', bookingId);

                    if (onStatsUpdate) {
                        onStatsUpdate();
                    }
                    alert('Запись успешно отменена');
                } else {
                    throw new Error('Не удалось отменить запись на сервере');
                }
            } catch (error) {
                console.error('❌ Ошибка отмены записи:', error);
                alert('Не удалось отменить запись');
            }
        }
    };

    const handleRefresh = () => {
        fetchBookings();
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
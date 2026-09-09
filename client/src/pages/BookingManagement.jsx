import { useState } from 'react';
import BookingList from '../component/AdminPanel/BookingList.jsx';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/api.js';
import styles from './BookingManagement.module.css';

const BookingManagement = ({ bookings, onDeleteBooking, onRefresh, error }) => {
    const { authFetch } = useAuth();
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    console.log('📋 BookingManagement received:', { bookingsCount: bookings.length });

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Вы уверены, что хотите отменить запись?')) {
            try {
                setLoading(true);
                setLocalError('');
                setSuccessMessage('');

                console.log('🗑️ Deleting booking:', bookingId);

                const response = await authFetch(`${API_BASE_URL}/bookings/${bookingId}`, {
                    method: 'DELETE',
                });

                console.log('📡 Delete response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('✅ Delete result:', result);

                setSuccessMessage('✅ Запись успешно удалена');

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);

                onRefresh();
                return true;

            } catch (error) {
                console.error('❌ Delete error:', error);
                setLocalError(`❌ Ошибка при удалении: ${error.message}`);
                return false;
            } finally {
                setLoading(false);
            }
        }
        return false;
    };

    const handleRefresh = () => {
        setLoading(true);
        setLocalError('');
        setSuccessMessage('');
        onRefresh();
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
                {localError && (
                    <div className={styles.errorMessage}>
                        {localError}
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
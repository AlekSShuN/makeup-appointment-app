import { useState, useEffect } from 'react';
import AdminSidebar from '../component/AdminPanel/AdminSidebar';
import BookingManagement from './BookingManagement';
import { useAuth } from '../contexts/AuthContext';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [todayStats, setTodayStats] = useState(0);
    const [totalStats, setTotalStats] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { authFetch, isAuthenticated, isLoading: authLoading, user } = useAuth();

    useEffect(() => {
        console.log('🔄 AdminPanel useEffect, isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
            fetchBookings();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const fetchBookings = async () => {
        try {
            console.log('🔐 Fetching bookings...');
            setIsLoading(true);
            const response = await authFetch('https://makeup-appointment-app-backend.onrender.com/api/bookings');

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Bookings loaded:', data);
            setBookings(data);
            updateStats(data);
            setError('');
        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
            setError('Ошибка загрузки записей: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStats = (bookingsData) => {
        const today = new Date().toISOString().split('T')[0];
        const todayCount = bookingsData.filter(booking => booking.date === today).length;
        setTodayStats(todayCount);
        setTotalStats(bookingsData.length);
        console.log('📊 Stats updated - today:', todayCount, 'total:', bookingsData.length);
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            console.log('🗑️ Deleting booking:', bookingId);
            const response = await authFetch(`https://makeup-appointment-app-backend.onrender.com/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления');
            }

            const result = await response.json();
            if (result.success) {
                const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
                setBookings(updatedBookings);
                updateStats(updatedBookings);
                return true;
            }
        } catch (error) {
            console.error('❌ Delete error:', error);
            setError(error.message);
            return false;
        }
    };

    const handleRefresh = () => {
        fetchBookings();
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin-login';
    };

    // ✅ Показываем загрузку
    if (authLoading || isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <h2>Загрузка...</h2>
                <p>Пожалуйста, подождите</p>
            </div>
        );
    }

    // ✅ Если не авторизован
    if (!isAuthenticated) {
        return (
            <div className={styles.authRequiredContainer}>
                <h2>Требуется авторизация</h2>
                <p>Для доступа к панели управления необходимо войти в систему.</p>
                <a href="/admin-login" className={styles.loginButton}>
                    Войти в систему
                </a>
            </div>
        );
    }

    console.log('🎯 Rendering AdminPanel with:', {
        bookingsCount: bookings.length,
        activeSection,
        user
    });

    const renderSection = () => {
        switch (activeSection) {
            case 'bookings':
                return (
                    <BookingManagement
                        bookings={bookings}
                        onDeleteBooking={handleDeleteBooking}
                        onRefresh={handleRefresh}
                        error={error}
                    />
                );
            case 'analytics':
                return (
                    <div className={styles.sectionContent}>
                        <h2>Аналитика</h2>
                        <p>Раздел аналитики в разработке...</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className={styles.sectionContent}>
                        <h2>Настройки</h2>
                        <p>Раздел настроек в разработке...</p>
                    </div>
                );
            default:
                return (
                    <BookingManagement
                        bookings={bookings}
                        onDeleteBooking={handleDeleteBooking}
                        onRefresh={handleRefresh}
                        error={error}
                    />
                );
        }
    };

    return (
        <div className={styles.adminPanel}>
            <div className={styles.adminMain}>
                <AdminSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />
                <div className={styles.adminContent}>
                    <div className={styles.contentWrapper}>
                        <header className={styles.adminHeader}>
                            <div className={styles.headerContent}>
                                <h1 className={styles.adminTitle}>Панель управления</h1>
                                <div className={styles.userInfo}>
                                    <span>Администратор: <strong>{user?.username}</strong></span>
                                    <button
                                        onClick={handleLogout}
                                        className={styles.logoutButton}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                            <div className={styles.statsContainer}>
                                <div className={styles.statsCard}>
                                    <span className={styles.statsNumber}>{todayStats}</span>
                                    <span className={styles.statsLabel}>записей сегодня</span>
                                </div>
                                <div className={styles.statsCard}>
                                    <span className={styles.statsNumber}>{totalStats}</span>
                                    <span className={styles.statsLabel}>всего записей</span>
                                </div>
                            </div>
                        </header>

                        {error && (
                            <div className={styles.errorAlert}>
                                <strong>Ошибка:</strong> {error}
                                <button
                                    onClick={() => setError('')}
                                    className={styles.errorCloseButton}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {bookings.length === 0 && !isLoading && (
                            <div className={styles.emptyState}>
                                <h3>Записей нет</h3>
                                <p>На данный момент нет активных бронирований.</p>
                                <button
                                    onClick={handleRefresh}
                                    className={styles.refreshButton}
                                >
                                    Обновить
                                </button>
                            </div>
                        )}

                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
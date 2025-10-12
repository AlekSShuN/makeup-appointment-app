import React, { useState, useEffect } from 'react';
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
            const response = await authFetch('http://localhost:5002/api/bookings');

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
            const response = await authFetch(`http://localhost:5002/api/bookings/${bookingId}`, {
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

    // ✅ Показываем загрузку
    if (authLoading || isLoading) {
        return (
            <div style={{
                padding: '50px',
                textAlign: 'center',
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h2>Загрузка...</h2>
                <p>Пожалуйста, подождите</p>
            </div>
        );
    }

    // ✅ Если не авторизован
    if (!isAuthenticated) {
        return (
            <div style={{
                padding: '50px',
                textAlign: 'center',
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h2>Требуется авторизация</h2>
                <p>Для доступа к панели управления необходимо войти в систему.</p>
                <a
                    href="/admin-login"
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        marginTop: '20px'
                    }}
                >
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h1 className={styles.adminTitle}>Панель управления</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span>Администратор: <strong>{user?.username}</strong></span>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('admin_token');
                                            window.location.href = '/admin-login';
                                        }}
                                        style={{
                                            padding: '5px 10px',
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
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
                            <div style={{
                                background: '#ffebee',
                                color: '#c62828',
                                padding: '15px',
                                borderRadius: '4px',
                                marginBottom: '20px',
                                border: '1px solid #f5c6cb'
                            }}>
                                <strong>Ошибка:</strong> {error}
                                <button
                                    onClick={() => setError('')}
                                    style={{
                                        float: 'right',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '18px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {bookings.length === 0 && !isLoading && (
                            <div style={{
                                background: '#e7f3ff',
                                color: '#0066cc',
                                padding: '20px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}>
                                <h3>Записей нет</h3>
                                <p>На данный момент нет активных бронирований.</p>
                                <button
                                    onClick={handleRefresh}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
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
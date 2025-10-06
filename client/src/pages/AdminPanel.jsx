import React, { useState, useEffect } from 'react';
import AdminSidebar from '../component/AdminPanel/AdminSidebar';
import BookingManagement from './BookingManagement';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [todayStats, setTodayStats] = useState(0);
    const [totalStats, setTotalStats] = useState(0);

    useEffect(() => {
        const isAdmin = localStorage.getItem('adminAuth');
        if (!isAdmin) {
            alert('Доступ запрещен');
            window.location.href = '/';
        }

        // Загружаем бронирования и статистику при монтировании
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            if (response.ok) {
                const bookingsData = await response.json();
                setBookings(bookingsData);
                updateStats(bookingsData);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const updateStats = (bookingsData) => {
        // Статистика на сегодня
        const today = new Date().toISOString().split('T')[0];
        const todayCount = bookingsData.filter(booking => booking.date === today).length;
        setTodayStats(todayCount);

        // Общее количество записей
        setTotalStats(bookingsData.length);
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            console.log('🗑️ Sending DELETE request for booking:', bookingId);

            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 DELETE response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ DELETE response data:', result);

            if (result.success) {
                const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
                setBookings(updatedBookings);
                updateStats(updatedBookings);

                return true;
            } else {
                throw new Error(result.message || 'Неизвестная ошибка сервера');
            }
        } catch (error) {
            console.error('❌ Error deleting booking:', error);
            return false;
        }
    };

    const handleRefresh = () => {
        fetchBookings();
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'bookings':
                return (
                    <BookingManagement
                        bookings={bookings}
                        onDeleteBooking={handleDeleteBooking}
                        onRefresh={handleRefresh}
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
                            <h1 className={styles.adminTitle}>Панель управления</h1>
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
                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
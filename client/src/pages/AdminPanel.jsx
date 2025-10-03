import React, { useState, useEffect } from 'react';
import AdminSidebar from '../component/AdminPanel/AdminSidebar';
import BookingManagement from './BookingManagement';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('bookings');
    const [todayStats, setTodayStats] = useState(0);
    const [totalStats, setTotalStats] = useState(0);

    useEffect(() => {
        const isAdmin = localStorage.getItem('adminAuth');
        if (!isAdmin) {
            alert('Доступ запрещен');
            window.location.href = '/';
        }

        // Загружаем статистику при монтировании
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/bookings');
            if (response.ok) {
                const bookings = await response.json();

                // Статистика на сегодня
                const today = new Date().toISOString().split('T')[0];
                const todayCount = bookings.filter(booking => booking.date === today).length;
                setTodayStats(todayCount);

                // Общее количество записей
                setTotalStats(bookings.length);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Функция для обновления статистики из дочернего компонента
    const handleStatsUpdate = () => {
        fetchStats();
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'bookings':
                return <BookingManagement onStatsUpdate={handleStatsUpdate} />;
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
                return <BookingManagement onStatsUpdate={handleStatsUpdate} />;
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
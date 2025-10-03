import React from 'react';
import styles from './AdminSidebar.module.css';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
    const menuItems = [
        { id: 'bookings', label: 'Записи', icon: '📅' },
        { id: 'analytics', label: 'Аналитика', icon: '📊' },
        { id: 'settings', label: 'Настройки', icon: '⚙️' }
    ];

    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('adminAuth');
            window.location.href = '/';
        }
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarTitle}>Админ-панель</h2>
            </div>

            <nav className={styles.sidebarNav}>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`${styles.navButton} ${activeSection === item.id ? styles.navButtonActive : ''
                            }`}
                        onClick={() => setActiveSection(item.id)}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span className={styles.navLabel}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className={styles.sidebarFooter}>
                <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                >
                    <span className={styles.logoutIcon}>🚪</span>
                    <span className={styles.logoutText}>Выйти</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
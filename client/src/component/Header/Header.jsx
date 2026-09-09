import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const clickTimerRef = useRef(null);

    useEffect(() => {
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth === 'true') {
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        return () => {
            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current);
            }
        };
    }, []);

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogoClick = () => {
        setClickCount(prev => {
            const newCount = prev + 1;

            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current);
            }

            if (newCount >= 3) {
                localStorage.setItem('adminAuth', 'true');
                setIsAdmin(true);
                return 0;
            }

            clickTimerRef.current = setTimeout(() => {
                setClickCount(0);
            }, 1500);

            return newCount;
        });
    };

    const logoutAdmin = () => {
        localStorage.removeItem('adminAuth');
        setIsAdmin(false);
        closeMenu();
    };

    const navClass = ({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link
                    to="/"
                    onClick={() => {
                        closeMenu();
                        handleLogoClick();
                    }}
                >
                    MISS_NADYA MAKEUP
                </Link>
            </div>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`} aria-label="Основное меню">
                <ul className={styles.navList}>
                    <li><NavLink to="/" className={navClass} onClick={closeMenu} end>Главная</NavLink></li>
                    <li><NavLink to="/services" className={navClass} onClick={closeMenu}>Услуги</NavLink></li>
                    <li><NavLink to="/portfolio" className={navClass} onClick={closeMenu}>Портфолио</NavLink></li>
                    <li><NavLink to="/contacts" className={navClass} onClick={closeMenu}>Контакты</NavLink></li>
                </ul>
                {isAdmin && (
                    <div className={styles.mobileAdmin}>
                        <Link to="/admin" className={styles.adminLink} onClick={closeMenu}>
                            Админ-панель
                        </Link>
                        <button className={styles.logoutButton} onClick={logoutAdmin}>
                            Выйти
                        </button>
                    </div>
                )}
            </nav>

            <div className={styles.headerButtons}>
                {isAdmin && (
                    <>
                        <Link to="/admin" className={`${styles.adminLink} ${styles.desktopOnly}`} onClick={closeMenu}>
                            Админ-панель
                        </Link>
                        <button
                            className={`${styles.logoutButton} ${styles.desktopOnly}`}
                            onClick={logoutAdmin}
                        >
                            Выйти
                        </button>
                    </>
                )}
                <Link to="/booking" className={styles.bookingButton} onClick={closeMenu}>
                    Записаться
                </Link>
            </div>

            <button
                className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
                onClick={() => setIsMenuOpen(open => !open)}
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMenuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
};

export default Header;

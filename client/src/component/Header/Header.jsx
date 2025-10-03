import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const clickTimerRef = useRef(null);

    // Проверяем при загрузке, авторизован ли админ
    useEffect(() => {
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth === 'true') {
            setIsAdmin(true);
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Функция для скрытой активации по тройному клику на логотип
    const handleLogoClick = () => {
        setClickCount(prev => {
            const newCount = prev + 1;

            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current);
            }

            if (newCount >= 3) {
                localStorage.setItem('adminAuth', 'true');
                setIsAdmin(true);
                alert('Админ-доступ активирован!');
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
        alert('Вы вышли из админ-панели');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/" onClick={(e) => {
                    closeMenu();
                    handleLogoClick();
                }}>MISS_NADYA MAKEUP</Link>
            </div>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                <ul className={styles.navList}>
                    <li><Link to="/" className={styles.navLink} onClick={closeMenu}>Главная</Link></li>
                    <li><Link to="/services" className={styles.navLink} onClick={closeMenu}>Услуги</Link></li>
                    <li><Link to="/portfolio" className={styles.navLink} onClick={closeMenu}>Портфолио</Link></li>
                    <li><Link to="/contacts" className={styles.navLink} onClick={closeMenu}>Контакты</Link></li>
                </ul>
            </nav>

            <div className={styles.headerButtons}>
                {isAdmin && (
                    <>
                        <Link
                            to="/admin"
                            className={styles.adminLink}
                            onClick={closeMenu}
                        >
                            Админ-панель
                        </Link>
                        <button
                            className={styles.logoutButton}
                            onClick={() => {
                                logoutAdmin();
                                closeMenu();
                            }}
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
                onClick={toggleMenu}
                aria-label='Открыть меню'
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
};

export default Header;
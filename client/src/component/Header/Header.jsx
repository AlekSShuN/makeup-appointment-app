import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { useState } from 'react';

const Header = () => {
    const location = useLocation(); // получаем данные о текущем URL
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.classList.toggle('menu-open', !isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    }

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo}>
                    MISS_NADYA MAKEUP
                </Link>
                <button className={`${styles.menuToggle} ${isMenuOpen ? styles.active : ''}`}
                    onClick={toggleMenu}
                    aria-label='Открыть меню'
                    aria-expanded={isMenuOpen}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`${styles.navList} ${isMenuOpen ? styles.active : ''}`}>
                    <li>
                        <Link
                            to="/"
                            className={location.pathname === '/' ? styles.active : ''}
                            onClick={closeMenu}
                        >
                            Главная
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/services"
                            className={location.pathname === '/services' ? styles.active : ''}
                            onClick={closeMenu}
                        >
                            Услуги
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/portfolio"
                            className={location.pathname === '/portfolio' ? styles.active : ''}
                            onClick={closeMenu}
                        >
                            Портфолио
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contacts"
                            className={location.pathname === '/contacts' ? styles.active : ''}
                            onClick={closeMenu}
                        >
                            Контакты
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/booking"
                            className={`${styles.bookingLink} ${location.pathname === '/booking' ? styles.active : ''}`}
                            onClick={closeMenu}
                        >
                            Запись
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
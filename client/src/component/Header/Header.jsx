import { useState } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMemu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/" onClick={closeMemu}>MISS_NADYA MAKEUP</Link>
            </div>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                <ul className={styles.navList}>
                    <li><Link to="/" className={styles.navLink} onClick={closeMemu}>Главная</Link></li>
                    <li><Link to="/services" className={styles.navLink} onClick={closeMemu}>Услуги</Link></li>
                    <li><Link to="/portfolio" className={styles.navLink} onClick={closeMemu}>Портфолио</Link></li>
                    <li><Link to="/contacts" className={styles.navLink} onClick={closeMemu}>Контакты</Link></li>
                </ul>
            </nav>

            <Link to="/booking" className={styles.bookingButton} onClick={closeMemu}>Записаться</Link>

            <button className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
                onClick={toggleMenu}
                aria-label='Открыть меню'>
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
};

export default Header;
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation(); // получаем данные о текущем URL

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo}>
                    MISS_NADYA MAKEUP
                </Link>
                <ul className={styles.navList}>
                    <li><Link to="/" className={location.pathname === '/' ? styles.active : ''}>Главная</Link></li>
                    <li><Link to="/services" className={location.pathname === '/services' ? styles.active : ''}>Услуги</Link></li>
                    <li><Link to="/portfolio" className={location.pathname === '/portolio' ? styles.active : ''}>Портфолио</Link></li>
                    <li><Link to="/contacts" className={location.pathname === '/contacts' ? styles.active : ''}>Контакты</Link></li>
                    <li><Link to="/booking" className={`${styles.bookingLink} ${location.pathname === '/booking' ? styles.active : ''}`}>Запись</Link></li>
                </ul>
                <div className={styles.menuToggle}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header >
    );
};

export default Header;
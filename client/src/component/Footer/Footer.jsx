import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} MISS_NADYA MUKEUP. Все права защищены.</p>
            <div className={styles.socials}>
                <a href="#" className={styles.socialLink} aria-label="Instagram">Instagram</a>
                <a href="#" className={styles.socialLink} aria-label='Telegram'>Telegram</a>
                <a href="#" className={styles.socialLink} aria-label='VK'>VK</a>
            </div>
        </footer>
    );
};

export default Footer;
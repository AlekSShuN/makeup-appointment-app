import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} MISS_NADYA MUKEUP. Все права защищены.</p>
            <div className={styles.socials}>
                <a href="#" aria-label="Instagram">Instagram</a>
                <a href="#" aria-label='Telegram'>Telegram</a>
                <a href="#" aria-label='VK'>VK</a>
            </div>
        </footer>
    );
};

export default Footer;
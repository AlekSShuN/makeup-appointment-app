import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} MISS_NADYA MUKEUP. Все права защищены.</p>
            <div className={styles.socials}>
                <a href="https://www.instagram.com/miss_nadyaa_makeup?igsh=dXNwdGc1bzZibWo2" className={styles.socialLink} aria-label="Instagram">Instagram</a>
                <a href="https://t.me/+A2RRxZ5LmN8wM2Ni" className={styles.socialLink} aria-label='Telegram'>Telegram</a>
                <a href="https://vk.com/club211908715" className={styles.socialLink} aria-label='VK'>VK</a>
            </div>
        </footer>
    );
};

export default Footer;
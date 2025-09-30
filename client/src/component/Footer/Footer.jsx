import styles from './Footer.module.css';

import instagramIcon from '../../assets/image/icons/instagram.png';
import telegramIcon from '../../assets/image/icons/telegram.png';
import vkIcon from '../../assets/image/icons/vk.png';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} MISS_NADYA MAKEUP. Все права защищены.</p>
            <div className={styles.socials}>
                <a
                    href="https://www.instagram.com/miss_nadyaa_makeup?igsh=dXNwdGc1bzZibWo2"
                    className={styles.socialLink}
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={instagramIcon} alt="Instagram" width="24" height="24" loading="lazy" />
                </a>
                <a
                    href="https://t.me/+A2RRxZ5LmN8wM2Ni"
                    className={styles.socialLink}
                    aria-label='Telegram'
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={telegramIcon} alt="Telegram" width="24" height="24" loading="lazy" />
                </a>
                <a
                    href="https://vk.com/club211908715"
                    className={styles.socialLink}
                    aria-label='VK'
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={vkIcon} alt="VK" width="24" height="24" loading="lazy" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
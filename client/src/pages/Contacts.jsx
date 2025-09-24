import styles from './Contact.module.css';

const Contacts = () => {
    const contacts = {
        address: "г.Саранск",
        phone: "+7(999)",
        email: "",
        social: {
            instagram: "https://instagram.com/",
            vk: "https://vk.com/",
            telegram: "htpps://t.me/beau"
        }
    };

    return (
        <section className={styles.contacts}>
            <div className={styles.container}>
                <h1 className={styles.title}>Контакты</h1>
                <p className={styles.subtitle}>Мы всегда рады вас видеть в нашем салоне</p>

                <div className={styles.content}>
                    <div className={styles.info}>
                        <div className={styles.infoCard}>
                            <div className={styles.icon}>📍</div>
                            <div>
                                <h3>Адрес салона</h3>
                                <p>{contacts.address}</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.icon}>📞</div>
                            <div>
                                <h3>Телефон</h3>
                                <a href={`tel:${contacts.phone}`} className={styles.link}>{contacts.phone}</a>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.icon}>✉️</div>
                            <div>
                                <h3>Email</h3>
                                <a href={`mail:${contacts.email}`} className={styles.link}>{contacts.email}</a>
                            </div>
                        </div>

                        <div className={styles.social}>
                            <h3>Мы в соцсетях</h3>
                            <div className={styles.socialLinks}>
                                <a href={contacts.social.instagram} className={styles.socialLink}>Instagram</a>
                                <a href={contacts.social.telegram} className={styles.socialLink}>Telegram</a>
                                <a href={contacts.social.vk} className={styles.socialLink}>VK</a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.map}>
                        <div className={styles.mapContainer}></div>
                    </div>
                </div>
            </div>
        </section >
    )
};

export default Contacts;
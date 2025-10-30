import { useState, useEffect, useCallback } from 'react';
import styles from './Contact.module.css';

import instagramIcon from '../assets/image/icons/instagram.png';
import telegramIcon from '../assets/image/icons/telegram.png';
import vkIcon from '../assets/image/icons/vk.png';

const WORKING_HOURS = {
    weekdays: { start: 9, end: 19 },
    weekend: { start: 10, end: 19 }
};

const MAP_CONFIG = {
    lat: 54.18321,
    lng: 45.18092,
    zoom: 17,
    size: '600,400'
};

const Contacts = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [mapError, setMapError] = useState(false);

    const contacts = {
        address: "г. Саранск, ул. Большевистская, 30",
        phone: "+7 (917) 637-64-81",
        workingHours: {
            weekdays: "09:00 - 19:00",
            weekend: "10:00 - 19:00"
        },
        social: {
            instagram: "https://www.instagram.com/miss_nadyaa_makeup?igsh=dXNwdGc1bzZibWo2",
            vk: "https://vk.com/club211908715",
            telegram: "https://t.me/+A2RRxZ5LmN8wM2Ni",
        }
    };

    const updateTime = useCallback(() => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        }));
    }, []);

    const isOpen = useCallback(() => {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();

        // Воскресенье или суббота 
        if (day === 0 || day === 6) {
            return hour >= WORKING_HOURS.weekend.start && hour < WORKING_HOURS.weekend.end;
        }
        // Будни
        return hour >= WORKING_HOURS.weekdays.start && hour < WORKING_HOURS.weekdays.end;
    }, []);

    const staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${MAP_CONFIG.lng},${MAP_CONFIG.lat}&size=${MAP_CONFIG.size}&z=${MAP_CONFIG.zoom}&l=map&pt=${MAP_CONFIG.lng},${MAP_CONFIG.lat},pm2grl`;
    const yandexMapsUrl = `https://yandex.ru/maps/?pt=${MAP_CONFIG.lng},${MAP_CONFIG.lat}&z=${MAP_CONFIG.zoom}&l=map`;

    const handleMapError = () => {
        setMapError(true);
    };

    useEffect(() => {
        setIsVisible(true);
        updateTime();
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, [updateTime]);

    const getStatusInfo = () => {
        const open = isOpen();
        return {
            isOpen: open,
            text: open ? '🟢 Сейчас открыто' : '🔴 Сейчас закрыто',
            description: open ? 'Можете звонить и приходить!' : 'Запишитесь онлайн на удобное время'
        };
    };

    const statusInfo = getStatusInfo();

    return (
        <section className={`${styles.contacts} ${isVisible ? styles.visible : ''}`} id="contacts">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Мои контакты</h1>
                    <p className={styles.subtitle}>
                        Приходите в гости - создадим вашу идеальную красоту вместе!
                    </p>
                    <div className={styles.status}>
                        <span
                            className={`${styles.statusIndicator} ${statusInfo.isOpen ? styles.open : styles.closed}`}
                            title={statusInfo.description}
                        >
                            {statusInfo.text}
                        </span>
                        <span className={styles.currentTime}>Текущее время: {currentTime}</span>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.info}>
                        <div className={styles.infoCard}>
                            <div className={styles.icon}>🏢</div>
                            <div className={styles.infoContent}>
                                <h3>Адрес салона</h3>
                                <p>{contacts.address}</p>
                                <span className={styles.metro}>🚇 5 минут от остановки Главпочтампт</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.icon}>📞</div>
                            <div className={styles.infoContent}>
                                <h3>Телефон для записи</h3>
                                <a
                                    href={`tel:${contacts.phone.replace(/\D/g, '')}`}
                                    className={styles.phoneLink}
                                >
                                    {contacts.phone}
                                </a>
                                <p className={styles.phoneHint}>Нажмите для звонка</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.icon}>🕒</div>
                            <div className={styles.infoContent}>
                                <h3>Время работы</h3>
                                <p>Пн-Пт: {contacts.workingHours.weekdays}</p>
                                <p>Сб-Вс: {contacts.workingHours.weekend}</p>
                            </div>
                        </div>

                        <div className={styles.socialSection}>
                            <h3>Подписывайтесь на меня</h3>
                            <p>Следите за акциями и новинками</p>
                            <div className={styles.socialLinks}>
                                <a
                                    href={contacts.social.instagram}
                                    className={styles.socialLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram профиль"
                                >
                                    <img src={instagramIcon} alt="" />
                                    <span>Instagram</span>
                                </a>
                                <a
                                    href={contacts.social.telegram}
                                    className={styles.socialLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Telegram канал"
                                >
                                    <img src={telegramIcon} alt="" />
                                    <span>Telegram</span>
                                </a>
                                <a
                                    href={contacts.social.vk}
                                    className={styles.socialLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="ВКонтакте группа"
                                >
                                    <img src={vkIcon} alt="" />
                                    <span>VK</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.mapSection}>
                        <h3>Мы находимся здесь:</h3>
                        <div className={styles.mapContainer}>
                            <a
                                href={yandexMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mapLink}
                                aria-label="Открыть местоположение в Яндекс Картах"
                            >
                                {!mapError ? (
                                    <img
                                        src={staticMapUrl}
                                        alt={`Салон красоты по адресу ${contacts.address}`}
                                        className={styles.staticMap}
                                        onError={handleMapError}
                                    />
                                ) : (
                                    <div className={styles.mapFallback}>
                                        <div className={styles.fallbackIcon}>🗺️</div>
                                        <p>Карта не загрузилась</p>
                                        <span>Нажмите чтобы открыть в Яндекс Картах</span>
                                    </div>
                                )}
                                <div className={styles.mapOverlay}>
                                    <span>📍 Нажмите чтобы открыть карту</span>
                                </div>
                            </a>
                        </div>
                        <p className={styles.mapHint}>
                            Нажмите на карту для открытия в Яндекс Картах
                        </p>
                    </div>
                </div>

                <div className={styles.ctaSection}>
                    <h3>Записаться онлайн</h3>
                    <p>Выберите удобное время и услугу</p>
                    <a
                        href="/booking"
                        className={styles.bookingButton}
                        aria-label="Перейти к записи на услугу"
                    >
                        📅 Записаться на образ
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
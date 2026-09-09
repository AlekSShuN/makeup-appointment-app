import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { FEATURED_SERVICES } from '../data/services.js';

const SLIDE_INTERVAL = 4000;

const SLIDES = [
    { image: "/slider/slider1.webp", alt: "Вечерний макияж" },
    { image: "/slider/slider2.webp", alt: "Свадебный макияж" },
    { image: "/slider/slider3.webp", alt: "Дневной макияж" },
    { image: "/slider/slider6.webp", alt: "Макияж" },
    { image: "/slider/slider4.webp", alt: "Макияж" },
    { image: "/slider/slider5.webp", alt: "Макияж" },
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sectionRefs = useRef([]);
    const observerRef = useRef(null);

    useEffect(() => {
        const slideTimer = setInterval(() => {
            setCurrentSlide(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1));
        }, SLIDE_INTERVAL);

        return () => clearInterval(slideTimer);
    }, []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                        observerRef.current.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        sectionRefs.current.forEach(ref => {
            if (ref) observerRef.current.observe(ref);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    const addSectionRef = useCallback((el, index) => {
        sectionRefs.current[index] = el;
    }, []);

    return (
        <div className={styles.home}>
            <section ref={(el) => addSectionRef(el, 0)} className={styles.hero}>
                <div className={styles.heroBackground}>
                    {SLIDES.map((slide, index) => (
                        <img
                            key={slide.image}
                            src={slide.image}
                            alt={slide.alt}
                            className={`${styles.heroImage} ${index === currentSlide ? styles.heroImageActive : ''}`}
                            fetchPriority={index === 0 ? 'high' : 'low'}
                        />
                    ))}
                    <div className={styles.heroOverlay}></div>
                </div>

                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <p className={styles.heroEyebrow}>Miss Nadya Makeup</p>
                        <h1 className={styles.heroTitle}>
                            Визажист / hair-стилист
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Красота — это сила, а макияж то, что действительно её подчеркивает. Это женский секрет.
                        </p>
                        <div className={styles.heroButtons}>
                            <Link to="/booking" className={styles.heroButtonPrimary}>
                                Записаться
                            </Link>
                            <Link to="/portfolio" className={styles.heroButtonSecondary}>
                                Смотреть работы
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 1)} className={styles.featuredServices}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Популярные услуги</h2>
                    <div className={styles.servicesGrid}>
                        {FEATURED_SERVICES.map((service) => (
                            <Link
                                key={service.id}
                                to={`/booking?service=${service.id}`}
                                className={styles.serviceCard}
                            >
                                <div className={styles.imageContainer}>
                                    <img
                                        src={service.image}
                                        alt={service.alt}
                                        className={styles.serviceImage}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.serviceContent}>
                                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                                    <p className={styles.price}>{service.price}</p>
                                    <span className={styles.serviceDesc}>{service.desc}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 2)} className={styles.about}>
                <div className={styles.container}>
                    <div className={styles.aboutContent}>
                        <div className={styles.aboutImage}>
                            <img src="/images/services/miss_nadya.webp" alt="Визажист Надежда" loading="lazy" />
                        </div>
                        <div className={styles.aboutText}>
                            <h2 className={styles.sectionTitle}>Обо мне</h2>
                            <h3 className={styles.aboutSubtitle}>Ваш стилист Надежда</h3>
                            <p className={styles.aboutParagraph}>В сфере красоты с 2020 года. Я убеждена, что макияж — это инструмент, который подчеркивает вашу уникальность, а не скрывает ее.</p>
                            <p className={styles.aboutParagraph}>Каждый год я прохожу повышение квалификации и изучаю новые техники, чтобы предлагать вам самые актуальные и современные решения.</p>
                            <ul className={styles.achievementsList}>
                                <li className={styles.achievementItem}>Опыт работы на съемках для журналов</li>
                                <li className={styles.achievementItem}>Более 300 довольных клиентов</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 3)} className={styles.testimonials}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Отзывы клиентов</h2>
                    <div className={styles.testimonialsGrid}>
                        <div className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>❝</div>
                            <p className={styles.testimonialText}>Надежда сделала мой свадебный макияж. Я выглядела идеально и чувствовала себя уверенно весь день!</p>
                            <span className={styles.testimonialAuthor}>Анастасия</span>
                        </div>
                        <div className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>❝</div>
                            <p className={styles.testimonialText}>Профессионал высшего класса! Уроки макияжа изменили мое отношение к косметике.</p>
                            <span className={styles.testimonialAuthor}>Екатерина</span>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 4)} className={styles.pwaSection}>
                <div className={styles.container}>
                    <div className={styles.pwaCard}>
                        <div className={styles.pwaHeader}>
                            <h2 className={styles.pwaTitle}>Установите приложение</h2>
                            <p className={styles.pwaSubtitle}>Быстрый доступ к записи без браузера</p>
                        </div>

                        <div className={styles.installSteps}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h3>Нажмите «Поделиться»</h3>
                                    <p>В Safari найдите кнопку 📤 в нижней панели</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h3>Выберите «На экран Домой»</h3>
                                    <p>Прокрутите меню вниз до этой опции</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>3</div>
                                <div className={styles.stepContent}>
                                    <h3>Нажмите «Добавить»</h3>
                                    <p>Приложение появится на главном экране</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

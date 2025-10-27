import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Home.module.css';


const SLIDE_INTERVAL = 4000;

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRefs = useRef([]);
    const observerRef = useRef(null);

    const slides = [
        { image: "/slider/slider1.webp", alt: "Вечерний макияж" },
        { image: "/slider/slider2.webp", alt: "Свадебный макияж" },
        { image: "/slider/slider3.webp", alt: "Дневной макияж" },
        { image: "/slider/slider6.webp", alt: "Макияж" },
        { image: "/slider/slider4.webp", alt: "Макияж" },
        { image: "/slider/slider5.webp", alt: "Макияж" },
    ];

    const preloadImages = useCallback(async () => {
        const promises = slides.map(slide => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = slide.image;
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        await Promise.all(promises);
        setIsLoading(false);
    }, [slides]);

    useEffect(() => {
        preloadImages();

        const slideTimer = setInterval(() => {
            setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        }, SLIDE_INTERVAL);

        return () => {
            clearInterval(slideTimer);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [preloadImages, slides.length]);

    useEffect(() => {
        if (isLoading) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    }
                });
            },
            { threshold: 0.1 }
        );

        sectionRefs.current.forEach(ref => {
            if (ref) observerRef.current.observe(ref);
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isLoading]);

    const addSectionRef = useCallback((el, index) => {
        sectionRefs.current[index] = el;
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.beautyLoader}></div>
            </div>
        );
    }

    return (
        <div className={styles.home}>
            <section ref={(el) => addSectionRef(el, 0)} className={styles.hero}>
                <div className={styles.heroBackground}>
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].alt}
                        className={styles.heroImage}
                    />
                    <div className={styles.heroOverlay}></div>
                </div>

                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Визажист / hair-стилист
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Красота-это сила, а макияж то, что действительно её подчеркивает. Это женский секрет.
                        </p>
                        <div className={styles.heroButtons}>
                            <a href="/services" className={styles.heroButtonPrimary}>
                                Записаться
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 1)} className={styles.featuredServices}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Популярные услуги</h2>
                    <div className={styles.servicesGrid}>
                        <a href="/services#wedding" className={styles.serviceCard}>
                            <div className={styles.imageContainer}>
                                <img
                                    src="/images/services/wedding-makeup.webp"
                                    alt="Свадебный макияж"
                                    className={styles.serviceImage}
                                />
                            </div>
                            <div className={styles.serviceContent}>
                                <h3 className={styles.serviceTitle}>Свадебный образ</h3>
                                <p className={styles.price}>6 000 ₽</p>
                                <span className={styles.serviceDesc}>Идеальный образ для самого важного дня</span>
                            </div>
                        </a>

                        <a href="/services#evening" className={styles.serviceCard}>
                            <div className={styles.imageContainer}>
                                <img
                                    src="/images/services/evening-makeup.webp"
                                    alt="Вечерний макияж"
                                    className={styles.serviceImage}
                                />
                            </div>
                            <div className={styles.serviceContent}>
                                <h3 className={styles.serviceTitle}>Вечерний макияж</h3>
                                <p className={styles.price}>2 300 ₽</p>
                                <span className={styles.serviceDesc}>Для особых мероприятий и выходов</span>
                            </div>
                        </a>

                        <a href="/services#lesson" className={styles.serviceCard}>
                            <div className={styles.imageContainer}>
                                <img
                                    src="/images/services/makeup-lesson.webp"
                                    alt="Уроки макияжа"
                                    className={styles.serviceImage}
                                />
                            </div>
                            <div className={styles.serviceContent}>
                                <h3 className={styles.serviceTitle}>Урок макияжа для себя</h3>
                                <p className={styles.price}>4 500 ₽</p>
                                <span className={styles.serviceDesc}>Научимся создавать идеальный образ</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 2)} className={styles.about}>
                <div className={styles.container}>
                    <div className={styles.aboutContent}>
                        <div className={styles.aboutImage}>
                            <img src="/images/services/miss_nadya.webp" alt="Визажист Надежда" />
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
                            <p className={styles.testimonialText}>"Надежда сделала мой свадебный макияж. Я выглядела идеально и чувствовала себя уверенно весь день!"</p>
                            <span className={styles.testimonialAuthor}>- Анастасия</span>
                        </div>
                        <div className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>❝</div>
                            <p className={styles.testimonialText}>"Профессионал высшего класса! Уроки макияжа изменили мое отношение к косметике."</p>
                            <span className={styles.testimonialAuthor}>- Екатерина</span>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 4)} className={styles.pwaSection}>
                <div className={styles.container}>
                    <div className={styles.pwaCard}>
                        <div className={styles.pwaHeader}>
                            <h2 className={styles.pwaTitle}>📱 Установите наше приложение!</h2>
                            <p className={styles.pwaSubtitle}>Быстрый доступ к записи без браузера</p>
                        </div>

                        <div className={styles.installSteps}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h3>Нажмите "Поделиться"</h3>
                                    <p>В Safari найдите кнопку 📤 в нижней панели</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h3>Выберите "На экран «Домой»"</h3>
                                    <p>Прокрутите меню вниз до этой опции</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>3</div>
                                <div className={styles.stepContent}>
                                    <h3>Нажмите "Добавить"</h3>
                                    <p>Приложение появится на главном экране</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.pwaBenefits}>
                            <div className={styles.benefit}>
                                <span className={styles.benefitIcon}>⚡</span>
                                <span>Быстрая загрузка</span>
                            </div>
                            <div className={styles.benefit}>
                                <span className={styles.benefitIcon}>📴</span>
                                <span>Работает оффлайн</span>
                            </div>
                            <div className={styles.benefit}>
                                <span className={styles.benefitIcon}>🔔</span>
                                <span>Уведомления</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
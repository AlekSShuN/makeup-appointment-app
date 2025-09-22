import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Home.module.css';
import Header from '../component/Header/Header.jsx';


const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRefs = useRef([]);
    const observerRef = useRef(null);

    const slides = [
        { image: "/slider/slider1.jpg", alt: "Вечерний макияж" },
        { image: "/slider/slider2.jpg", alt: "Свадебный макияж" },
        { image: "/slider/slider3.jpg", alt: "Дневной макияж" },
        { image: "/slider/slider4.jpg", alt: "Smoky eyes" },
        { image: "/slider/slider5.jpg", alt: "Натуральный макияж" }
    ];

    const createParticles = useCallback(() => {
        const particles = [];
        for (let i = 0; i < 15; i++) {
            particles.push({
                id: i,
                size: Math.random() * 8 + 4,
                left: Math.random() * 100,
                delay: Math.random() * 15,
                duration: Math.random() * 10 + 15
            });
        }
        return particles;
    }, []);

    const particles = createParticles();

    // Предзагрузка изображений
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
        }, 4000);

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

    // Функция для добавления ref'ов
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
            <Header />

            {particles.map(particle => (
                <div
                    key={particle.id}
                    className={styles.floatingParticle}
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}

            <section className={styles.hero}>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>

                <div className={styles.heroContainer}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.title}>Профессиональный визажист Надежда</h1>
                        <p className={styles.tagline}>Подчеркните свою естественную красоту</p>
                        <p className={styles.quote}>"Красота-это сила, а макияж-то, что действительно подчеркивает."</p>
                        <a href="/booking" className={styles.booking__button}>
                            Записаться на образ
                        </a>
                    </div>

                    <div className={styles.heroSliderSection}>
                        <div className={styles.sliderContainer}>
                            <div className={styles.heroSlider}>
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.slide} ${index === currentSlide ? styles.activ : ''}`}
                                    >
                                        <img src={slide.image}
                                            alt={slide.alt}
                                            className={styles.slideImage}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.sliderNavigation}>
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.sliderDot} ${index === currentSlide ? styles.activ : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}

                        </div>
                    </div>
                </div>
            </section>

            <section
                ref={(el) => addSectionRef(el, 0)}
                className={styles.featuredServices}
            >
                <div className={styles.container}>
                    <h2 className={styles.section_title}>Популярные услуги</h2>
                    <div className={styles.servicesGrid}>
                        <a href="/services#wedding" className={styles.serviceCard}>
                            <h3>💒 Свадебный макияж</h3>
                            <p>от 5 000 ₽</p>
                            <span className={styles.serviceDesc}>Идеальный образ для самого важного дня</span>
                        </a>
                        <a href="/services#evening" className={styles.serviceCard}>
                            <h3>🌙 Вечерний макияж</h3>
                            <p>от 3 500 ₽</p>
                            <span className={styles.serviceDesc}>Для особых мероприятий и выходов</span>
                        </a>
                        <a href="/services#lesson" className={styles.serviceCard}>
                            <h3>🎓 Уроки макияжа</h3>
                            <p>от 4 000 ₽</p>
                            <span className={styles.serviceDesc}>Научимся создавать идеальный образ</span>
                        </a>
                    </div>
                </div>
            </section>

            <section
                ref={(el) => addSectionRef(el, 1)}
                className={styles.about}
            >
                <div className={styles.container}>
                    <div className={styles.aboutContent}>
                        <div className={styles.aboutImage}>
                            <img src="/about-me.jpg" alt="Визажист Надежда" />
                        </div>
                        <div className={styles.aboutText}>
                            <h2 className={styles.section_title}>Обо мне</h2>
                            <h3>Ваш стилист Надежда</h3>
                            <p>В сфере красоты с 2020 года. Я убеждена, что макияж — это инструмент, который подчеркивает вашу уникальность, а не скрывает ее.</p>
                            <p>Каждый год я прохожу повышение квалификации и изучаю новые техники, чтобы предлагать вам самые актуальные и современные решения.</p>
                            <ul className={styles.achivmentsList}>
                                <li>✅ Сертифицированный специалист по технике air-makeup</li>
                                <li>✅ Опыт работы на съемках для журналов</li>
                                <li>✅ Более 200 довольных клиентов</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section
                ref={(el) => addSectionRef(el, 2)}
                className={styles.testimonials}
            >
                <div className={styles.container}>
                    <h2 className={styles.section_title}>Отзывы клиентов</h2>
                    <div className={styles.testimonialsGrid}>
                        <div className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>❝</div>
                            <p>"Надежда сделала мой свадебный макияж. Я выглядела идеально и чувствовала себя уверенно весь день!"</p>
                            <span>- Анастасия</span>
                        </div>
                        <div className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>❝</div>
                            <p>"Профессионал высшего класса! Уроки макияжа изменили мое отношение к косметике."</p>
                            <span>- Екатерина</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
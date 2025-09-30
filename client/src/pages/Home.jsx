import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Home.module.css';
import Header from '../component/Header/Header.jsx';

const SLIDE_INTERVAL = 4000;
const PARTICLE_COUNT = 15;
const PARTICLE_CONFIG = {
    minSize: 4,
    maxSize: 12,
    minDuration: 15,
    maxDuration: 25
};

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRefs = useRef([]);
    const observerRef = useRef(null);

    const slides = [
        { image: "/slider/slider6.PNG", alt: "Вечерний макияж" },/*
        { image: "/slider/slider2.JPG", alt: "Свадебный макияж" },
        { image: "/slider/slider3.JPG", alt: "Дневной макияж" },
        { image: "/slider/slider1.JPG", alt: "Smoky eyes" },
        { image: "/slider/slider2.JPG", alt: "Натуральный макияж" }*/
    ];

    const createParticles = useCallback(() => {
        const particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                id: i,
                size: Math.random() * (PARTICLE_CONFIG.maxSize - PARTICLE_CONFIG.minSize) + PARTICLE_CONFIG.minSize,
                left: Math.random() * 100,
                delay: Math.random() * 15,
                duration: Math.random() * (PARTICLE_CONFIG.maxDuration - PARTICLE_CONFIG.minDuration) + PARTICLE_CONFIG.minDuration
            });
        }
        return particles;
    }, []);

    const particles = createParticles();

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

            <section
                ref={(el) => addSectionRef(el, 0)} className={styles.hero}>
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
                            Профессиональный визажист
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Создаю идеальные образы, которые подчеркивают вашу естественную красоту
                        </p>
                        <div className={styles.heroButtons}>
                            <a href="/services" className={styles.heroButtonPrimary}>
                                Записаться
                            </a>
                            <a href="/portfolio" className={styles.heroButtonSecondary}>
                                Портфолио
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.heroSliderDots}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.sliderDot} ${index === currentSlide ? styles.active : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>



            <section
                ref={(el) => addSectionRef(el, 1)} className={styles.featuredServices}>
                <div className={styles.container}>
                    <h2 className={styles.section_title}>Популярные услуги</h2>
                    <div className={styles.servicesGrid}>
                        <a href="/services#wedding" className={styles.serviceCard}>
                            <div className={styles.imageContainer}>
                                <img
                                    src="/images/services/wedding-makeup.JPG"
                                    alt="Свадебный макияж"
                                    className={styles.serviceImage}
                                />
                            </div>
                            <div className={styles.serviceContent}>
                                <h3 className={styles.serviceTitle}> Свадебный образ</h3>
                                <p className={styles.price}>6 000 ₽</p>
                                <span className={styles.serviceDesc}>Идеальный образ для самого важного дня</span>
                            </div>
                        </a>

                        <a href="/services#evening" className={styles.serviceCard}>
                            <div className={styles.imageContainer}>
                                <img
                                    src="/images/services/evening-makeup.JPG"
                                    alt="Вечерний макияж"
                                    className={styles.serviceImage}
                                />
                            </div>
                            <div className={styles.serviceContent}>
                                <h3 className={styles.serviceTitle}> Вечерний макияж</h3>
                                <p className={styles.price}>2 300 ₽</p>
                                <span className={styles.serviceDesc}>Для особых мероприятий и выходов</span>
                            </div>
                        </a>

                        <a href="/services#lesson" className={styles.serviceCard}>
                            <div className={styles.imageContainer}>
                                <img
                                    src="/images/services/makeup-lesson.JPG"
                                    alt="Уроки макияжа"
                                    className={styles.serviceImage}
                                />
                            </div>
                            <div className={styles.serviceContent}>
                                <h3 className={styles.serviceTitle}> Урок макияжа для себя</h3>
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
                            <img src="/images/services/miss_nadya.JPG" alt="Визажист Надежда" />
                        </div>
                        <div className={styles.aboutText}>
                            <h2 className={styles.section_title}>Обо мне</h2>
                            <h3 className={styles.aboutSubtitle}>Ваш стилист Надежда</h3>
                            <p className={styles.aboutParagraph}>В сфере красоты с 2020 года. Я убеждена, что макияж — это инструмент, который подчеркивает вашу уникальность, а не скрывает ее.</p>
                            <p className={styles.aboutParagraph}>Каждый год я прохожу повышение квалификации и изучаю новые техники, чтобы предлагать вам самые актуальные и современные решения.</p>
                            <ul className={styles.achivmentsList}>
                                <li className={styles.achivmentItem}> Сертифицированный специалист по технике air-makeup</li>
                                <li className={styles.achivmentItem}> Опыт работы на съемках для журналов</li>
                                <li className={styles.achivmentItem}> Более 300 довольных клиентов</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={(el) => addSectionRef(el, 3)} className={styles.testimonials}>
                <div className={styles.container}>
                    <h2 className={styles.section_title}>Отзывы клиентов</h2>
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
        </div>
    );
};

export default Home;
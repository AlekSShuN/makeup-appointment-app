import { useEffect, useState } from 'react';
import styles from './Home.module.css';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const slides = [
        {
            image: "/public/slider/slider1.jpg",
            alt: "Макияж",
        },
        {
            image: "/public/slider/slider2.jpg",
            alt: "Макияж"
        },
        {
            image: "/public/slider/slider3.jpg",
            alt: "Макияж"
        },
        {
            image: "/public/slider/slider4.jpg",
            alt: "Макияж"
        },
        {
            image: "/public/slider/slider5.jpg",
            alt: "Макияж"
        }

    ];

    useEffect(() => {

        const preloadImages = () => {
            slides.forEach(slide => {
                const img = new Image();
                img.src = slide.image;
            });
            setIsLoading(false);
        };

        preloadImages();

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => {
            clearInterval(timer);
            setIsLoading(true);
        };
    }, [slides.length]);

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }
    return (
        <div className={styles.home}>
            <section className={styles.hero}>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>
                <div className={styles.sparkle}></div>
                <div className={styles.heroSlider}>
                    {slides.map((slides, index) => (
                        <div
                            key={index}
                            className={`${styles.slide} ${index === currentSlide ? styles.activ : ''}`}
                            style={{ backgroundImage: `url(${slides.image})` }}
                            aria-hidden={index !== currentSlide} />
                    ))}
                </div>
                {/*Контект поверх слидера*/}
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>Красота-это сила,а макияж-то,что действительно ее подчеркивает.Это женский секрет. (с)</h1>
                    <p>Подчеркните свою естественную красоту</p>
                    <a href="/booking" className={styles.booking__button}>Записаться</a>
                </div>
                {/*Навигация слайдера*/}
                <div className={styles.sliderNavigation}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.sliderDot} ${index === currentSlide ? styles.activ : ''}`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Перейти к слайду ${index + 1}`} />
                    ))}
                </div>
            </section>

            <section className={styles.about}>
                <div className={styles.container}>
                    <h2 className={styles.section_title}>Обо мне</h2>
                    <h2>Ваш стилист Надежда</h2>
                    <p className={styles.about_text}>В сфере красоты с 2020года. Каждый год прохожу повышение и обучение новым техникам,так как индустрия красоты не стоит на месте.</p>
                </div>
            </section>
            <section className={styles.myGallery}>
                <h2>Мои работы</h2>
            </section >
        </div>
    );
};

export default Home;

import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.home}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Профессиональный макияж</h1>
                    <p>Подчеркните свою естественную красоту</p>
                    <a href="/booking" className={styles.booking__button}>Записаться</a>
                </div>
            </section>
            <section className={styles.about}>
                <div className={styles.container}>
                    <h2 className={styles.section_title}>Обо мне</h2>
                    <p className={styles.about_text}>Краткая информация о мастере</p>
                </div>
            </section>
            <section className={styles.myGallery}>
                <h2>Мои работы</h2>


            </section >
        </div>

    );
};

export default Home;

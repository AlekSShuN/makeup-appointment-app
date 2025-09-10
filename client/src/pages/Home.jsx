import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.home}>
            <section className={styles.hero}>
                <h1>Профессиональный макияж</h1>
                <p>Подчеркните свою естественную красоту</p>
                <a href="/booking" className={styles.booking__button}>Записаться</a>
            </section>
            <section className={styles.about}>
                <h2>Обо мне</h2>
                <p>Краткая информация о мастере</p>
            </section>
            <section className={styles.myGallery}>
                <h2>Мои работы</h2>


            </section >
        </div>

    );
};

export default Home;

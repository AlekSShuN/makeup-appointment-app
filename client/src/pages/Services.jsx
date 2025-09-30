import style from './Services.module.css';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const navigate = useNavigate();

    const services = [
        {
            id: 1,
            title: "Вечерний макияж",
            price: "2500р",
            duration: "1час",
            features: ["Макияж любой сложности", "Кремовая коррекция", "Реснички входят в стоимость"],
            popular: true
        },
        {
            id: 2,
            title: "Дневной макияж",
            price: "2000р",
            duration: "1час",
            features: ["Макияж в нежных оттенках", "Реснички входят в стоимость", "Преимущественно работа с коррекцией лица"],
            popular: false
        },
        {
            id: 3,
            title: "Локоны/Укладка",
            price: "2000р",
            duration: "1час",
            features: ["Волосы длиньше 45 см + 500р к прайсу"],
            popular: false
        },
        {
            id: 4,
            title: "Свадебный образ",
            price: "6000р",
            duration: "2.5часа",
            features: ["Крепление фаты входит в стоимость",],
            popular: true
        },
        {
            id: 5,
            title: "Сопровождение невесты",
            price: "2000р",
            duration: "1час",
            features: ["Моменять прическу", "Поправить макияж после фотосессии", "Зашнуровать платье",],
            popular: false
        },
        {
            id: 6,
            title: "Репетиция свадебного образа",
            price: "5000р",
            duration: "3часа",
            features: ["Можно попробывать 2 макияжа и 2 прически",],
            popular: false
        },
        {
            id: 7,
            title: "Реснички",
            price: "от 149р",
            features: ["20d,30d,пачки mix", "Ласточки mix", "Лучики mix", "Изгиб L"],
            popular: true
        },
        {
            id: 8,
            title: "Урок макияжа для себя",
            price: "4500р",
            duration: "4часа",
            features: ["Подбираем макияж из ваших запросов", "Делаем дневной и трансформируем его в вечерний", "Рабочая тетрадь с подсказками", "Ссылки на актуальную косметику", "Видео макияжа", "Укладка от меня в подарок"],
            popular: false
        },
        {
            id: 9,
            title: "Выезд в отель",
            price: "3000р",
            features: ["Выезд на дом +1000р", "Ранний выезд до 7:00 +500р"],
            popular: false
        },
    ];

    const handleOrderClick = (serviceId) => {
        navigate('/booking', {
            state: { selectedService: serviceId }
        });
    };

    return (
        <section className={style.services}>
            <div className={style.container}>
                <div className={style.header}>
                    <h1 className={style.section_title}>Мои услуги</h1>
                </div>

                <div className={style.pricingGrid}>
                    {services.map(service => (
                        <div
                            key={service.id}
                            className={`${style.pricingCard} ${service.popular ? style.popular : ''}`}
                        >
                            {service.popular && <div className={style.popularBadge}>Популярно</div>}

                            <div className={style.cardHeader}>
                                <h3 className={style.serviceTitle}>{service.title}</h3>
                                <div className={style.price}>{service.price}</div>
                                <div className={style.duration}>{service.duration}</div>
                            </div>

                            <p className={style.description}>{service.description}</p>

                            <ul className={style.features}>
                                {service.features.map((feature, index) => (
                                    <li key={index} className={style.featureItem}>
                                        <span className={style.checkIcon}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={style.orderButton}
                                onClick={() => handleOrderClick(service.id)}>
                                Заказать услугу
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
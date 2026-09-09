import { useNavigate } from 'react-router-dom';
import style from './Services.module.css';
import { FALLBACK_SERVICES } from '../data/services.js';

const Services = () => {
    const navigate = useNavigate();

    const handleOrderClick = (serviceId) => {
        navigate(`/booking?service=${serviceId}`);
    };

    return (
        <section className={style.services}>
            <div className={style.container}>
                <div className={style.header}>
                    <p className={style.eyebrow}>Прайс</p>
                    <h1 className={style.section_title}>Мои услуги</h1>
                </div>

                <div className={style.pricingGrid}>
                    {FALLBACK_SERVICES.map(service => (
                        <div
                            key={service.id}
                            className={`${style.pricingCard} ${service.popular ? style.popular : ''}`}
                        >
                            {service.popular && <div className={style.popularBadge}>Популярно</div>}

                            <div className={style.cardHeader}>
                                <h3 className={style.serviceTitle}>{service.title}</h3>
                                <div className={style.price}>{service.priceLabel}</div>
                                {service.duration && <div className={style.duration}>{service.duration}</div>}
                            </div>

                            <ul className={style.features}>
                                {service.features.map((feature) => (
                                    <li key={feature} className={style.featureItem}>
                                        <span className={style.checkIcon} aria-hidden="true">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={style.orderButton}
                                onClick={() => handleOrderClick(service.id)}
                            >
                                Записаться
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

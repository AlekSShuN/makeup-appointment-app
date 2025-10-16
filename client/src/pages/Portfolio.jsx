import { useState } from 'react';
import style from './Portfolio.module.css';

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;

const Portfolio = () => {
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [selectedImage, setSelectedImage] = useState(null);

    const allPortfolioItems = [
        {
            id: 1,
            image: '/images/portfolio/portfolio1.JPG'
        },
        {
            id: 2,
            image: '/images/portfolio/portfolio2.JPG'
        },
        {
            id: 3,
            image: '/images/portfolio/portfolio3.JPG'
        },
        {
            id: 4,
            image: '/images/portfolio/portfolio4.JPG'
        },
        {
            id: 5,
            image: '/images/portfolio/portfolio5.JPG'
        },
        {
            id: 6,
            image: '/images/portfolio/portfolio6.JPG'
        },
        {
            id: 7,
            image: '/images/portfolio/portfolio7.JPG'
        },
        {
            id: 8,
            image: '/images/portfolio/portfolio8.JPG'
        },
        {
            id: 9,
            image: '/images/portfolio/portfolio9.JPG'
        },
        {
            id: 10,
            image: '/images/portfolio/portfolio10.JPG'
        },
        {
            id: 11,
            image: '/images/portfolio/portfolio11.JPG'
        },
        {
            id: 12,
            image: '/images/portfolio/portfolio12.JPG'
        },
        {
            id: 13,
            image: '/images/portfolio/portfolio13.JPG'
        },
        {
            id: 14,
            image: '/images/portfolio/portfolio14.JPG'
        },
        {
            id: 15,
            image: '/images/portfolio/portfolio15.JPG'
        },
        {
            id: 16,
            image: '/images/portfolio/portfolio16.JPG'
        },
        {
            id: 17,
            image: '/images/portfolio/portfolio17.JPG'
        },
        {
            id: 18,
            image: '/images/portfolio/portfolio18.JPG'
        },
        {
            id: 19,
            image: '/images/portfolio/portfolio19.JPG'
        },
        {
            id: 20,
            image: '/images/portfolio/portfolio20.JPG'
        },
        {
            id: 21,
            image: '/images/portfolio/portfolio21.JPG'
        },
        {
            id: 22,
            image: '/images/portfolio/portfolio22.JPG'
        },
        {
            id: 23,
            image: '/images/portfolio/portfolio23.JPG'
        },
        {
            id: 24,
            image: '/images/portfolio/portfolio24.JPG'
        },
        {
            id: 25,
            image: '/images/portfolio/portfolio25.JPG'
        },
        {
            id: 26,
            image: '/images/portfolio/portfolio26.JPG'
        },
        {
            id: 27,
            image: '/images/portfolio/portfolio27.JPG'
        },
        {
            id: 28,
            image: '/images/portfolio/portfolio28.JPG'
        },
        {
            id: 29,
            image: '/images/portfolio/portfolio29.JPG'
        },
        {
            id: 30,
            image: '/images/portfolio/portfolio30.JPG'
        },
        {
            id: 31,
            image: '/images/portfolio/portfolio31.JPG'
        },
        {
            id: 32,
            image: '/images/portfolio/portfolio32.JPG'
        },
        {
            id: 33,
            image: '/images/portfolio/portfolio33.JPG'
        },
        {
            id: 34,
            image: '/images/portfolio/portfolio34.JPG'
        },
        {
            id: 35,
            image: '/images/portfolio/portfolio35.JPG'
        },
        {
            id: 36,
            image: '/images/portfolio/portfolio36.JPG'
        },
    ];

    const portfolioItems = allPortfolioItems.slice(0, visibleCount);

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + LOAD_MORE_COUNT);
    };

    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeImage();
        }
    };

    const navigateImage = (direction) => {
        const currentIndex = allPortfolioItems.findIndex(item => item.image === selectedImage);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % allPortfolioItems.length;
        } else {
            newIndex = currentIndex - 1 < 0 ? allPortfolioItems.length - 1 : currentIndex - 1;
        }

        setSelectedImage(allPortfolioItems[newIndex].image);
    };

    const handleKeyDown = (e) => {
        if (selectedImage) {
            if (e.key === 'Escape') closeImage();
            if (e.key === 'ArrowRight') navigateImage('next');
            if (e.key === 'ArrowLeft') navigateImage('prev');
        }
    };

    return (
        <>
            <section className={style.portfolio}>
                <div className={style.container}>
                    <div className={style.header}>
                        <h1 className={style.title}>Портфолио</h1>

                    </div>

                    <div className={style.gallery}>
                        {portfolioItems.map(item => (
                            <div
                                key={item.id}
                                className={style.galleryItem}
                                onClick={() => openImage(item.image)}
                            >
                                <img
                                    src={item.image}
                                    alt={`Портфолио ${item.id}`}
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDMwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xMjUgOTVDMTI1IDk4Ljg2NiAxMjEuODY2IDEwMiAxMTggMTAyQzExNC4xMzQgMTAyIDExMSA5OC44NjYgMTExIDk1QzExMSA5MS4xMzQgMTE0LjEzNCA4OCAxMTggODhDMTIxLjg2NiA4OCAxMjUgOTEuMTM0IDEyNSA5NVoiIGZpbGw9IiNDOEM4QzgiLz4KPHRleHQgeD0iMTUwIiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+0J7RgtC60LvRjtGH0LjRgtGMINC/0L7QtNGA0LDRhtC40Lg8L3RleHQ+Cjwvc3ZnPg==';
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {visibleCount < allPortfolioItems.length && (
                        <button className={style.loadMore} onClick={loadMore}>
                            Показать еще
                        </button>
                    )}
                </div>
            </section>

            {/* Модальное окно для просмотра фото */}
            {selectedImage && (
                <div
                    className={style.modalOverlay}
                    onClick={handleOverlayClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <div className={style.modalContent}>
                        <button
                            className={style.closeButton}
                            onClick={closeImage}
                        >
                            ×
                        </button>
                        <button
                            className={`${style.navButton} ${style.prevButton}`}
                            onClick={() => navigateImage('prev')}
                        >
                            ‹
                        </button>
                        <img
                            src={selectedImage}
                            alt="Увеличенное фото портфолио"
                            className={style.enlargedImage}
                        />
                        <button
                            className={`${style.navButton} ${style.nextButton}`}
                            onClick={() => navigateImage('next')}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Portfolio;
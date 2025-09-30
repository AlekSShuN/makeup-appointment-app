import styles from './Loader.module.css';

const Loader = ({
    size = 'medium',
    text = 'Загрузка...',
    color = 'primary',
    className = ''
}) => {
    return (
        <div
            className={`${styles.loaderContainer} ${className}`}
            role="status"
            aria-live="polite"
            aria-label={text}
        >
            <div
                className={`${styles.loader} ${styles[size]} ${styles[color]}`}
            >
                <div className={styles.loaderSpinner}></div>
            </div>
            {text && (
                <div className={styles.loaderText}>
                    {text}
                </div>
            )}
        </div>
    );
};

export default Loader;
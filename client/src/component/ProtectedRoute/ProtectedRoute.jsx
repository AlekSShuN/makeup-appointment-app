import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProtectedRoute.module.css';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isLoading, hasRole } = useAuth();

    if (isLoading) {
        return (
            <div className={styles['protected-container']}>
                <div className={styles['protected-card']}>
                    <div className={styles.spinner}></div>
                    <h2 className={styles['protected-title']}>Проверка доступа...</h2>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles['protected-container']}>
                <div className={styles['protected-card']}>
                    <div className={styles['protected-icon']}>🔐</div>
                    <h2 className={styles['protected-title']}>Требуется авторизация</h2>
                    <p className={styles['protected-subtitle']}>
                        Пожалуйста, войдите в систему для доступа к этой странице.
                    </p>
                    <Link to="/admin-login" className={styles['protected-button']}>
                        Войти в админ-панель
                    </Link>
                </div>
            </div>
        );
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className={styles['protected-container']}>
                <div className={`${styles['protected-card']} ${styles['forbidden-card']}`}>
                    <div className={styles['protected-icon']}>⛔</div>
                    <h2 className={styles['protected-title']}>Недостаточно прав</h2>
                    <p className={styles['protected-subtitle']}>
                        У вас нет доступа к этой странице.
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;

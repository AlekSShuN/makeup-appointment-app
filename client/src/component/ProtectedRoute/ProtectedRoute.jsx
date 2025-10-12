import { useAuth } from '../../contexts/AuthContext';
import './ProtectedRoute.module.css';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isLoading, hasRole } = useAuth();

    if (isLoading) {
        return (
            <div className="protected-container">
                <div className="protected-card">
                    <div className="spinner"></div>
                    <h2 className="protected-title">Проверка доступа...</h2>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="protected-container">
                <div className="protected-card">
                    <div className="protected-icon">🔐</div>
                    <h2 className="protected-title">Требуется авторизация</h2>
                    <p className="protected-subtitle">
                        Пожалуйста, войдите в систему для доступа к этой странице.
                    </p>
                    <a href="/admin-login" className="protected-button">
                        Войти в админ-панель
                    </a>
                </div>
            </div>
        );
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="protected-container">
                <div className="protected-card forbidden-card">
                    <div className="protected-icon">⛔</div>
                    <h2 className="protected-title">Недостаточно прав</h2>
                    <p className="protected-subtitle">
                        У вас нет доступа к этой странице.
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
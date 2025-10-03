import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isLoading, hasRole } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
            }}>
                <div>Проверка доступа...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <h2>Требуется авторизация</h2>
                <p>Пожалуйста, войдите в систему для доступа к этой странице.</p>
                <a href="/admin-login" className="button">Войти в админ-панель</a>
            </div>
        );
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px'
            }}>
                <h2>Недостаточно прав</h2>
                <p>У вас нет доступа к этой странице.</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
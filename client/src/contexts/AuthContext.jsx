import { createContext, useState, useContext, useEffect } from 'react';

// Создаем контекст
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    setUser({
                        id: 1,
                        username: 'admin',
                        role: 'admin'
                    });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('auth_token');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setIsLoading(true);

            const userData = {
                id: 1,
                username: credentials.username || 'admin',
                role: 'admin'
            };

            localStorage.setItem('auth_token', 'demo-token-123');
            setUser(userData);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Ошибка входа'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
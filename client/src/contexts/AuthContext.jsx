import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const setToken = (token) => {
        localStorage.setItem('admin_token', token);
    };

    const getToken = () => {
        return localStorage.getItem('admin_token');
    };

    const removeToken = () => {
        localStorage.removeItem('admin_token');
    };

    // Проверка авторизации при загрузке
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = getToken();
        console.log('🔄 Checking auth, token exists:', !!token);

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5002/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                console.log('✅ Auto-login successful');
            } else {
                console.log('❌ Auto-login failed');
                removeToken();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            removeToken();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            console.log('🔐 Attempting login...');
            const response = await fetch('http://localhost:5002/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                console.log('✅ Login successful');
                return { success: true, user: data.user };
            } else {
                console.log('❌ Login failed:', data.message);
                return {
                    success: false,
                    error: data.message || 'Ошибка входа'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Ошибка сети'
            };
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
        console.log('🚪 Logout successful');
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    // Простая функция для авторизованных запросов
    const authFetch = async (url, options = {}) => {
        const token = getToken();

        if (!token) {
            throw new Error('Требуется авторизация');
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        };

        console.log('🔐 Auth request to:', url);
        return fetch(url, { ...options, headers });
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user,
        authFetch,
        getToken
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
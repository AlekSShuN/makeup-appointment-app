export const checkAdminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 Auth check:', {
        url: req.url,
        method: req.method,
        hasToken: !!token
    });

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Требуется авторизация'
        });
    }

    try {
        const decoded = Buffer.from(token, 'base64').toString();
        if (decoded === 'admin:authenticated') {
            req.user = { username: 'admin', role: 'admin' };
            return next();
        }

        return res.status(401).json({
            success: false,
            message: 'Неверный токен'
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Ошибка аутентификации'
        });
    }
};
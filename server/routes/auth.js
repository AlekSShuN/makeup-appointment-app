import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = express.Router();

export const checkAdminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Логин и пароль обязательны'
            });
        }

        // Проверяем пользователя в базе данных
        const user = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверные учетные данные'
            });
        }

        // Проверяем пароль через bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Неверные учетные данные'
            });
        }

        // Генерируем токен
        const token = Buffer.from('admin:authenticated').toString('base64');

        res.json({
            success: true,
            message: 'Успешный вход',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при входе'
        });
    }
});

router.get('/verify', checkAdminAuth, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

router.post('/logout', checkAdminAuth, (req, res) => {
    res.json({
        success: true,
        message: 'Успешный выход'
    });
});

export default router;
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log('🔄 Отправка формы входа...');

        try {
            const result = await login(formData);
            console.log('📨 Ответ от сервера:', result);

            if (result.success) {
                console.log('🎉 Вход успешен!');
                navigate('/admin');
            } else {
                alert(result.error || 'Не удалось войти');
            }
        } catch (error) {
            console.error('💥 Ошибка:', error);
            alert('Произошла ошибка при входе');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>
                    Вход для администратора
                </h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Введите логин"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.submitButton}
                    >
                        {isSubmitting ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className={styles.demoHint}>
                    Введите ваши учетные данные для входа в панель администратора
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

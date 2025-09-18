import { useCallback, useRef, useState } from 'react';

export const useValidation = () => {
    const [errors, setErrors] = useState({});
    const validationTimeout = useRef(null);

    const validateField = useCallback((name, value) => {
        let error = '';

        switch (name) {
            case 'serviceId':
                if (!value) error = 'Выберите услугу';
                break;
            case 'date':
                if (!value) error = 'Выберите дату';
                else if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
                    error = 'Дата не может быть в прошлом';
                }
                break;
            case 'time':
                if (!value) error = 'Выберите время';
                break;
            case 'name':
                if (!value.trim()) error = 'Введите имя';
                else if (value.length < 2) error = 'Имя слишком короткое';
                break;
            case 'phone':
                const phoneNumbers = value.replace(/\D/g, '');
                if (phoneNumbers.length < 11) error = 'Введите корректный телефон';
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Введите корректный email';
                }
                break;
        }

        return error;
    }, []);

    const validateForm = useCallback((formData) => {
        const newErrors = {};

        // Валидация основных полей
        newErrors.serviceId = validateField('serviceId', formData.serviceId);
        newErrors.date = validateField('date', formData.date);
        newErrors.time = validateField('time', formData.time);

        // Валидация данных клиента
        if (formData.client) {
            newErrors.name = validateField('name', formData.client.name);
            newErrors.phone = validateField('phone', formData.client.phone);
            newErrors.email = validateField('email', formData.client.email);
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => !error);
    }, [validateField]);

    const clearError = useCallback((fieldName) => {
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
    }, []);

    return {
        errors,
        validateForm,
        clearError,
        clearAllErrors
    };
};
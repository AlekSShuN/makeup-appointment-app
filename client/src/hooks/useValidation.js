import { useCallback, useRef, useState } from 'react';

const API_BASE_URL = 'https://makeup-appointment-app-backend.onrender.com/api';

const VALIDATION_RULES = {
    name: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/
    },
    phone: {
        minLength: 10,
        pattern: /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/
    },
};

const ERROR_MESSAGES = {
    REQUIRED: 'Это поле обязательно для заполнения',
    INVALID_DATE: 'Дата не может быть в прошлом',
    NAME_TOO_SHORT: 'Имя должно содержать минимум 2 символа',
    NAME_TOO_LONG: 'Имя не должно превышать 50 символов',
    NAME_INVALID: 'Имя может содержать только буквы, пробелы и дефисы',
    PHONE_INVALID: 'Введите корректный номер телефона',
};

export const useValidation = () => {
    const [errors, setErrors] = useState({});
    const validationTimeoutRef = useRef(null);

    const validateField = useCallback((name, value) => {
        let error = '';

        switch (name) {
            case 'serviceId':
                if (!value) error = ERROR_MESSAGES.REQUIRED;
                break;

            case 'date':
                if (!value) {
                    error = ERROR_MESSAGES.REQUIRED;
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        error = ERROR_MESSAGES.INVALID_DATE;
                    }
                }
                break;

            case 'time':
                if (!value) error = ERROR_MESSAGES.REQUIRED;
                break;

            case 'name':
                if (!value.trim()) {
                    error = ERROR_MESSAGES.REQUIRED;
                } else if (value.length < VALIDATION_RULES.name.minLength) {
                    error = ERROR_MESSAGES.NAME_TOO_SHORT;
                } else if (value.length > VALIDATION_RULES.name.maxLength) {
                    error = ERROR_MESSAGES.NAME_TOO_LONG;
                } else if (!VALIDATION_RULES.name.pattern.test(value.trim())) {
                    error = ERROR_MESSAGES.NAME_INVALID;
                }
                break;

            case 'phone':
                const phoneNumbers = value.replace(/\D/g, '').slice(1);
                if (!phoneNumbers) {
                    error = ERROR_MESSAGES.REQUIRED;
                } else if (phoneNumbers.length < 10) {
                    error = ERROR_MESSAGES.PHONE_INVALID;
                }
                break;

            default:
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

    const validateFieldWithDebounce = useCallback((name, value, delay = 500) => {
        if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
        }
        validationTimeoutRef.current = setTimeout(() => {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }, delay);
    }, [validateField]);

    const validateFields = useCallback((fields) => {
        const newErrors = {};

        Object.entries(fields).forEach(([name, value]) => {
            newErrors[name] = validateField(name, value);
        });

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.values(newErrors).every(error => !error);
    }, [validateField]);

    const clearError = useCallback((fieldName) => {
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
    }, []);

    // Получение общего статуса валидности формы
    const isValid = Object.values(errors).every(error => !error);

    const cleanup = useCallback(() => {
        if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
        }
    }, []);


    return {
        errors,
        isValid,
        validateForm,
        validateField: validateFieldWithDebounce,
        validateFields,
        clearError,
        clearAllErrors,
        cleanup
    };
};
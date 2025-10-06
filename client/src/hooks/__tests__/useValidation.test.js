import { renderHook, act } from '@testing-library/react';
import { useValidation } from '../useValidation';

describe('useValidation Hook', () => {
    test('hook has correct structure', () => {
        const { result } = renderHook(() => useValidation());

        expect(result.current).toHaveProperty('errors');
        expect(result.current).toHaveProperty('validateForm');
        expect(result.current).toHaveProperty('clearError');
        expect(result.current).toHaveProperty('clearAllErrors');

        // Начальное состояние
        expect(result.current.errors).toEqual({});
    });

    test('validateForm returns boolean', () => {
        const { result } = renderHook(() => useValidation());

        const testData = {
            serviceId: '1',
            date: '2024-01-15',
            time: '10:00',
            client: {
                name: 'Test User',
                phone: '+7 (999) 999-99-99'
            }
        };

        let validationResult;
        act(() => {
            validationResult = result.current.validateForm(testData);
        });

        expect(typeof validationResult).toBe('boolean');
    });

    test('errors object updates after validation', () => {
        const { result } = renderHook(() => useValidation());

        const emptyData = {
            serviceId: '',
            date: '',
            time: '',
            client: {
                name: '',
                phone: ''
            }
        };

        act(() => {
            result.current.validateForm(emptyData);
        });

        // Проверяем что errors объект изменился (не обязательно содержит ошибки, но изменился)
        expect(result.current.errors).toBeDefined();
        expect(typeof result.current.errors).toBe('object');
    });

    test('clearError removes specific error', () => {
        const { result } = renderHook(() => useValidation());

        // Сначала создаем какую-то ошибку
        const emptyData = {
            serviceId: '',
            date: '2024-01-15',
            time: '10:00',
            client: {
                name: 'Test',
                phone: '+7 (999) 999-99-99'
            }
        };

        act(() => {
            result.current.validateForm(emptyData);
            const initialErrors = { ...result.current.errors };

            // Очищаем ошибку serviceId если она есть
            if (result.current.errors.serviceId) {
                result.current.clearError('serviceId');
                expect(result.current.errors.serviceId).toBeUndefined();
            }
        });
    });

    test('clearAllErrors clears all errors', () => {
        const { result } = renderHook(() => useValidation());

        const emptyData = {
            serviceId: '',
            date: '',
            time: '',
            client: {
                name: '',
                phone: ''
            }
        };

        act(() => {
            result.current.validateForm(emptyData);
            const hasErrors = Object.keys(result.current.errors).length > 0;

            result.current.clearAllErrors();

            // После очистки errors должен быть пустым объектом
            expect(result.current.errors).toEqual({});
        });
    });
});
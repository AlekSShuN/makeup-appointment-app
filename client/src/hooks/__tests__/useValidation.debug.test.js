import { renderHook, act } from '@testing-library/react';
import { useValidation } from '../useValidation';

// Мок для любых внешних зависимостей useValidation
jest.mock('@tanstack/react-query', () => ({}), { virtual: true });

describe('useValidation Debug', () => {
    test('check hook structure', () => {
        const { result } = renderHook(() => useValidation());

        console.log('Hook structure:', Object.keys(result.current));
        console.log('Initial errors:', result.current.errors);

        // Проверяем базовую структуру
        expect(result.current).toHaveProperty('errors');
        expect(result.current).toHaveProperty('validateForm');
        expect(result.current).toHaveProperty('clearError');
        expect(result.current).toHaveProperty('clearAllErrors');
    });

    test('test validateForm with simple data', () => {
        const { result } = renderHook(() => useValidation());

        const simpleData = {
            serviceId: '1',
            date: '2024-01-15',
            time: '10:00',
            client: {
                name: 'Test',
                phone: '+7 (999) 999-99-99'
            }
        };

        let isValid;
        act(() => {
            isValid = result.current.validateForm(simpleData);
        });

        console.log('Validation result:', isValid);
        console.log('Errors after validation:', result.current.errors);

        expect(typeof isValid).toBe('boolean');
    });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPanel from '../AdminPanel';

// Простые моки
jest.mock('../../hooks/useBooking', () => ({
    useBookings: () => ({
        data: [],
        isLoading: false,
        error: null,
    }),
    useDeleteBooking: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
}));

describe('Admin Panel - Simple', () => {
    test('renders admin panel title', () => {
        render(<AdminPanel />);

        expect(screen.getByText(/админ-панель/i)).toBeInTheDocument();
        expect(screen.getByText(/управление записями/i)).toBeInTheDocument();
    });

    test('shows empty state when no bookings', () => {
        render(<AdminPanel />);

        expect(screen.getByText(/нет записей/i)).toBeInTheDocument();
    });
});
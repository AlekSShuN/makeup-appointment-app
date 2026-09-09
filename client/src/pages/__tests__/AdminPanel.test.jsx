import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPanel from '../AdminPanel';

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        isLoading: false,
        user: { username: 'admin' },
        authFetch: jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
        })),
    }),
}));

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
    test('renders admin panel title', async () => {
        render(<AdminPanel />);
        expect(await screen.findByText(/панель управления/i)).toBeInTheDocument();
    });

    test('shows empty state when no bookings', async () => {
        render(<AdminPanel />);
        expect(await screen.findByText(/записей нет/i)).toBeInTheDocument();
    });
});

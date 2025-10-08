import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingForm from '../BookingForm';

// Простой мок без react-query
jest.mock('../../hooks/useBooking', () => ({
    useCreateBooking: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
    useAvailableSlots: () => ({
        data: ['10:00', '11:00', '12:00'],
        isLoading: false,
    }),
}));

const mockServices = [
    { id: 1, name: 'Стрижка', price: 1000 },
    { id: 2, name: 'Окрашивание', price: 2000 }
];

describe('Booking Creation - Simple', () => {
    test('renders booking form with services', () => {
        render(<BookingForm services={mockServices} />);

        expect(screen.getByText(/услуга/i)).toBeInTheDocument();
        expect(screen.getByText(/стрижка/i)).toBeInTheDocument();
        expect(screen.getByText(/окрашивание/i)).toBeInTheDocument();
    });

    test('submit button is disabled when form is empty', () => {
        render(<BookingForm services={mockServices} />);

        const submitButton = screen.getByText(/записаться/i);
        expect(submitButton).toBeDisabled();
    });
});
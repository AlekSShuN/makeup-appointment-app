import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '../BookingForm';

const mockServices = [
    { id: 1, name: 'Стрижка', price: 1000 },
    { id: 2, name: 'Окрашивание', price: 2000 }
];

describe('BookingForm', () => {
    test('renders form fields', () => {
        render(<BookingForm services={mockServices} />);

        expect(screen.getByText(/^услуги$/i)).toBeInTheDocument();
        expect(screen.getByText(/имя/i)).toBeInTheDocument();
        expect(screen.getByText(/телефон/i)).toBeInTheDocument();
        expect(screen.getByText(/комментарий/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/введите ваше имя/i)).toBeInTheDocument();
        expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });

    test('calculates total for multiple selected services', async () => {
        const user = userEvent.setup();
        render(<BookingForm services={mockServices} />);

        await user.click(screen.getByRole('checkbox', { name: /стрижка/i }));
        await user.click(screen.getByRole('checkbox', { name: /окрашивание/i }));

        expect(screen.getByText('Итого')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /записаться · 3/i })).toBeInTheDocument();
    });
});

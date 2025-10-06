import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingForm from '../BookingForm';

// Мок данных
const mockServices = [
    { id: 1, name: 'Стрижка', price: 1000 },
    { id: 2, name: 'Окрашивание', price: 2000 }
];

describe('BookingForm', () => {
    test('renders form fields', () => {
        render(<BookingForm services={mockServices} />);

        // Используем текст вместо placeholder
        expect(screen.getByText(/услуга/i)).toBeInTheDocument();
        expect(screen.getByText(/имя/i)).toBeInTheDocument();
        expect(screen.getByText(/телефон/i)).toBeInTheDocument();
        expect(screen.getByText(/комментарий/i)).toBeInTheDocument();

        // Проверяем что есть select и inputs
        expect(screen.getByRole('combobox')).toBeInTheDocument(); // select
        expect(screen.getByPlaceholderText(/введите ваше имя/i)).toBeInTheDocument();
    });
});
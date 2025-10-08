import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Мок для react-router-dom прямо в тесте
jest.mock('react-router-dom', () => ({
    Link: ({ children, to, ...props }) => (
        <a href={to} {...props}>{children}</a>
    ),
    useNavigate: () => jest.fn(),
}));

describe('Header Component', () => {
    beforeEach(() => {
        global.localStorage.getItem.mockClear();
        global.localStorage.setItem.mockClear();
        global.localStorage.getItem.mockReturnValue(null);
    });

    test('renders navigation links', () => {
        render(<Header />);

        expect(screen.getByText(/главная/i)).toBeInTheDocument();
        expect(screen.getByText(/услуги/i)).toBeInTheDocument();
        expect(screen.getByText(/портфолио/i)).toBeInTheDocument();
        expect(screen.getByText(/контакты/i)).toBeInTheDocument();
    });

    test('renders booking button', () => {
        render(<Header />);
        expect(screen.getByText(/записаться/i)).toBeInTheDocument();
    });
});
import '@testing-library/jest-dom';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Мок для fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
    })
);

// мок для react-router-dom
jest.mock('react-router-dom', () => ({
    Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/' }),
    BrowserRouter: ({ children }) => <div>{children}</div>
}));

// Мок для localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    },
    writable: true
});


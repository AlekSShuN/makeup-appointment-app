import '@testing-library/jest-dom';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
    })
);

jest.mock('react-router-dom', () => {
        const DummyLink = ({ children, to, className, end, ...props }) => {
            const resolved = typeof className === 'function' ? className({ isActive: false }) : className;
            return <a href={to} className={resolved} {...props}>{children}</a>;
        };

    return {
        Link: DummyLink,
        NavLink: DummyLink,
        useNavigate: () => jest.fn(),
        useLocation: () => ({ pathname: '/', state: null, search: '' }),
        useSearchParams: () => [new URLSearchParams(), jest.fn()],
        BrowserRouter: ({ children }) => <div>{children}</div>,
    };
});

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    },
    writable: true
});

import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./component/Layout/Layout.jsx";
import AdminLogin from './pages/AdminLogin.jsx';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute.jsx';
import AdminPanel from './pages/AdminPanel.jsx';


// Ленивые импорты
const Home = lazy(() => import('./pages/Home.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'));
const Contacts = lazy(() => import('./pages/Contacts.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const BookingManagement = lazy(() => import('./pages/BookingManagement.jsx'));

const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
    }}>
        <div>Загрузка страницы...</div>
    </div>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Home />
                    </Suspense>
                )
            },
            {
                path: 'services',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Services />
                    </Suspense>
                )
            },
            {
                path: 'portfolio',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Portfolio />
                    </Suspense>
                )
            },
            {
                path: 'contacts',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Contacts />
                    </Suspense>
                )
            },
            {
                path: 'booking',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Booking />
                    </Suspense>
                )
            },
            {
                path: '/admin',
                element: <AdminPanel />
            },
            {
                path: '/admin-login',
                element: <AdminLogin />
            }
        ],
    },
]);

export default router;
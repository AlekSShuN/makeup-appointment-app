import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./component/Layout/Layout.jsx";
import AdminLogin from './pages/AdminLogin.jsx';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute.jsx';
import ErrorBoundary from './component/ErrorBoundary/ErrorBoundary.jsx';
import Loader from './component/Loader/Loader.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'));
const Contacts = lazy(() => import('./pages/Contacts.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const AdminPanel = lazy(() => import('./pages/AdminPanel.jsx'));

const withSuspense = (Component) => (
    <ErrorBoundary>
        <Suspense fallback={<Loader text="Загрузка страницы..." />}>
            <Component />
        </Suspense>
    </ErrorBoundary>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: withSuspense(Home) },
            { path: 'services', element: withSuspense(Services) },
            { path: 'portfolio', element: withSuspense(Portfolio) },
            { path: 'contacts', element: withSuspense(Contacts) },
            { path: 'booking', element: withSuspense(Booking) },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute>
                        {withSuspense(AdminPanel)}
                    </ProtectedRoute>
                )
            },
            { path: 'admin-login', element: <AdminLogin /> },
        ],
    },
]);

export default router;

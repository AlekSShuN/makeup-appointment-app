import { createBrowserRouter } from "react-router-dom";
import Layout from "./component/Layout/Layout.jsx";
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contacts from './pages/Contacts.jsx';
import Booking from './pages/Booking.jsx';




const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '', element: <Home /> },
            { path: 'services', element: <Services /> },
            { path: 'portfolio', element: <Portfolio /> },
            { path: 'contacts', element: <Contacts /> },
            {
                path: 'booking', element: <Booking />,
            },
        ],
    },
]);

export default router;
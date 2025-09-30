import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import style from './Layout.module.css';

const Layout = () => {
    const location = useLocation();

    const getPageClass = () => {
        const path = location.pathname;
        if (path === '/') return style.homePage;
        if (path === '/booking') return style.bookingPage;
        if (path === '/services') return style.servicesPage;
        if (path === '/portfolio') return style.portfolioPage;
        if (path === '/contacts') return style.contactsPage;
        return '';
    };

    return (
        <div className={`${style.layout} ${getPageClass()}`}>
            <Header />
            <main
                className={style.main}
                id="main-content"
                aria-label="Основное содержимое страницы">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
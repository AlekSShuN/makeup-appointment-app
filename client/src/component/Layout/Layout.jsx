import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import React from 'react';


const Layout = () => {
    return (
        <div className={style.layout}>
            <Header />
            <main className={style.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
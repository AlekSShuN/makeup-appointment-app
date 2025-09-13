import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import React from 'react';
import style from './Layout.module.css';



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
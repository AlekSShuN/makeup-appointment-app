import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import style from './Wrapper.module.css';

const Wrapper = () => {
    return (
        <div className={style.layot}>
            <Header />
            <main className={style.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Wrapper;
import { RouterProvider } from 'react-router-dom';
import router from './routes.jsx';
import { useEffect, useState } from 'react';
import './styles/global.css';


function App() {
    const [isScroll, setIsScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScroll(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={isScroll ? 'scrolled' : ''}><RouterProvider router={router} />
        </div>
    );
}


export default App;

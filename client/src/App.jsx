import { RouterProvider } from 'react-router-dom';
import router from './routes.jsx';
import './styles/global.css';

function App() {
    return (
        <RouterProvider
            router={router}
            fallbackElement={<div>Загрузка приложения...</div>} />
    );
}

export default App;

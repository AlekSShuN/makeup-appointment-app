import express from 'express';
import cors from 'cors';
import bookingsRoutes from './routes/bookings.js';
import servicesRoutes from './routes/services.js';
import healthRoutes from './routes/health.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/health', healthRoutes);


/*app.get('/api/services', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'Макияж', price: 2500 },
            { id: 2, name: 'Прическа', price: 3000 },
            { id: 3, name: 'Маникюр', price: 2000 }
        ]
    });
});

app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});*/

app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

export default app;

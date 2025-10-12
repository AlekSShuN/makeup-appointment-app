import express from 'express';
import cors from 'cors';
import bookingsRoutes from './routes/bookings.js';
import servicesRoutes from './routes/services.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';


const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log('📨 Request to:', req.method, req.url);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/health', healthRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

export default app;

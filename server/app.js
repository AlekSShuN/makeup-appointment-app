import express from 'express';
import cors from 'cors';
import bookingsRouter from './routes/bookings.js';
import servisRouter from './routes/servis.js';
import healthRouter from './routes/health.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/servis', servisRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/health', healthRouter);


app.use('*', (req, res) => {
    res.status(404).json({
        succes: false,
        error: 'NOT_FOUND',
        message: 'Route not found',
        requestedUrl: req.originalUrl
    });
});

export default app;

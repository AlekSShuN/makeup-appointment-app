import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Базовые маршруты
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!', status: 'OK' });
});

app.get('/api/appointments', (req, res) => {
    res.json({ message: 'Get all appointments' });
});

app.post('/api/appointments', (req, res) => {
    res.json({ message: 'Create new appointment', data: req.body });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!', status: 'OK' });
});

app.get('/api/appointments', (req, res) => {
    res.json({ message: 'Get all appointments' });
});

app.post('/api/appointments', (req, res) => {
    res.json({ message: 'Create new appointment', data: req.body });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
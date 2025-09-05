import express from 'express';
const router = express.Router();
import path from 'path';
import fs from 'fs/promises';


const bookingsPath = path.join(process.cwd(), 'server', 'data', 'bookings.json');

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(bookingsPath, 'utf-8');
        const bookings = JSON.parse(data);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error reading' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await fs.readFile(bookingsPath, 'utf8');
        const bookings = JSON.parse(data);
        const booking = bookings.find(b => b.id === parseInt(req.params.id));
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error reading' });
    }
});

export default router;

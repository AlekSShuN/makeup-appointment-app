const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const bookingsPath = path.join(__dirname, '../data/bookings.json');

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

module.export = router;

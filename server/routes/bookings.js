import express from 'express';
const router = express.Router();
import db from '../db.js';

// Роут для получения доступных слотов времени
router.get('/booking-slots', async (req, res) => {
    try {
        const { date, serviceId } = req.query;

        console.log('📅 Getting slots for:', { date, serviceId });

        if (!date || !serviceId) {
            return res.status(400).json({
                error: 'Missing date or serviceId parameter'
            });
        }

        const bookedSlots = db.prepare(`
            SELECT time FROM bookings 
            WHERE date = ? AND service_id = ?
        `).all(date, serviceId).map(row => row.time);

        const allTimeSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
        ];

        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

        console.log('✅ Available slots:', availableSlots);
        res.json(availableSlots);

    } catch (error) {
        console.error('❌ Error in booking-slots:', error);

        const allTimeSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
        ];

        res.json(allTimeSlots);
    }
});

// Роут для создания бронирования
router.post('/', async (req, res) => {
    try {
        const { serviceId, date, time, client } = req.body;

        console.log('📝 Creating booking:', { serviceId, date, time, client });

        if (!serviceId || !date || !time || !client || !client.name || !client.phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const existingBooking = db.prepare(`
            SELECT id FROM bookings 
            WHERE date = ? AND time = ? AND service_id = ?
        `).get(date, time, serviceId);

        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: 'Это время уже занято'
            });
        }

        const stmt = db.prepare(`
            INSERT INTO bookings (service_id, date, time, client_name, client_phone, client_comment)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            String(serviceId),
            date,
            time,
            client.name.trim(),
            client.phone,
            client.comment || ''
        );

        console.log('✅ Booking created with ID:', result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: '✅ Запись успешно создана! Мы свяжемся с вами для подтверждения.',
            bookingId: result.lastInsertRowid
        });

    } catch (error) {
        console.error('❌ Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании записи'
        });
    }
});

// Роут для получения всех бронирований (для админки)
router.get('/', async (req, res) => {
    try {
        const bookings = db.prepare(`
            SELECT * FROM bookings 
            ORDER BY date DESC, time DESC
        `).all();

        console.log('📋 Retrieved bookings:', bookings.length);
        res.json(bookings);
    } catch (error) {
        console.error('❌ Error reading bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const booking = db.prepare(`
            SELECT * FROM bookings WHERE id = ?
        `).get(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('❌ Error reading booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
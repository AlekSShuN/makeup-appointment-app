import express from 'express';
const router = express.Router();
import db from '../db.js';
import { sendTelegramNotification } from '../telegramBot.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkAdminAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Роут для получения доступных слотов времени
router.get('/booking-slots', async (req, res) => {
    try {
        const { date, serviceId } = req.query;

        console.log('📅 Getting slots for:', { date, serviceId, query: req.query });

        // Упрощенная валидация
        if (!date || !serviceId) {
            console.log('❌ Missing parameters:', { date, serviceId });
            return res.status(400).json({
                error: 'Missing date or serviceId parameter',
                received: { date, serviceId }
            });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            console.log('❌ Invalid date format:', date);
            return res.status(400).json({
                error: 'Invalid date format. Use YYYY-MM-DD',
                received: date
            });
        }

        const cleanServiceId = serviceId.toString().trim();
        console.log('🔍 Clean serviceId:', cleanServiceId);

        if (cleanServiceId === '') {
            console.log('❌ Empty serviceId');
            return res.status(400).json({
                error: 'Service ID cannot be empty',
                received: serviceId
            });
        }

        console.log('🔍 Querying database with:', { date, cleanServiceId });

        try {
            const bookedSlots = db.prepare(`
                SELECT time FROM bookings 
                WHERE date = ? AND service_id = ?
            `).all(date, cleanServiceId).map(row => row.time);

            console.log('📊 Booked slots:', bookedSlots);

            const allTimeSlots = [
                '06:00', '07:00', '08:00',
                '09:00', '10:00', '11:00', '12:00',
                '14:00', '15:00', '16:00', '17:00'
            ];

            const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

            console.log('✅ Available slots:', availableSlots);
            res.json(availableSlots);

        } catch (dbError) {
            console.error('❌ Database error:', dbError);
            const allTimeSlots = [
                '06:00', '07:00', '08:00',
                '09:00', '10:00', '11:00', '12:00',
                '14:00', '15:00', '16:00', '17:00'
            ];
            res.json(allTimeSlots);
        }

    } catch (error) {
        console.error('❌ Error in booking-slots:', error);

        const allTimeSlots = [
            '06:00', '07:00', '08:00',
            '09:00', '10:00', '11:00', '12:00',
            '14:00', '15:00', '16:00', '17:00'
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

        const bookingId = result.lastInsertRowid;
        console.log('✅ Booking created with ID:', bookingId);

        try {
            const servicesPath = path.join(__dirname, '..', 'data', 'services.json');
            const servicesData = await fs.readFile(servicesPath, 'utf8');
            const services = JSON.parse(servicesData);
            const service = services.find(s => s.id == serviceId);

            await sendTelegramNotification({
                serviceId,
                date,
                time,
                client,
                bookingId
            }, service);

            console.log('✅ Telegram notification sent');
        } catch (telegramError) {
            console.error('❌ Failed to send Telegram notification:', telegramError);
        }

        res.status(201).json({
            success: true,
            message: '✅ Запись успешно создана! Мы свяжемся с вами для подтверждения.',
            bookingId: bookingId
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
router.get('/', checkAdminAuth, async (req, res) => {
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

//Роут получения конкретной брони
router.get('/:id', checkAdminAuth, async (req, res) => {
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

router.delete('/:id', checkAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🗑️ Deleting booking with ID:', id);

        const existingBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

        if (!existingBooking) {
            return res.status(404).json({
                success: false,
                message: 'Запись не найдена'
            });
        }

        const stmt = db.prepare('DELETE FROM bookings WHERE id = ?');
        const result = stmt.run(id);

        console.log('✅ Booking deleted successfully, changes:', result.changes);

        res.json({
            success: true,
            message: 'Запись успешно удалена',
            deletedId: id
        });

    } catch (error) {
        console.error('❌ Error deleting booking:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении записи: ' + error.message
        });
    }
});

export default router;
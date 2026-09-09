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

const WORKDAY_START_MINUTES = 6 * 60;
const WORKDAY_END_MINUTES = 20 * 60;
const SLOT_STEP_MINUTES = 30;

const timeToMinutes = (time) => {
    const [hours, minutes] = String(time).split(':').map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours}:${mins}`;
};

const buildTimeSlots = () => {
    const slots = [];
    for (let minutes = WORKDAY_START_MINUTES; minutes < WORKDAY_END_MINUTES; minutes += SLOT_STEP_MINUTES) {
        slots.push(minutesToTime(minutes));
    }
    return slots;
};

const DEFAULT_TIME_SLOTS = buildTimeSlots();

const getServiceDuration = (services, serviceIds) => {
    const ids = Array.isArray(serviceIds) ? serviceIds.map(String) : [String(serviceIds)];
    const totalDuration = services
        .filter((service) => ids.includes(String(service.id)))
        .reduce((sum, service) => sum + Number(service.duration || 0), 0);

    return totalDuration > 0 ? totalDuration : 60;
};

const normalizeServiceIds = (value) => (
    Array.isArray(value) && value.length > 0
        ? value.map(String)
        : String(value || '')
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
);

// Роут для получения доступных слотов времени
router.get('/booking-slots', async (req, res) => {
    try {
        const { date, serviceId } = req.query;

        console.log('📅 Getting slots for:', { date, serviceId, query: req.query });

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
        if (cleanServiceId === '') {
            return res.status(400).json({
                error: 'Service ID cannot be empty',
                received: serviceId
            });
        }

        try {
            const servicesPath = path.join(__dirname, '..', 'data', 'services.json');
            const servicesData = await fs.readFile(servicesPath, 'utf8');
            const services = JSON.parse(servicesData);
            const requestedDuration = getServiceDuration(services, cleanServiceId);

            const bookedIntervals = db.prepare(`
                SELECT time, service_id FROM bookings 
                WHERE date = ?
            `).all(date).map((row) => {
                const bookedIds = normalizeServiceIds(row.service_id);
                const start = timeToMinutes(row.time);
                const duration = getServiceDuration(services, bookedIds);
                return { start, end: start + duration };
            });

            const availableSlots = DEFAULT_TIME_SLOTS.filter((slot) => {
                const start = timeToMinutes(slot);
                const end = start + requestedDuration;

                if (end > WORKDAY_END_MINUTES) {
                    return false;
                }

                return bookedIntervals.every((interval) => end <= interval.start || start >= interval.end);
            });
            console.log('✅ Available slots:', availableSlots);
            res.json(availableSlots);
        } catch (dbError) {
            console.error('❌ Database error:', dbError);
            res.json(DEFAULT_TIME_SLOTS);
        }
    } catch (error) {
        console.error('❌ Error in booking-slots:', error);
        res.json(DEFAULT_TIME_SLOTS);
    }
});

// Роут для создания бронирования
router.post('/', async (req, res) => {
    try {
        const { serviceId, serviceIds, date, time, client, totalPrice } = req.body;

        console.log('📝 Creating booking:', { serviceId, serviceIds, date, time, client, totalPrice });

        const normalizedIds = normalizeServiceIds(serviceIds?.length ? serviceIds : serviceId);

        if (normalizedIds.length === 0 || !date || !time || !client || !client.name || !client.phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const storedServiceId = normalizedIds.join(',');
        const servicesPath = path.join(__dirname, '..', 'data', 'services.json');
        const servicesData = await fs.readFile(servicesPath, 'utf8');
        const services = JSON.parse(servicesData);
        const requestedDuration = getServiceDuration(services, normalizedIds);
        const requestedStart = timeToMinutes(time);
        const requestedEnd = requestedStart + requestedDuration;

        if (requestedEnd > WORKDAY_END_MINUTES) {
            return res.status(409).json({
                success: false,
                message: 'Выбранное время выходит за рамки рабочего дня'
            });
        }

        const sameDayBookings = db.prepare(`
            SELECT id, time, service_id FROM bookings 
            WHERE date = ?
        `).all(date);

        const hasOverlap = sameDayBookings.some((booking) => {
            const bookingStart = timeToMinutes(booking.time);
            const bookingDuration = getServiceDuration(services, normalizeServiceIds(booking.service_id));
            const bookingEnd = bookingStart + bookingDuration;

            return requestedStart < bookingEnd && requestedEnd > bookingStart;
        });

        if (hasOverlap) {
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
            storedServiceId,
            date,
            time,
            client.name.trim(),
            client.phone,
            client.comment || ''
        );

        const bookingId = result.lastInsertRowid;
        console.log('✅ Booking created with ID:', bookingId);

        const bookingData = {
            bookingId,
            date,
            time,
            totalPrice: totalPrice || null,
            client: {
                name: client.name,
                phone: client.phone,
                comment: client.comment || ''
            }
        };

        try {
            let service = null;
            try {
                const matched = services.filter(s => normalizedIds.includes(String(s.id)));
                const total = matched.reduce((sum, item) => sum + Number(item.price || 0), 0);
                service = {
                    name: matched.map(item => item.name).join(', ') || `Услуги: ${storedServiceId}`,
                    price: totalPrice ?? total,
                };
            } catch (serviceError) {
                console.log('⚠️ Could not load service info:', serviceError.message);
                service = { name: `Услуги: ${storedServiceId}`, price: totalPrice };
            }

            await sendTelegramNotification(bookingData, service);
        } catch (telegramError) {
            console.error('❌ Failed to send Telegram notification:', telegramError);
        }

        res.status(201).json({
            success: true,
            message: '✅ Запись успешно создана! Мы свяжемся с вами для подтверждения.',
            bookingId
        });
    } catch (error) {
        console.error('❌ Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании записи'
        });
    }
});

router.get('/', checkAdminAuth, async (req, res) => {
    try {
        const bookings = db.prepare(`
            SELECT * FROM bookings 
            ORDER BY date DESC, time DESC
        `).all();

        res.json(bookings);
    } catch (error) {
        console.error('❌ Error reading bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
        const existingBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

        if (!existingBooking) {
            return res.status(404).json({
                success: false,
                message: 'Запись не найдена'
            });
        }

        const stmt = db.prepare('DELETE FROM bookings WHERE id = ?');
        const result = stmt.run(id);

        res.json({
            success: true,
            message: 'Запись успешно удалена',
            deletedId: id,
            changes: result.changes
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

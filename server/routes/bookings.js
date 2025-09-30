import express from 'express';
const router = express.Router();
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Правильное определение путей для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookingsPath = path.join(__dirname, '..', 'data', 'bookings.json');

// Создаем файл если его нет
const ensureBookingsFile = async () => {
    try {
        await fs.access(bookingsPath);
    } catch (error) {
        // Файла нет - создаем
        await fs.writeFile(bookingsPath, JSON.stringify([]));
        console.log('Created bookings.json file');
    }
};

// Роут для получения доступных слотов
router.get('/booking-slots', async (req, res) => {
    try {
        await ensureBookingsFile();

        const { date, serviceId } = req.query;

        console.log('Getting slots for:', { date, serviceId });

        if (!date || !serviceId) {
            return res.status(400).json({
                error: 'Missing date or serviceId parameter'
            });
        }

        // Читаем существующие брони
        const data = await fs.readFile(bookingsPath, 'utf-8');
        const bookings = JSON.parse(data);

        // Фильтруем брони на выбранную дату и услугу
        const bookingsOnDate = bookings.filter(booking =>
            booking.date === date && booking.serviceId === serviceId
        );

        // Все возможные временные слоты
        const allTimeSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
        ];

        // Занятые слоты
        const bookedSlots = bookingsOnDate.map(booking => booking.time);

        // Доступные слоты (исключаем занятые)
        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

        console.log('Available slots:', availableSlots);

        res.json(availableSlots);
    } catch (error) {
        console.error('Error in booking-slots:', error);

        // В случае ошибки возвращаем все слоты
        const allTimeSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
        ];

        res.json(allTimeSlots);
    }
});

// Роут для создания бронирований
router.post('/', async (req, res) => {
    try {
        await ensureBookingsFile();

        const { serviceId, date, time, client } = req.body;

        if (!serviceId || !date || !time || !client) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Читаем текущие брони
        const data = await fs.readFile(bookingsPath, 'utf-8');
        const bookings = JSON.parse(data);

        // Создаем новую бронь
        const newBooking = {
            id: Date.now(),
            serviceId: String(serviceId),
            date,
            time,
            client,
            createdAt: new Date().toISOString()
        };

        // Добавляем в массив
        bookings.push(newBooking);

        // Сохраняем обратно в файл
        await fs.writeFile(bookingsPath, JSON.stringify(bookings, null, 2));

        console.log('Booking created:', newBooking);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: newBooking
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
});

// Получение всех бронирований
router.get('/', async (req, res) => {
    try {
        await ensureBookingsFile();

        const data = await fs.readFile(bookingsPath, 'utf-8');
        const bookings = JSON.parse(data);
        res.json(bookings);
    } catch (error) {
        console.error('Error reading bookings:', error);
        res.status(500).json({
            message: 'Error reading bookings',
            error: error.message
        });
    }
});

// Получение конкретной брони
router.get('/:id', async (req, res) => {
    try {
        await ensureBookingsFile();

        const data = await fs.readFile(bookingsPath, 'utf8');
        const bookings = JSON.parse(data);
        const booking = bookings.find(b => b.id === parseInt(req.params.id));

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error reading booking:', error);
        res.status(500).json({
            message: 'Error reading booking',
            error: error.message
        });
    }
});

export default router;
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const servicesPath = path.join(__dirname, '..', 'data', 'services.json');

//GET запрос для получения данных услуг
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(servicesPath, 'utf8');
        const services = JSON.parse(data);
        res.json(services);
    } catch (error) {
        console.error('Error reading services:', error);
        if (error.code === 'ENOENT') {
            return res.json([
                { "id": 1, "name": "Дневной макияж", "price": 2000, "duration": 60 },
                { "id": 2, "name": "Вечерний макияж", "price": 2500, "duration": 60 },
                { "id": 3, "name": "Свадебный образ", "price": 6000, "duration": 150 },
                { "id": 4, "name": "Локоны/Укладка", "price": 2000, "duration": 60 },
                { "id": 5, "name": "Сопровождение невесты", "price": 2000, "duration": 60 },
                { "id": 6, "name": "Репетиция свадебного образа", "price": 5000, "duration": 180 },
                { "id": 7, "name": "Выезд в отель", "price": 2000 },
                { "id": 8, "name": "Урок макияжа для себя", "price": 4500, "duration": 240 },
                { "id": 9, "name": "Реснички", "price": 149 }
            ]);
        }

        res.status(500).json({
            success: false,
            message: 'Error reading service data',
            error: error.message
        });
    }
});
export default router;

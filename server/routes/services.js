import express from 'express';
const router = express.Router();
import path from 'path';
import fs from 'fs/promises';

const servicesPath = path.join(process.cwd(), 'server', 'data', 'servis.json');
//GET запрос для получения данных услуг

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(servicesPath, 'utf8');
        const servis = JSON.parse(data);
        res.json(servis);
    } catch (error) {
        console.error(error);
        if (error.code === 'ENOENT') {
            return res.json({
                success: true,
                data: [
                    { "id": 1, "name": "Дневной макияж", "description": "Естественный и легкий макияж для повседневных образов.", "price": 2500, "duration": 60 },
                    { "id": 2, "name": "Вечерний макияж", "description": "Яркий и выразительный макияж для вечерних выходов и мероприятий.", "price": 3500, "duration": 90 },
                    { "id": 3, "name": "Свадебный макияж", "description": "Стойкий и фотогеничный макияж для самого важного дня.", "price": 5000, "duration": 120 },
                    { "id": 4, "name": "Обучение макияжу", "description": "Индивидуальный урок по подбору и нанесению косметики.", "price": 6000, "duration": 120 }
                ]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error reading service data',
            error: error.message
        });
    }
});
export default router;

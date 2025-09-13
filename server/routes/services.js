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
                    { id: 1, name: 'Макияж', price: 2500 },
                    { id: 2, name: 'Прическа', price: 3000 },
                    { id: 3, name: 'Маникюр', price: 2000 }
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

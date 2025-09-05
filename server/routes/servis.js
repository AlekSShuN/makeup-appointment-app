import express from 'express';
const router = express.Router();
import path from 'path';
import fs from 'fs/promises';

const servicesPath = path.join(process.cwd(), 'server', 'data', 'servis.json');
//GET запрос для получения данных услуг

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(servicesPath,);
        const servis = JSON.parce(data);
        res.json(servis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messge: 'error reading service data' });
    }
});

export default router;

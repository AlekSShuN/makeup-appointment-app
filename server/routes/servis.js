const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const servisPath = path.join(__dirname, '..//data/servis.json');

//GET запрос для получения данных услуг

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(servisPath,);
        const servis = JSON.parce(data);
        res.json(servis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messge: 'error reading service data' });
    }
});

module.exports = router;

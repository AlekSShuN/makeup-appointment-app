const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
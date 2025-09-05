const express = require('express');
const cors = require('cors');
const bookingsRouter = require('./routes/bookings.js');
const servisRouter = require('./routes/servis.js');
const healthRouter = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/servis', servisRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/health', healthRouter);


app.use('*', (req, res) => {
    res.status(404).json({
        succes: false,
        error: 'NOT_FOUND',
        message: 'Route not found',
        requestedUrl: req.originalUrl
    });
});

module.exports = app;

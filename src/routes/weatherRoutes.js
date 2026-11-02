const express = require('express');
const router = express.Router();
const db = require('../config/dbPool');

// GET: Render Weather Logs View
router.get('/weather', async (req, res) => {
    try {
        const [logs] = await db.query('SELECT * FROM weather_logs ORDER BY log_date DESC');
        res.render('weather-logs', { logs });
    } catch (err) {
        console.error('Error fetching weather logs:', err);
        res.status(500).send('Server Error fetching Weather Logs');
    }
});

// POST: Handle New Weather Log Submission
router.post('/weather/add', async (req, res) => {
    const { farm_id, temperature_c, humidity_pct, rainfall_mm, log_date } = req.body;
    try {
        await db.query(
            'INSERT INTO weather_logs (farm_id, temperature_c, humidity_pct, rainfall_mm, log_date) VALUES (?, ?, ?, ?, ?)',
            [farm_id, temperature_c, humidity_pct, rainfall_mm, log_date]
        );
        res.redirect('/weather');
    } catch (err) {
        console.error('Error saving weather log:', err);
        res.status(500).send('Server Error saving Weather Log');
    }
});

module.exports = router;
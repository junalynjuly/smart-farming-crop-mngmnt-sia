const express = require('express');
const router = express.Router();
const  db  = require('../src/config/db');

// --- PEST REPORTS ---
router.get('/pest-reports', (req, res) => {
    db.query('SELECT * FROM pest_reports', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.render('pest-reports', { reports: results });
    });
});

router.post('/pest-reports/add', (req, res) => {
    const { field_id, pest_name, severity, notes } = req.body;
    db.query(
        'INSERT INTO pest_reports (field_id, pest_name, severity, notes) VALUES (?, ?, ?, ?)',
        [field_id, pest_name, severity, notes],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.redirect('/pest-reports');
        }
    );
});

// --- WEATHER LOGS ---
router.get('/weather-logs', (req, res) => {
    db.query('SELECT * FROM weather_logs', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.render('weather-logs', { logs: results });
    });
});

router.post('/weather-logs/add', (req, res) => {
    const { field_id, temperature, humidity, rainfall, logged_at } = req.body;
    db.query(
        'INSERT INTO weather_logs (field_id, temperature, humidity, rainfall, logged_at) VALUES (?, ?, ?, ?, ?)',
        [field_id, temperature, humidity, rainfall, logged_at],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.redirect('/weather-logs');
        }
    );
});
// --- DASHBOARD & PEST REPORT COUNT (RIGHT JOIN) ---
router.get('/dashboard', async (req, res) => {
    try {
        const [plantings] = await db.query('SELECT COUNT(*) AS total FROM plantings');
        const [harvests] = await db.query('SELECT COUNT(*) AS total FROM harvests');
        const [inputs] = await db.query('SELECT COUNT(*) AS total FROM input_usage');
        
        res.render('dashboard', { 
            plantingCount: plantings[0].total,
            harvestCount: harvests[0].total,
            inputCount: inputs[0].total
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
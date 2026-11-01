const express = require('express');
const router = express.Router();
const db = require('../src/config/db');

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
router.get('/dashboard', (req, res) => {
    const sql = `
        SELECT c.crop_name, COUNT(pr.report_id) AS pest_count
        FROM fields f
        JOIN pest_reports pr ON f.field_id = pr.field_id
        RIGHT JOIN crops c ON f.crop_id = c.crop_id
        GROUP BY c.crop_id, c.crop_name;
    `;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.render('dashboard', { pestCounts: results });
    });
});
module.exports = router;
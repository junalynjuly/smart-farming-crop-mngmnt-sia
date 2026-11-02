const express = require('express');
const router = express.Router();
const db = require('../config/dbPool'); // Database pool connection

// 1. GET: Render Pest Reports View
router.get('/pest-reports', async (req, res) => {
    try {
        const [reports] = await db.query('SELECT * FROM pest_reports ORDER BY created_at DESC');
        res.render('pest-reports', { reports });
    } catch (err) {
        console.error('Error fetching pest reports:', err);
        res.status(500).send('Server Error fetching Pest Reports');
    }
});

// 2. POST: Handle Form Submission for New Pest Sightings
router.post('/pest-reports/add', async (req, res) => {
    const { pest_type, severity, notes } = req.body;
    try {
        await db.query(
            'INSERT INTO pest_reports (pest_type, severity, notes, created_at) VALUES (?, ?, ?, NOW())',
            [pest_type, severity, notes]
        );
        res.redirect('/pest-reports');
    } catch (err) {
        console.error('Error saving pest report:', err);
        res.status(500).send('Server Error saving Pest Report');
    }
});

module.exports = router;
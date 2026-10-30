const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all input usage records
router.get('/api/input-usage', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM input_usage');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST a new input usage record
router.post('/api/input-usage', async (req, res) => {
    const { planting_id, input_id, quantity_used, application_date } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO input_usage (planting_id, input_id, quantity_used, application_date) VALUES (?, ?, ?, ?)',
            [planting_id, input_id, quantity_used, application_date]
        );
        res.status(201).json({ success: true, message: "Input usage recorded successfully", usageId: result.insertId });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all harvests
router.get('/api/harvests', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM harvests');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST a new harvest (Transactional: updates planting status to Harvested)
router.post('/api/harvests', async (req, res) => {
    const { planting_id, quantity, harvest_date, quality_grade } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO harvests (planting_id, quantity, harvest_date, quality_grade) VALUES (?, ?, ?, ?)',
            [planting_id, quantity, harvest_date, quality_grade]
        );

        await connection.query(
            'UPDATE plantings SET status = "Harvested" WHERE planting_id = ?',
            [planting_id]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({ success: true, message: "Harvest recorded successfully", harvestId: result.insertId });
    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;


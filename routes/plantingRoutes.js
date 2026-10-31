const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all plantings from database
router.get('/api/plantings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM plantings');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST a new planting (Transactional: updates field status)
router.post('/api/plantings', async (req, res) => {
    const { field_id, crop_id, planted_by, planting_date } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO plantings (field_id, crop_id, planted_by, planting_date, status) VALUES (?, ?, ?, ?, "Active")',
            [field_id, crop_id, planted_by, planting_date]
        );

        await connection.query(
            'UPDATE fields SET status = "Planted" WHERE id = ?',
            [field_id]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({ success: true, message: "Planting created successfully", plantingId: result.insertId });
    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE a planting
router.delete('/api/plantings/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM plantings WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: `Planting ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET JOIN report: Plantings with Field and Crop details
router.get('/api/reports/plantings-overview', async (req, res) => {
    try {
        const query = `
            SELECT p.*, f.*, c.* 
            FROM plantings p
            JOIN fields f ON p.field_id = f.field_id
            JOIN crops c ON p.crop_id = c.crop_id
        `;
        const [rows] = await db.query(query);
        res.json({ success: true, report: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


module.exports = router;


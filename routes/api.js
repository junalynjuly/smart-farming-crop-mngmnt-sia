const express = require('express');
const router = express.Router();
const db = require('../src/config/db');

// GET all pest reports as JSON
router.get('/pest-reports', async (req, res) => {
    try {
        const [reports] = await db.query(`
            SELECT pr.*, p.planting_id, c.crop_name, f.field_name 
            FROM pest_reports prs
            JOIN plantings p ON pr.planting_id = p.planting_id
            JOIN crops c ON p.crop_id = c.crop_id
            JOIN fields f ON p.field_id = f.field_id
            ORDER BY pr.reported_date DESC
        `);

        res.json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: 'Database Error' });
    }
});

module.exports = router;
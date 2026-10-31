const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/care-tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM care_tasks');
        res.render('careTasks', { tasks: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
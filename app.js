const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

// Routes
const plantingRoutes = require('./routes/plantingRoutes');
const harvestRoutes = require('./routes/harvestRoutes');
const inputUsageRoutes = require('./routes/inputUsageRoutes');

app.use(plantingRoutes);
app.use(harvestRoutes);
app.use(inputUsageRoutes);

const db = require('./config/db');

app.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.*, f.field_name, c.crop_name 
            FROM plantings p
            JOIN fields f ON p.field_id = f.field_id 
            JOIN crops c ON p.crop_id = c.crop_id
        `;
        const [report] = await db.query(query);
        const [harvests] = await db.query('SELECT * FROM harvests'); // <-- Add this line
        const [inputs] = await db.query('SELECT * FROM input_usage'); // <-- Add this line
        res.render('index', { report, harvests, inputs });             // <-- Update this line
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});


// Handle new planting form submission
app.post('/plantings/add', async (req, res) => {
    const { field_id, crop_id, planted_by, planting_date, expected_harvest_date, current_stage_id } = req.body;
    try {
        await db.query(
            'INSERT INTO plantings (field_id, crop_id, planted_by, planting_date, expected_harvest_date, current_stage_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [field_id, crop_id, planted_by, planting_date, expected_harvest_date, current_stage_id, 'Active']
        );
        res.redirect('/');
} catch (err) {
    res.send("<script>alert('Invalid ID provided! Please check your Field, Crop, or User ID.'); window.location.href='/';</script>");
}
});

// Handle new harvest form submission
app.post('/harvests/add', async (req, res) => {
    const { planting_id, quantity_kg, harvest_date, quality_grade, recorded_by } = req.body;
    try {
        await db.query(
            'INSERT INTO harvests (planting_id, quantity_kg, harvest_date, quality_grade, recorded_by) VALUES (?, ?, ?, ?, ?)',
            [planting_id, quantity_kg, harvest_date, quality_grade, recorded_by]
        );
        
        await db.query(
            'UPDATE plantings SET status = "Harvested" WHERE planting_id = ?',
            [planting_id]
        );

        res.redirect('/');
} catch (err) {
    res.send("<script>alert('Invalid Planting ID provided! Please use an existing Planting ID.'); window.location.href='/';</script>");
}

});


// Handle new input usage form submission
app.post('/inputs/add', async (req, res) => {
    const { planting_id, input_id, quantity_used, usage_date, used_by } = req.body;
    try {
        await db.query(
            'INSERT INTO input_usage (planting_id, input_id, quantity_used, usage_date, used_by) VALUES (?, ?, ?, ?, ?)',
            [planting_id, input_id, quantity_used, usage_date, used_by]
        );
        res.redirect('/');
} catch (err) {
    res.send("<script>alert('Invalid Planting or Input ID provided! Please verify your IDs.'); window.location.href='/';</script>");
}

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});















const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Existing routes
const pestWeatherRouter = require('./routes/masterDataRoutes');
app.use('/', pestWeatherRouter);

const alertRouter = require('./routes/alertRoutes');
app.use('/', alertRouter);

const sensorRouter = require('./routes/sensorRoutes');
app.use('/', sensorRouter);

app.use('/api/plantings', require('./src/routes/plantingRoutes'));

// Current Stage per Planting
app.use('/api/current-stages', require('./src/routes/currentStageRoutes'));
app.use('/api/stage-advancement', require('./src/routes/stageAdvancementRoutes'));

app.use('/api/harvests', require('./src/routes/harvestRoutes'));
app.use('/api/input-usage', require('./src/routes/inputUsageRoutes'));
app.use('/', require('./src/routes/readingsAlertsRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));

const growthStageRoutes = require('./src/routes/growthStageRoutes');
app.use('/api/growth-stages', growthStageRoutes);

app.use('/api/thresholds', require('./src/routes/thresholdRoutes'));
app.use('/api/care-tasks', require('./src/routes/careTaskRoutes'));

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Smart Farming and Crop Management System API is running!'
    });
});


// Frontend View Route for Plantings
app.get('/plantings', (req, res) => {
    res.render('plantings');
});


// Frontend View Route for Harvests
app.get('/harvests', (req, res) => {
    res.render('harvests');
});


// Frontend View Route for Input Usage
app.get('/input-usage', (req, res) => {
    res.render('input_usage');
});


// Frontend View Route for Plantings-Harvest Report
app.get('/reports/plantings-harvests', (req, res) => {
    res.render('plantings_harvest_report');
});


// Frontend Dashboard Route
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
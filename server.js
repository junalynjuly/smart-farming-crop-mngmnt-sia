const express = require('express');
const app = express();

const PORT = 3000;

// Middleware to read JSON and form data requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Existing routes
const masterDataRouter = require('./routes/masterDataRoutes');
app.use('/', masterDataRouter);
// Use Pest Reports and Weather Logs routes
const pestWeatherRouter = require('./routes/pestWeather');
app.use('/', pestWeatherRouter);

// Test route
app.use('/', masterDataRouter);

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
const plantingRoutes = require('./src/routes/plantingRoutes');
app.use('/crops', plantingRoutes);
app.use('/api/thresholds', require('./src/routes/thresholdRoutes'));
const pestReportRoutes = require('./src/routes/pestReportsroutes');
app.use('/api/pest-reports', pestReportRoutes);

const weatherRoutes = require('./src/routes/weatherRoutes');
app.use('/', weatherRoutes);

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
// Home route

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Smart Farming and Crop Management System API is running!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const pestWeatherRouter = require('./routes/masterDataRoutes');
app.use('/', pestWeatherRouter);
const alertRouter = require('./routes/alertRoutes');
app.use('/', alertRouter);
const sensorRouter = require('./routes/sensorRoutes');
app.use('/', sensorRouter);
app.use('/api/plantings', require('./src/routes/plantingRoutes'));
app.use('/api/harvests', require('./src/routes/harvestRoutes'));
app.use('/api/input-usage', require('./src/routes/inputUsageRoutes'));
app.use('/', require('./src/routes/readingsAlertsRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));

const growthStageRoutes = require('./src/routes/growthStageRoutes');
app.use('/api/growth-stages', growthStageRoutes);
app.use('/api/thresholds', require('./src/routes/thresholdRoutes'));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Smart Farming and Crop Management System API is running!'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
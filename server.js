const express = require('express');
const app = express();
const session = require('express-session');
const { navFor } = require('./config/navigation');

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET || 'agrivance-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

app.use((req, res, next) => {
    res.locals.sessionUser = req.session.user || null;
    res.locals.navGroups = navFor(res.locals.sessionUser);
    res.locals.currentPath = req.path;
    next();
});
//const masterDataRouter = require('./routes/masterDataRoutes');
//app.use('/', masterDataRouter);

//const pestWeatherRouter = require('./routes/pestWeather');
//app.use('/', pestWeatherRouter);

//const userRoutes = require('./src/routes/userRoutes');
//app.use('/users', userRoutes);

//app.use('/', masterDataRouter);

//const alertRouter = require('./routes/alertRoutes');
//app.use('/', alertRouter);

//const sensorRouter = require('./routes/sensorRoutes');
//app.use('/', sensorRouter);

app.use('/api/plantings', require('./src/routes/plantingRoutes'));


app.use('/api/current-stages', require('./src/routes/currentStageRoutes'));
app.use('/api/stage-advancement', require('./src/routes/stageAdvancementRoutes'));

app.use('/api/harvests', require('./src/routes/harvestRoutes'));
app.use('/api/input-usage', require('./src/routes/inputUsageRoutes'));
app.use('/', require('./src/routes/readingsAlertsRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));

const growthStageRoutes = require('./src/routes/growthStageRoutes');
app.use('/api/growth-stages', growthStageRoutes);
const plantingRoutes = require('./src/routes/plantingRoutes');
app.use('/api/crops', plantingRoutes);
app.use('/api/thresholds', require('./src/routes/thresholdRoutes'));
app.use('/api/care-tasks', require('./src/routes/careTaskRoutes'));

const weatherRoutes = require('./src/routes/weatherRoutes');
app.use('/', weatherRoutes);

app.use('/', require('./routes/index'));
app.use('/pest-reports', require('./routes/pestReports'));
app.use('/', require('./routes/pestWeather'));
app.use('/thresholds', require('./routes/thresholds'));
app.use('/care-tasks', require('./routes/care-tasks'));
app.use('/fields', require('./routes/fields'));
app.use('/farms', require('./routes/farms'));
app.use('/roles', require('./routes/audit')); 
app.use('/crops', require('./routes/crops'));
app.use('/readings', require('./routes/readings'));
app.use('/alerts', require('./routes/alerts'));
app.use('/farm-inputs', require('./routes/farm-inputs'));
app.use('/reports/idle-fields', require('./routes/idle-fields'));
app.use('/reports/current-stage', require('./routes/current-stage'));
app.use('/reports/harvest-prediction', require('./routes/harvest-prediction'));
app.use('/reports/planting-inputs', require('./routes/planting-inputs'));
app.use('/audit', require('./routes/audit'));
app.use('/reports', require('./routes/reports'));
app.use('/', require('./routes/plantings'));
app.use('/', require('./routes/harvests'));
app.use('/', require('./routes/input_usage'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
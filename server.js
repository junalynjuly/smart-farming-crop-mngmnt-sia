const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const pestWeatherRouter = require('./routes/pestWeather');
app.use('/', pestWeatherRouter);

const growthStageRoutes = require('./src/routes/growthStageRoutes');
app.use('/api/growth-stages', growthStageRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Smart Farming and Crop Management System API is running!'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
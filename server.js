const express = require('express');
const app = express();

const PORT = 3000;

// Middleware to read JSON and form data requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Use Pest Reports and Weather Logs routes
const pestWeatherRouter = require('./routes/pestWeather');
app.use('/', pestWeatherRouter);

// Test route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Smart Farming and Crop Management System API is running!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
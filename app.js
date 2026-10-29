const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallbacksecret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Smart Farming Crop Management System - Initialized');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
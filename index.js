require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('./config/db')();

const app = express();
const PORT = process.env.PORT || 8080;

// Initial Middlewares
app.use(cors({
    origin: 'http://localhost:8080',  // Your frontend URL
    credentials: true,  // Allow credentials (cookies)
}));

app.use('/uploads/products', express.static(path.join(__dirname, './public/uploads/products')));  
app.use(cookieParser());

// Increase body-parser limit
app.use(express.json({ limit: '10mb' })); // Set to a higher limit as needed
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'client/dist')));// Catch-all route for SPA


// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

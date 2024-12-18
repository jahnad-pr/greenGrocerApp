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
    origin: 'https://green-grocer-space.vercel.app', // Your frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Optional: Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Optional: Allow specific headers
    exposedHeaders: ['Authorization'], // Optional: Expose custom headers to the client
    optionsSuccessStatus: 200, // Optional: Change default preflight response status
}));

app.use('/uploads/products', express.static(path.join(__dirname, './public/uploads/products')));  
app.use(cookieParser());

// Increase body-parser limit
app.use(express.json({ limit: '10mb' })); // Set to a higher limit as needed
app.use(express.urlencoded({ extended: true }));

// Serve static files



// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

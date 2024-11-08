// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const authRoutes = require('./routes/auth'); // Import auth routes
const createExamRoute = require('./routes/exams');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/auth', authRoutes); // Use auth routes under /api/auth
app.use('/api/exams', createExamRoute);

// Sample Route
app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

// Server Port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// backend/server.js

const express = require('express');
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize dotenv for environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/exams', examRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the admins JSON file
const adminsFilePath = path.join(__dirname, '../admins.json');

// Helper function to read admins data from JSON file
const readAdminsData = () => {
  const data = fs.readFileSync(adminsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write admins data to JSON file
const writeAdminsData = (data) => {
  fs.writeFileSync(adminsFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Admin registration route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const admins = readAdminsData();
  const adminExists = admins.find((admin) => admin.username === username);

  if (adminExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  // Hash the password and save the new admin
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = { username, password: hashedPassword };
  admins.push(newAdmin);
  writeAdminsData(admins);

  res.status(201).json({ message: 'Admin registered successfully' });
});

// Admin login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admins = readAdminsData();
  const admin = admins.find((admin) => admin.username === username);

  if (!admin) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: admin.username }, 'secretKey', { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Admin token verification route
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    res.status(200).json({ user: decoded });
  });
});

module.exports = router;

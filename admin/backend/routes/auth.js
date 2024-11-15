// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const adminsFilePath = path.join(__dirname, '../admins.json');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Helper function to read from JSON file
const getAdmins = () => {
  const data = fs.readFileSync(adminsFilePath);
  return JSON.parse(data);
};

// Helper function to save data to JSON file
const saveAdmins = (data) => {
  fs.writeFileSync(adminsFilePath, JSON.stringify(data, null, 2));
};

// Register Route
router.post('/register', async (req, res) => {
  const { username, password, subject, firstname, lastname, exams } = req.body;

  const adminsData = getAdmins();

  // Check if the subject already has an admin
  const subjectExists = adminsData.admins.some(admin => admin.subject === subject);
  if (subjectExists) {
    return res.status(400).json({ error: `An admin for ${subject} already exists` });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ subject }, SECRET_KEY); // Permanent token

  const newAdmin = { username, password: hashedPassword, subject, firstname, lastname, token, exams };
  adminsData.admins.push(newAdmin);
  saveAdmins(adminsData);

  return res.status(201).json({ message: 'Admin registered successfully', token });
});

// Sign-In Route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const adminsData = getAdmins();

  // Find the admin with matching username
  const admin = adminsData.admins.find(admin => admin.username === username);
  if (!admin) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Check the password
  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Return the stored token and additional admin details
  res.json({
    message: 'Sign-in successful',
    token: admin.token,
    firstname: admin.firstname,
    lastname: admin.lastname,
    subject: admin.subject,
    username: admin.username
  });
});

// Change Password Route
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Missing token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    const { subject } = decoded;

    const adminsData = getAdmins();

    // Find the admin by subject
    const admin = adminsData.admins.find(admin => admin.subject === subject);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the admins.json file
    admin.password = hashedNewPassword;
    saveAdmins(adminsData);

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error in change-password route:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Create Exam
router.post('/createExam', (req, res) => {
  const { title, date, subject, questions, id } = req.body;
  const token = req.headers.authorization.split(' ')[1]; // Extract token from header

  // Read current admin data from JSON
  const filePath = path.join(__dirname, '../admins.json');
  const adminsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Find the admin by token
  const admin = adminsData.admins.find(admin => admin.token === token);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  // Add exam data to the admin's exams
  const exam = { id, title, date, subject, questions };
  admin.exams.push(exam);

  // Write updated data back to JSON file
  fs.writeFileSync(filePath, JSON.stringify(adminsData, null, 2));

  res.status(201).json({ message: 'Exam created successfully' });
});

// Get Exams created by admin
router.get('/getExams', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Extract token from header

  // Read current admin data from JSON
  const filePath = path.join(__dirname, '../admins.json');
  const adminsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Find the admin by token
  const admin = adminsData.admins.find(admin => admin.token === token);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  // Return only the exams for the found admin
  if (admin.exams.length === 0) {
    res.json({ message: 'You have not created any exam.' });
  } else {
    res.json(admin.exams);
  }
});

module.exports = router;
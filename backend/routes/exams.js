// backend/routes/exams.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the exams JSON file
const examsFilePath = path.join(__dirname, '../exams.json');

// Helper function to read exams data from JSON file
const readExamsData = () => {
  const data = fs.readFileSync(examsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write exams data to JSON file
const writeExamsData = (data) => {
  fs.writeFileSync(examsFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Create a new exam route
router.post('/create', (req, res) => {
  const { examTitle, examDescription, questions } = req.body; // Accept examTitle from frontend

  const exams = readExamsData();
  const newExam = {
    id: exams.length + 1, // Create a new ID based on the current length
    title: examTitle, // Use examTitle here to match the backend model
    description: examDescription, // Store the description if needed
    questions,
  };
  exams.push(newExam);
  writeExamsData(exams);

  res.status(201).json({ message: 'Exam created successfully', exam: newExam });
});

// Get all exams route
router.get('/', (req, res) => {
  const exams = readExamsData();
  res.status(200).json(exams);
});

// Get a specific exam route
router.get('/:id', (req, res) => {
  const exams = readExamsData();
  const exam = exams.find((exam) => exam.id === parseInt(req.params.id));

  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  res.status(200).json(exam);
});

module.exports = router;

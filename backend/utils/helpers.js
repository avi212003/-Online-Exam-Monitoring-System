// backend/utils/helpers.js

const fs = require('fs');

// Function to read a JSON file and parse it
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file from disk: ${err}`);
    return [];
  }
};

// Function to write data to a JSON file
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing to file: ${err}`);
  }
};

module.exports = { readJSONFile, writeJSONFile };

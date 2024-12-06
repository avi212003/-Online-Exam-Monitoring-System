const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subject: { type: String, required: true },
  token: { type: String }
});

AdminSchema.pre('save', async function(next) {
  // Generate a unique token for the subject
  if (!this.token) {
    this.token = jwt.sign({ subject: this.subject }, process.env.SECRET_KEY);
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Admin', AdminSchema);

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  users: [String],
});

module.exports = mongoose.model('Room', roomSchema);

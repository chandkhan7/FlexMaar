const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  roomId: String,
  imageId: String,
  userId: String,
});

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;

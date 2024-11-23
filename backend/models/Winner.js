const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  winnerImageId: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Winner = mongoose.model('Winner', winnerSchema);

module.exports = Winner;

// utils/models/Room.js

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [String],  // Store the participant socket IDs
  images: [
    {
      id: String,
      votes: { type: Number, default: 0 },
    },
  ],
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

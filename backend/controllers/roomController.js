const Room = require('../models/Room');
const Vote = require('../models/Vote');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const roomId = generateRoomId();
    const newRoom = new Room({ roomId, images: [] });
    await newRoom.save();
    res.status(201).json({ roomId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room' });
  }
};

// Join a room
exports.joinRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error joining room' });
  }
};

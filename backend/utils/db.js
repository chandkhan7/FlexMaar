// utils/db.js
const mongoose = require('mongoose');

// Define the Room schema
const roomSchema = new mongoose.Schema({
  participants: [String],  // Store the socket IDs of participants
  images: [Object],        // Images in the room (if applicable)
});

// Create the Room model
const Room = mongoose.model('Room', roomSchema);

// Function to create a new room
const createRoom = async (roomId) => {
  const newRoom = new Room({
    participants: [],
    images: [],
  });

  try {
    await newRoom.save();  // Save the new room to the database
    return newRoom;  // Return the newly created room
  } catch (error) {
    throw new Error('Error creating room: ' + error.message);
  }
};

// Function to get a room by its ID
const getRoom = async (roomId) => {
  try {
    const room = await Room.findOne({ _id: roomId });  // Find room by ID
    return room;  // Return the room if found
  } catch (error) {
    throw new Error('Error fetching room: ' + error.message);
  }
};

// Function to add a participant (socket ID) to a room
const addParticipant = async (roomId, socketId) => {
  try {
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      throw new Error('Room not found');
    }

    // Add the participant's socket ID to the participants array
    room.participants.push(socketId);
    await room.save();  // Save the updated room

    return room;  // Return the updated room
  } catch (error) {
    throw new Error('Error adding participant: ' + error.message);
  }
};

// Export the functions
module.exports = {
  createRoom,
  getRoom,
  addParticipant,
};

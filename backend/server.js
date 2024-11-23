// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize express
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Set the port for the server
const PORT = process.env.PORT || 5000;

// Database connection
const dbURI = process.env.MONGODB_URI; // Add your MongoDB URI in .env file
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Voting Room Server');
});

// Sample model - Room
const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', RoomSchema);

// API to create a room
app.post('/create-room', async (req, res) => {
  try {
    const room = new Room({
      roomId: generateRoomId(), // Function to generate room ID
    });

    await room.save();
    res.status(201).json({ roomId: room.roomId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating room', error: err.message });
  }
});

// Function to generate a unique room ID (for simplicity, using random string)
function generateRoomId() {
  return Math.random().toString(36).substr(2, 9); // Random 9-character string
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

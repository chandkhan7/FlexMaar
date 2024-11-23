const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto'); // To generate random room IDs

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allows all origins
  },
});

// Function to generate a random room ID
const generateRoomId = () => {
  return crypto.randomBytes(4).toString('hex'); // Generates a random 8-character hex ID
};

// In-memory store to track rooms and their images
let rooms = {};

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle creating a room
  socket.on('create-room', () => {
    const roomId = generateRoomId(); // Generate a random room ID
    rooms[roomId] = { images: [] }; // Initialize the room with an empty image array
    io.emit('room-created', roomId); // Send the room ID to the client
    console.log(`Room created: ${roomId}`);
  });

  // Handle joining a room
  socket.on('join-room', (roomId) => {
    console.log(`User attempting to join room: ${roomId}`);
    
    // Verify if the room exists in the rooms object
    if (rooms[roomId]) {
      socket.join(roomId); // Join the room
      console.log(`User joined room: ${roomId}`);
      io.to(roomId).emit('vote-update', { images: rooms[roomId].images }); // Send initial images to the room
      socket.emit('room-joined', roomId); // Notify client they have successfully joined
    } else {
      socket.emit('room-error', 'Invalid Room ID');
    }
  });

  // Handle voting
  socket.on('vote', ({ roomId, winnerId }) => {
    const room = rooms[roomId];
    if (room) {
      const imageIndex = room.images.findIndex(image => image.id === winnerId);
      if (imageIndex !== -1) {
        room.images[imageIndex].votes += 1; // Update the vote count
        // Broadcast the updated images to all clients in the room
        io.to(roomId).emit('vote-update', { images: room.images });
        console.log(`Vote registered for image: ${winnerId}`);
      }
    }
  });

  // Optional: Handle leaving room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Listen on a port (default is 5000)
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

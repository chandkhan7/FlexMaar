const jwt = require('jsonwebtoken');
const Room = require('../models/Room');
const Vote = require('../models/Vote');

module.exports = (io, socket) => {
  // Create a room
  socket.on('create-room', async () => {
    const roomId = generateRoomId();
    try {
      const newRoom = new Room({ roomId, images: [] });
      await newRoom.save();
      socket.emit('room-created', roomId);
    } catch (error) {
      socket.emit('room-error', 'Room creation failed');
    }
  });

  // Join a room
  socket.on('join-room', async (roomId) => {
    try {
      const room = await Room.findOne({ roomId });
      if (room) {
        socket.join(roomId);
        socket.emit('room-joined', room);
      } else {
        socket.emit('room-error', 'Room not found');
      }
    } catch (error) {
      socket.emit('room-error', 'Error joining room');
    }
  });

  // Vote for an image
  socket.on('vote', async ({ roomId, winnerId, token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      const room = await Room.findOne({ roomId });
      if (!room) {
        return socket.emit('vote-error', 'Room not found');
      }

      const imageIndex = room.images.findIndex(img => img.id === winnerId);
      if (imageIndex === -1) {
        return socket.emit('vote-error', 'Image not found');
      }

      // Increment vote count for the winner
      room.images[imageIndex].votes += 1;
      await room.save();

      // Save the vote
      const newVote = new Vote({ roomId, imageId: winnerId, userId });
      await newVote.save();

      io.to(roomId).emit('update-room', room);
    } catch (error) {
      socket.emit('vote-error', 'Error casting vote');
    }
  });
};

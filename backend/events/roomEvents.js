const { v4: uuidv4 } = require('uuid'); // For unique Room IDs

// In-memory storage for rooms
const rooms = {}; // { roomId: { images: [], votes: {}, participants: [] } }

module.exports = function roomEvents(io, socket) {
  // Create a new room
  socket.on('create-room', () => {
    const roomId = uuidv4(); // Generate a unique ID for the room
    rooms[roomId] = { images: [], votes: {}, participants: [] }; // Initialize room data
    socket.join(roomId); // Add the socket to the room
    rooms[roomId].participants.push(socket.id); // Add user to the participants list
    socket.emit('room-created', roomId); // Notify client about the room creation
    console.log(`Room created: ${roomId}`);
  });

  // Join an existing room
  socket.on('join-room', (roomId) => {
    if (rooms[roomId]) {
      socket.join(roomId); // Add the socket to the room
      rooms[roomId].participants.push(socket.id); // Track the participant
      socket.emit('room-joined', { 
        roomId, 
        images: rooms[roomId].images 
      }); // Send room data to the client
      io.to(roomId).emit('participants-update', rooms[roomId].participants); // Notify all participants of the updated list
      console.log(`User ${socket.id} joined room: ${roomId}`);
    } else {
      socket.emit('error', 'Room does not exist!');
    }
  });

  // Add images to the room
  socket.on('add-images', ({ roomId, images }) => {
    if (rooms[roomId]) {
      // Ensure valid data
      if (!Array.isArray(images) || images.length === 0) {
        socket.emit('error', 'Invalid images data!');
        return;
      }
      rooms[roomId].images.push(...images); // Add images to the room
      io.to(roomId).emit('update-images', { images: rooms[roomId].images }); // Notify all participants
      console.log(`Images added to room ${roomId}: ${images}`);
    } else {
      socket.emit('error', 'Room does not exist!');
    }
  });

  // Handle voting
  socket.on('vote', ({ roomId, winnerId }) => {
    if (rooms[roomId]) {
      // Increment vote count for the winner
      rooms[roomId].votes[winnerId] = (rooms[roomId].votes[winnerId] || 0) + 1;
      io.to(roomId).emit('vote-update', { 
        votes: rooms[roomId].votes 
      }); // Notify all participants
      console.log(`Vote registered for ${winnerId} in room ${roomId}`);
    } else {
      socket.emit('error', 'Room does not exist!');
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    for (const [roomId, room] of Object.entries(rooms)) {
      const index = room.participants.indexOf(socket.id);
      if (index > -1) {
        room.participants.splice(index, 1); // Remove user from participants
        io.to(roomId).emit('participants-update', room.participants); // Notify participants of the updated list
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
        // Clean up the room if no participants are left
        if (room.participants.length === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} deleted (no participants left).`);
        }
        break;
      }
    }
  });
};

const { v4: uuidv4 } = require('uuid'); // For unique Room IDs

const rooms = {}; // In-memory room storage

module.exports = function roomEvents(socket, io) {
  // Create a new room
  socket.on('create-room', () => {
    const roomId = uuidv4(); // Generate a unique ID for the room
    rooms[roomId] = { images: [], votes: {} }; // Initialize room data
    socket.join(roomId); // Add socket to the room
    socket.emit('room-created', roomId); // Notify client about the room creation
    console.log(`Room created: ${roomId}`);
  });

  // Join an existing room
  socket.on('join-room', (roomId) => {
    if (rooms[roomId]) {
      socket.join(roomId); // Add socket to the room
      socket.emit('room-joined', { roomId, images: rooms[roomId].images }); // Send room data
      console.log(`User joined room: ${roomId}`);
    } else {
      socket.emit('error', 'Room does not exist!');
    }
  });

  // Add images to the room
  socket.on('add-images', ({ roomId, images }) => {
    if (rooms[roomId]) {
      rooms[roomId].images.push(...images); // Add images to the room
      io.to(roomId).emit('update-images', { images: rooms[roomId].images }); // Notify everyone in the room
      console.log(`Images added to room ${roomId}`);
    } else {
      socket.emit('error', 'Room does not exist!');
    }
  });

  // Handle voting
  socket.on('vote', ({ roomId, winnerId }) => {
    if (rooms[roomId]) {
      rooms[roomId].votes[winnerId] = (rooms[roomId].votes[winnerId] || 0) + 1; // Increment vote count
      io.to(roomId).emit('vote-update', {
        images: rooms[roomId].images,
        votes: rooms[roomId].votes,
      }); // Notify everyone in the room
      console.log(`Vote registered for ${winnerId} in room ${roomId}`);
    } else {
      socket.emit('error', 'Room does not exist!');
    }
  });
};

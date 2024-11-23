const io = require('socket.io')(server);
const rooms = {};  // Store rooms data

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    // Send room data to the client (images and voting info)
    socket.emit('roomData', rooms[roomId]);
  });

  socket.on('submitVote', ({ roomId, imageId }) => {
    // Handle voting logic and store votes
    const room = rooms[roomId];
    if (room) {
      const image = room.images.find((img) => img.id === imageId);
      image.votes += 1;
      io.to(roomId).emit('roomData', room);  // Broadcast updated room data
    }
  });

  socket.on('newImageUploaded', ({ roomId, image }) => {
    // Add uploaded image to the room
    rooms[roomId].images.push(image);
    io.to(roomId).emit('roomData', rooms[roomId]);  // Broadcast updated room data
  });

  socket.on('leaveRoom', ({ roomId }) => {
    socket.leave(roomId);
  });
});

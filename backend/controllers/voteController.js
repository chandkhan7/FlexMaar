const jwt = require('jsonwebtoken');

// Inside the vote event handler, decode the JWT to extract userId
socket.on('vote', async ({ roomId, winnerId, token }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    const userId = decoded.userId; // Extract the userId from the decoded token
    
    // Proceed with the vote logic
    const room = await Room.findOne({ roomId });
    if (room) {
      const imageIndex = room.images.findIndex(image => image.id === winnerId);
      if (imageIndex !== -1) {
        room.images[imageIndex].votes += 1;
        await room.save();

        const newVote = new Vote({ roomId, imageId: winnerId, userId });
        await newVote.save();

        io.to(roomId).emit('vote-update', { images: room.images });
        console.log(`Vote registered for image: ${winnerId} by user: ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error registering vote:', error);
    socket.emit('vote-error', 'Invalid token or user not found');
  }
});

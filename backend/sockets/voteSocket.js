const handleSocketConnections = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle voting logic
    socket.on('vote', async ({ roomId, winnerId, userId }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (room) {
          const imageIndex = room.images.findIndex((image) => image.id === winnerId);
          if (imageIndex !== -1) {
            room.images[imageIndex].votes += 1;
            await room.save();

            const existingVote = await Vote.findOne({ roomId, userId, imageId: winnerId });
            if (!existingVote) {
              const newVote = new Vote({ roomId, userId, imageId: winnerId });
              await newVote.save();
            }

            io.to(roomId).emit('vote-update', { images: room.images });
            console.log(`Vote registered for image: ${winnerId}`);
          }
        }
      } catch (error) {
        console.error('Error registering vote:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = handleSocketConnections;

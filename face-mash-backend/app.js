const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const roomRoutes = require('./routes/roomRoutes');
const roomEvents = require('./events/roomEvents');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  roomEvents(io, socket);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

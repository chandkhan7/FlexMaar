const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload/:roomId', upload.single('image'), (req, res) => {
  const roomId = req.params.roomId;
  const file = req.file;

  // Save image info (in production, you may store it in a database)
  const image = {
    id: Date.now(),
    url: `/uploads/${file.filename}`, // Assuming images are publicly accessible
    name: file.originalname,
    votes: 0,
  };

  // Here, you would push the image to the room's image array (in memory or DB)
  if (!rooms[roomId]) rooms[roomId] = { images: [] };
  rooms[roomId].images.push(image);

  res.json(image); // Return the uploaded image info
});

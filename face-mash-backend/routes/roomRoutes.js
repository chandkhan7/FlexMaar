const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

router.post('/create', async (req, res) => {
  const { name } = req.body;
  const newRoom = new Room({ name, users: [] });
  await newRoom.save();
  res.status(201).json(newRoom);
});

module.exports = router;

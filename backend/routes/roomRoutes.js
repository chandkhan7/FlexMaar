const express = require('express');
const router = express.Router();
const { createRoom, joinRoom } = require('../controllers/roomController');

router.post('/create', createRoom);
router.get('/:roomId', joinRoom);

module.exports = router;

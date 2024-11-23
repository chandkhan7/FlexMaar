const generateRoomId = () => {
  return 'room-' + Math.random().toString(36).substr(2, 9);
};

module.exports = generateRoomId;

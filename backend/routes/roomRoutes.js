const express = require("express");
const Room = require("../models/Room");

const router = express.Router();

// Generate a unique room ID
const generateUniqueRoomId = async () => {
  let isUnique = false;
  let roomId;

  while (!isUnique) {
    // Generate a random room ID (8 characters)
    roomId = Math.random().toString(36).substring(2, 10);
    
    // Check if this room ID already exists
    const existingRoom = await Room.findOne({ roomId });
    if (!existingRoom) {
      isUnique = true;
    }
  }
  
  return roomId;
};

// Create a room
router.post("/create", async (req, res) => {
  const { type, youtubeUrl } = req.body;

  try {
    // Generate a unique room ID
    const roomId = await generateUniqueRoomId();

    const newRoom = new Room({ 
      roomId,
      type,
      youtubeUrl,
      users: [],
      createdAt: new Date(),
      active: true
    });
    
    await newRoom.save();
    res.json({ success: true, room: newRoom });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Join a room
router.get("/join/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    // Check if room exists
    const room = await Room.findOne({ roomId, active: true });
    
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        error: "Room not found or no longer active" 
      });
    }

    res.json({ 
      success: true, 
      room: room 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// List all rooms
// router.get("/", async (req, res) => {
//   const rooms = await Room.find();
//   res.json(rooms);
// });

module.exports = router;

const express = require("express");
const Room = require("../models/Room");

const router = express.Router();

// Create a room
router.post("/create", async (req, res) => {
  const { roomId } = req.body;

  try {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) return res.status(400).json({ error: "Room already exists" });

    const newRoom = new Room({ roomId, users: [] });
    await newRoom.save();
    res.json({ success: true, room: newRoom });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// List all rooms
// router.get("/", async (req, res) => {
//   const rooms = await Room.find();
//   res.json(rooms);
// });

module.exports = router;

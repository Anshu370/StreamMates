const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true, required: true },
  users: [String],
});

module.exports = mongoose.model("Room", RoomSchema);

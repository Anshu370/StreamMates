const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['video', 'youtube'],
    required: true
  },
  youtubeUrl: {
    type: String,
    required: function() { return this.type === 'youtube'; }
  },
  users: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Room", roomSchema);

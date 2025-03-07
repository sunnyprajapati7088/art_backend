const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Gmail
  phone: { type: String, required: true, unique: true }, // Phone Number
  password: { type: String, required: true },
  bio: { type: String },
  profileImage: { type: String }, // Artist's profile picture
  address: {
    street: { type: String },
    state: { type: String, required: true },
    pin: { type: String, required: true },
    country: { type: String, required: true }
  },
  deleteStatus: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, // Gmail
  phone: { type: String, required: true, unique: true }, // Phone Number
  password: { type: String, required: true },
  profileImage: { type: String }, // Optional profile picture
  address: {
    street: { type: String },
    state: { type: String, required: true },
    pin: { type: String, required: true },
    country: { type: String, required: true }
  },
  deleteStatus: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const User = mongoose.model("User", userSchema);
module.exports = User;

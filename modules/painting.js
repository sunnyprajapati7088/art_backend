const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true },
  imageURLs: [{ type: String, required: true }], // Array to store multiple image URLs
  price: { type: Number, required: true }, 
  discount: { type: Number, default: 0 }, 
  finalPrice: { type: Number }, 
  seasonOrFestival: { 
    type: String, 
    enum: ["Summer", "Winter", "Spring", "Autumn", "Holi", "Diwali", "Navratri", "Christmas", "Eid", "Pongal", "Other"], 
    required: true 
  },
    rating: { type: Number, default: 0 }, 
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true }, 
  deleteStatus: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true });

// Auto-calculate final price after discount
paintingSchema.pre("save", function(next) {
  this.finalPrice = this.price - (this.price * (this.discount / 100));
  next();
});

const Painting = mongoose.model("Painting", paintingSchema);
module.exports = Painting;

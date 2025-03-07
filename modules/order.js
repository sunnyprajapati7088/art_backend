const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Buyer ID
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true }, // Seller (Artist) ID
    paintings: [
      {
        paintingId: { type: mongoose.Schema.Types.ObjectId, ref: "Painting", required: true },
        title: { type: String, required: true }, 
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        finalPrice: { type: Number, required: true },
        quantity: { type: Number, default: 1, required: true }
      }
    ],
    totalAmount: { type: Number, required: true }, // Total amount after discounts
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    paymentMethod: { type: String, enum: ["COD", "Online"], required: true }, // Cash on Delivery or Online
    transactionId: { type: String, default: null }, // Stores Razorpay/Stripe transaction ID
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
    deliveryDate: { type: Date },
    cancelReason: { type: String, default: null }, // Reason for cancellation (if applicable)
    deleteStatus: { type: Boolean, default: false } // Soft delete flag
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

const Order = require("../modules/order");
const Painting = require("../modules/painting");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, artistId, paintings, paymentMethod, shippingAddress } = req.body;

    if (!userId || !artistId || !paintings || paintings.length === 0 || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    let totalAmount = 0;
    const processedPaintings = [];

    for (const item of paintings) {
      const painting = await Painting.findById(item.paintingId);
      if (!painting) return res.status(404).json({ message: `Painting not found: ${item.paintingId}` });

      const finalPrice = painting.price - (painting.price * (painting.discount / 100));
      totalAmount += finalPrice * item.quantity;

      processedPaintings.push({
        paintingId: painting._id,
        title: painting.title,
        price: painting.price,
        discount: painting.discount,
        finalPrice,
        quantity: item.quantity
      });
    }

    const newOrder = new Order({
      userId,
      artistId,
      paintings: processedPaintings,
      totalAmount,
      paymentMethod,
      shippingAddress
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email").populate("artistId", "name");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get orders by user (Buyer)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("paintings.paintingId", "title imageURLs");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get orders by artist (Seller)
exports.getArtistOrders = async (req, res) => {
  try {
    const { artistId } = req.params;
    const orders = await Order.find({ artistId }).populate("userId", "name email");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching artist orders:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Update order status (Admin or Seller)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;
    if (orderStatus === "Delivered") order.deliveryDate = new Date();

    await order.save();
    res.status(200).json({ message: "Order status updated", order });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Cancel order (Buyer)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be canceled" });
    }

    order.orderStatus = "Cancelled";
    order.cancelReason = cancelReason;
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });

  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Soft delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deleteStatus = true;
    await order.save();

    res.status(200).json({ message: "Order deleted successfully" });

  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

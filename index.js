const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoute")
const artistsRoutes=require('./routes/artistRoutes')
const paintingRoutes=require('./routes/paintingRoutes')
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;


// Middleware
app.use(express.json());

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/artists", artistsRoutes);
app.use("/api/paintings", paintingRoutes);
// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

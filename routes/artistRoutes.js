const express = require("express");
const {
  registerArtist,
  loginArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist
} = require("../controllers/artistController");

const router = express.Router();

// Public Routes
router.post("/register", registerArtist); // Only Admin should call this
router.post("/login", loginArtist);

// Protected Routes (Later add authentication middleware)
router.get("/", getAllArtists);
router.get("/:id", getArtistById);
router.put("/:id", updateArtist);
router.delete("/:id", deleteArtist);

module.exports = router;

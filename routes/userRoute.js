const express = require("express");
const { registerUser, loginUser, getUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Get User Details
router.get("/:id", getUser);

// Update User
router.put("/:id", updateUser);

// Delete User (Soft Delete)
router.delete("/:id", deleteUser);

module.exports = router;

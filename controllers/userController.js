const User = require("../modules/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (Only 10 digits)
const phoneRegex = /^[0-9]{10}$/;

exports.registerUser = async (req, res) => {
  console.log("Register User Request Received");

  try {
    const { name, email, phone, password, address } = req.body;

    // Validate Email Format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate Phone Format (Only 10 digits)
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Phone already exists" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    // Create New User
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login User
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find User
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Compare Password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//     // Generate JWT Token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.json({ message: "Login successful", token, user });

//   } catch (error) {
//     res.status(500).json({ message: "Login error", error });
//   }
// };


exports.loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Check if user exists (by email or phone)
    const user = await User.findOne({ 
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};


// Get User by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, updatedAt: Date.now() },
      { new: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Soft Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { deleteStatus: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted (soft delete)" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Restore Soft Deleted User
exports.restoreUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { deleteStatus: false });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User restored" });

  } catch (error) {
    res.status(500).json({ message: "Error restoring user", error });
  }
};

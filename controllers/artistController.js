const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Artist = require("../modules/artist");

// 📌 Register Artist (Only Admin can create artists)

exports.registerArtist = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, phone, password, bio, address } = req.body;

    // ✅ Validate Email Format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Validate Phone Number Format (10 digits, Indian Numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number. It should be 10 digits and start with 6-9." });
    }

    // Check if artist already exists
    const existingArtist = await Artist.findOne({ $or: [{ email }, { phone }] });
    if (existingArtist) {
      return res.status(400).json({ message: "Email or Phone already exists" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    // Create Artist
    const newArtist = new Artist({
      name,
      email,
      phone,
      password: hashedPassword,
      bio,
      address,
    });

    await newArtist.save();
    res.status(201).json({ message: "Artist registered successfully" });

  } catch (error) {
    console.error("Register Artist Error:", error);
    res.status(500).json({ message: "Error registering artist", error });
  }
};


// 📌 Artist Login
exports.loginArtist = async (req, res) => {
  try {
    console.log(req.body)
    const { emailOrPhone, password } = req.body;

    // Check if artist exists (by email or phone)
    const artist = await Artist.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!artist) {
      return res.status(400).json({ message: "Artist not found" });
    }

    // Validate Password
    const isPasswordValid = await bcrypt.compare(password, artist.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {  email: artist.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({
      message: "Login successful",
      token,
      artist: {
        name: artist.name,
        email: artist.email,
        phone: artist.phone,
        bio: artist.bio,
        address: artist.address,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// 📌 Get All Artists
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find({ deleteStatus: false }).select("-password");
    res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Error fetching artists", error });
  }
};

// 📌 Get Artist by ID
exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).select("-password");
    if (!artist || artist.deleteStatus) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).json({ message: "Error fetching artist", error });
  }
};

// 📌 Update Artist Profile
exports.updateArtist = async (req, res) => {
  try {
    const { name, bio, address, phone, email } = req.body;
    const artistId = req.params.id;

    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      { name, bio, address, phone, email, updatedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!updatedArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json({ message: "Artist updated successfully", artist: updatedArtist });

  } catch (error) {
    console.error("Error updating artist:", error);
    res.status(500).json({ message: "Error updating artist", error });
  }
};

// 📌 Soft Delete Artist
exports.deleteArtist = async (req, res) => {
  try {
    const artistId = req.params.id;

    const deletedArtist = await Artist.findByIdAndUpdate(
      artistId,
      { deleteStatus: true },
      { new: true }
    );

    if (!deletedArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json({ message: "Artist deleted successfully" });

  } catch (error) {
    console.error("Error deleting artist:", error);
    res.status(500).json({ message: "Error deleting artist", error });
  }
};

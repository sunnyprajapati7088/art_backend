const Painting = require("../modules/painting");

// ✅ Add a New Painting
 // Import the Painting model

exports.addPainting = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      imageURLs, 
      category,
      theme, 
      price, 
      discount, 
      seasonOrFestival, 
      dimensions, 
      materials, 
      stock, 
      artistId 
    } = req.body;

    // Validate required fields
    if (!title || !description || !imageURLs || imageURLs.length === 0 || !price || !seasonOrFestival || !artistId) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newPainting = new Painting({
      title,
      description,
      imageURLs, // Array of image URLs
      category,
      theme: theme || "General", // Default theme
      price,
      discount: discount || 0,
      seasonOrFestival,
      dimensions: dimensions || { width: 0, height: 0 }, // Default if not provided
      materials: materials || [], // Default empty array
      stock: stock || 1, // Default stock is 1
      artistId
    });

    await newPainting.save();
    res.status(201).json({ message: "Painting added successfully", painting: newPainting });

  } catch (error) {
    console.error("Error adding painting:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Get All Paintings
exports.getAllPaintings = async (req, res) => {
  try {
    const paintings = await Painting.find({ deleteStatus: false }).populate("artistId", "name email");
    res.status(200).json(paintings);
  } catch (error) {
    console.error("Error fetching paintings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Single Painting by ID
exports.getPaintingById = async (req, res) => {
  try {
    const { id } = req.params;
    const painting = await Painting.findById(id).populate("artistId", "name email");

    if (!painting || painting.deleteStatus) {
      return res.status(404).json({ message: "Painting not found" });
    }

    res.status(200).json(painting);
  } catch (error) {
    console.error("Error fetching painting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Painting (Only Admin or Artist)
exports.updatePainting = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPainting = await Painting.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedPainting) {
      return res.status(404).json({ message: "Painting not found" });
    }

    res.status(200).json({ message: "Painting updated successfully", painting: updatedPainting });
  } catch (error) {
    console.error("Error updating painting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete Painting (Soft Delete)
exports.deletePainting = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPainting = await Painting.findByIdAndUpdate(id, { deleteStatus: true }, { new: true });

    if (!deletedPainting) {
      return res.status(404).json({ message: "Painting not found" });
    }

    res.status(200).json({ message: "Painting deleted successfully" });
  } catch (error) {
    console.error("Error deleting painting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

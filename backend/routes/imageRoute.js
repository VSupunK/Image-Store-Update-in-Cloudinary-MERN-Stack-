// const express = require("express");
// const Image = require("../models/imageModel"); // Assuming you have an Image model defined in imageModel.js

// const router = express.Router();

// // GET all images stored in MongoDB
// router.get("/", async (req, res) => {
//   try {
//     const image = await Image.find();
//     res.status(200).json(image);
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving images" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // ✅ use user model, not imageModel
const cloudinary = require("cloudinary").v2;

// Fetch image data from all users
router.get("/", async (req, res) => {
  try {
    const usersWithImages = await User.find({ "image.url": { $exists: true } }); // filter users with images
    res.status(200).json(usersWithImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images from users" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.image || !user.image.publicId) {
      return res.status(404).json({ error: "User or image not found" });
    }

    await cloudinary.uploader.destroy(user.image.publicId);
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;

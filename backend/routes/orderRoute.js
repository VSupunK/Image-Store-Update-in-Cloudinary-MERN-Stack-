// const express = require("express");
// const router = express.Router();
// const OrderRequest = require("../models/orderRequest");
// const cloudinary = require("cloudinary").v2;

// // Create a new order request
// router.post("/", async (req, res) => {
//   try {
//     const {
//       itemName,
//       projectName,
//       description,
//       link,
//       dueDate,
//       priority,
//       images,
//     } = req.body;
//     const newOrder = new OrderRequest({
//       itemName,
//       projectName,
//       description,
//       link,
//       dueDate,
//       priority,
//       images: images.slice(0, 3), // store up to 3 images
//     });
//     await newOrder.save();
//     res.status(201).json(newOrder);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create order request" });
//   }
// });

const express = require("express");
const router = express.Router();
const OrderRequest = require("../models/orderRequest");
const cloudinary = require("cloudinary").v2;
const upload = require("../middleware/multer"); // ✅ imported as 'upload'

router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { itemName, projectName, description, link, dueDate, priority } =
      req.body;
    const uploadedImages = [];

    for (const file of req.files) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "order-images",
      });

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    const newOrder = new OrderRequest({
      itemName,
      projectName,
      description,
      link,
      dueDate,
      priority,
      images: uploadedImages,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Failed to create order with images" });
  }
});

module.exports = router;

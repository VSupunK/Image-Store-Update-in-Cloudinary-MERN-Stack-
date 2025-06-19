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
      userId: req.body.userId,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Failed to create order with images" });
  }
});

// Get all orders for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await OrderRequest.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

//PUT Request to Edit
router.put("/:id", upload.array("images", 3), async (req, res) => {
  try {
    const order = await OrderRequest.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "pending")
      return res.status(403).json({ error: "Can't modify after confirmation" });

    // Delete old images from Cloudinary
    for (const img of order.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    // Upload new images
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

    // Update order
    order.itemName = req.body.itemName;
    order.projectName = req.body.projectName;
    order.description = req.body.description;
    order.link = req.body.link;
    order.dueDate = req.body.dueDate;
    order.priority = req.body.priority;
    order.images = uploadedImages;

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const order = await OrderRequest.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Delete images from Cloudinary
    for (const img of order.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await OrderRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;

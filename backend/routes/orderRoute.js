const express = require("express");
const router = express.Router();
const OrderRequest = require("../models/orderRequest");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
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

    console.log("Received userId:", req.body.userId);

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

    const removeIds = req.body.remove || []; // array of publicIds to delete
    const retainedImages = order.images.filter(
      (img) => !removeIds.includes(img.publicId)
    );

    // Delete images that were marked for removal
    for (const img of order.images) {
      if (removeIds.includes(img.publicId)) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    // Upload new images (if any)
    const newUploadedImages = [];
    for (const file of req.files) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "order-images",
      });

      newUploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    // ✅ Combine retained + newly uploaded
    order.images = [...retainedImages, ...newUploadedImages];

    // Update other fields
    order.itemName = req.body.itemName;
    order.projectName = req.body.projectName;
    order.description = req.body.description;
    order.link = req.body.link;
    order.dueDate = req.body.dueDate;
    order.priority = req.body.priority;

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

router.get("/single/:id", async (req, res) => {
  const { id } = req.params;

  // Optional: Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const order = await OrderRequest.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    console.error("Failed to fetch order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
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

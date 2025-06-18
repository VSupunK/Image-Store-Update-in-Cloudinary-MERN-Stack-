const express = require("express");
const router = express.Router();
const OrderRequest = require("../models/orderRequest");
const cloudinary = require("cloudinary").v2;

// Create a new order request
router.post("/", async (req, res) => {
  try {
    const {
      itemName,
      projectName,
      description,
      link,
      dueDate,
      priority,
      images,
    } = req.body;
    const newOrder = new OrderRequest({
      itemName,
      projectName,
      description,
      link,
      dueDate,
      priority,
      images: images.slice(0, 3), // store up to 3 images
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order request" });
  }
});

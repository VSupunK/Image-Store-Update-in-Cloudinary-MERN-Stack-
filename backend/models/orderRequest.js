const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
});

const orderRequestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  projectName: { type: String, required: true },
  description: String,
  link: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ["low", "medium", "urgent"],
    default: "medium",
  },
  images: [imageSchema],
  status: {
    type: String,
    enum: ["pending", "confirmed", "approved", "rejected"],
    default: "pending",
  },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrderRequest", orderRequestSchema);

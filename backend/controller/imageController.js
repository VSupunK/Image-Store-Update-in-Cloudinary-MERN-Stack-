const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;

// Delete image from Cloudinary and MongoDB

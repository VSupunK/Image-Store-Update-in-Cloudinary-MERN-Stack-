const multer = require("multer");
const path = require("path");

// Accept only image files
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".webp") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type"), false); // Reject the file
  }
};

module.exports = multer({ storage, fileFilter });
// This middleware will handle file uploads, storing them in memory and filtering by image type.

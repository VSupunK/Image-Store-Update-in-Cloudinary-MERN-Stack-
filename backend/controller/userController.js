// const User = require("../models/userModel");
// const { uploadToCloudinary } = require("../services/cloudinary");

// const createUser = async (req, res) => {
//   const { name, username, image } = req.body;

//   if (!name || !username) {
//     return res.status(400).json({ error: "Name and username are required." });
//   }

//   try {
//     let imageData = {};
//     if (image) {
//       const results = await uploadToCloudinary(image, "my-images");

//       if (!results || !results.url) {
//         return res.status(400).json({ error: "Image upload failed." });
//       }

//       imageData = results;
//     }
//     console.log("Received image base64 (truncated):", image?.substring(0, 100));

//     const user = await User.create({
//       name,
//       username,
//       image: results.url,
//     });

//     res.status(200).json(user);
//   } catch (e) {
//     console.error("Error in createUser:", e);
//     res
//       .status(500)
//       .json({ error: "A server error occurred with this request..." });
//   }
// };

// module.exports = { createUser };

// backend/controller/userController.js

const User = require("../models/userModel");
const { uploadToCloudinary } = require("../services/cloudinary");

const createUser = async (req, res) => {
  const { name, username, image } = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: "Name and username are required." });
  }

  try {
    let imageData = {};

    if (image) {
      // debug: make sure this is a data URI
      console.log("Received image base64 (truncated):", image.substring(0, 50));

      const uploadResult = await uploadToCloudinary(image, "my-images");
      console.log("Cloudinary upload returned:", uploadResult);

      // The service returns { url, publicId }
      if (!uploadResult || !uploadResult.url) {
        return res.status(400).json({ error: "Image upload failed." });
      }

      imageData = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    const user = await User.create({
      name,
      username,
      image: imageData,
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error("Error in createUser:", err);
    return res
      .status(500)
      .json({ error: "A server error occurred with this request..." });
  }
};

module.exports = { createUser };

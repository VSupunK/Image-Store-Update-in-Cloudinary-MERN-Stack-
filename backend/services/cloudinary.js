// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// const uploadToCloudinary = async (path, folder = "my-images") => {
//   try {
//     const data = await cloudinary.uploader.upload(path, { folder: folder });
//     return { url: data.secure_url, plublicId: data.public_id };
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

// module.exports = { uploadToCloudinary };

// --------------------------------------

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// const uploadToCloudinary = async (base64, folder = "my-images") => {
//   try {
//     const data = await cloudinary.uploader.upload(base64, { folder });
//     return { url: data.secure_url, publicId: data.public_id };
//   } catch (err) {
//     console.error("Cloudinary upload error:", err.message || err);
//     throw new Error("Image upload failed.");
//   }
// };

const uploadToCloudinary = async (base64, folder = "my-images") => {
  try {
    console.log("Uploading to Cloudinary...");
    const data = await cloudinary.uploader.upload(base64, { folder });
    console.log("Cloudinary upload success:", data);
    return { url: data.secure_url, publicId: data.public_id };
  } catch (err) {
    console.error("Cloudinary upload error:", err.message || err);
    throw new Error("Image upload failed.");
  }
};

module.exports = { uploadToCloudinary };

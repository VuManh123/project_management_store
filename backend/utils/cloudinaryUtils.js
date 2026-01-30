const cloudinary = require("cloudinary").v2;
const { config } = require("configs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder (e.g. 'avatars')
 * @param {string} publicId - Optional public id for the image
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadFromBuffer = (buffer, folder = "avatars", publicId = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: "image",
    };
    if (publicId) {
      options.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary by public_id
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise}
 */
const deleteImage = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

module.exports = {
  uploadFromBuffer,
  deleteImage,
};

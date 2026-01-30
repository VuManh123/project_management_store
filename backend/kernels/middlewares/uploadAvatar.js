const multer = require("multer");

// Store file in memory for Cloudinary upload
const storage = multer.memoryStorage();

// File filter: only allow image types
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF and WebP are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

/**
 * Middleware: only use multer when Content-Type is multipart/form-data.
 * This allows the same route to accept both JSON (name, email) and multipart (name, email, avatar file).
 */
const uploadAvatar = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return upload.single("avatar")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 5MB.",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || "Upload error",
        });
      }
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Invalid file",
        });
      }
      next();
    });
  }
  next();
};

module.exports = uploadAvatar;

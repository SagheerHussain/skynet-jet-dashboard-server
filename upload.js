// upload.js
const multer = require("multer");
const os = require("os");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const mediaFilter = (req, file, cb) => {
  const ok =
    file.mimetype &&
    (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/"));
  if (ok) cb(null, true);
  else cb(new Error("Only image or video files are allowed"));
};

// Increase size (e.g., 200MB). Adjust per your needs & server limits.
module.exports = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 200 * 1024 * 1024, files: 100 },
});

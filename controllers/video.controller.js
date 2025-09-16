// video.controller.js
const Video = require("../models/Video.model");
const cloudinary = require("../config/cloudinary");

/* GET */
const getVideosLists = async (req, res) => {
  try {
    const videos = await Video.find().lean();
    if (!videos.length) {
      return res.status(200).json({ message: "No videos found", success: false });
    }
    return res.status(200).json({ message: "Videos found", success: true, data: videos });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getVideosById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);  // simpler
    if (!video) return res.status(404).json({ message: "Video not found", success: false });
    return res.status(200).json({ message: "Video found", success: true, data: video });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* POST */
const createVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded", success: false });

    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos",
    });

    const video = await Video.create({ src: uploadResponse.secure_url });
    return res.status(201).json({ message: "Video created", success: true, data: video });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* PUT */
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Video.findById(id);
    if (!existing) return res.status(404).json({ message: "Video not found", success: false });

    let newUrl = existing.src;
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "videos",
      });
      newUrl = uploadResponse.secure_url;
    }

    const updated = await Video.findByIdAndUpdate(
      id,
      { src: newUrl },
      { new: true }
    );
    return res.status(200).json({ message: "Video updated", success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* DELETE */
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) return res.status(404).json({ message: "Video not found", success: false });
    // Optional: also delete from Cloudinary (need to store public_id for that)
    return res.status(200).json({ message: "Video deleted", success: true, data: video });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const bulkDeleteVideos = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "ids array is required", success: false });
    }
    const result = await Video.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ message: "Videos deleted", success: true, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getVideosLists,
  getVideosById,
  createVideo,
  updateVideo,
  deleteVideo,
  bulkDeleteVideos,
};

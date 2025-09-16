const express = require("express");
const router = express.Router();
const upload = require("../upload");

const { 
    getVideosLists,
    getVideosById,
    createVideo,
    updateVideo,
    deleteVideo,
    bulkDeleteVideos 
} = require("../controllers/video.controller")

/* ------------------- GET ---------------------- */
router.get("/lists", getVideosLists);
router.get("/lists/:id", getVideosById);

/* ------------------- POST ---------------------- */
router.post("/", upload.single("src"), createVideo);

/* ------------------- PUT ---------------------- */
router.put("/update/:id", upload.single("src"), updateVideo);

/* ------------------- DELETE ---------------------- */
router.delete("/delete/:id", deleteVideo);
router.delete("/bulkDelete", bulkDeleteVideos);

module.exports = router;
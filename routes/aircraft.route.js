// routes/aircraft.route.js
const express = require("express");
const router = express.Router();

const {
  getAircraftsLists,
  getLatestAircrafts,
  getAircraftById,
  getAircraftsByFilters,
  createAircraft,
  updateAircraft,
  deleteAircraft,
  bulkDeleteAircraft,
} = require("../controllers/aircraft.controller");
const uploadImages = require("../upload");

// GET
router.get("/lists", getAircraftsLists);
router.get("/lists/latest", getLatestAircrafts);
router.get("/lists/:id", getAircraftById);
router.get("/lists/filters", getAircraftsByFilters);

// POST  ✅ accept both "images" (multiple) and "featuredImage" (single)
router.post(
  "/",
  uploadImages.fields([
    { name: "images", maxCount: 20 },
    { name: "featuredImage", maxCount: 1 },
  ]),
  createAircraft
);

// PUT  ✅ same here
router.put(
  "/update/:id",
  uploadImages.fields([
    { name: "images", maxCount: 20 },
    { name: "featuredImage", maxCount: 1 },
  ]),
  updateAircraft
);

// DELETE
router.delete("/delete/:id", deleteAircraft);

// Bulk Delete
router.delete("/bulkDelete", bulkDeleteAircraft);

module.exports = router;

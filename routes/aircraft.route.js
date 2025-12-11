// routes/aircraft.route.js
const express = require("express");
const router = express.Router();

const {
  getAircraftsLists,
  getAircraftListsByAdmin,
  getJetRanges,
  getAircraftsBySearch,
  getLatestAircrafts,
  getAircraftById,
  getAircraftsByFilters,
  getRelatedAircrafts,
  createAircraft,
  updateAircraft,
  deleteAircraft,
  bulkDeleteAircraft,
} = require("../controllers/aircraft.controller");
const uploadImages = require("../upload");

// GET
router.get("/lists", getAircraftsLists);
router.get("/lists/admin", getAircraftListsByAdmin);
router.get("/lists/ranges", getJetRanges);
router.get("/lists/search", getAircraftsBySearch);
router.get("/lists/latest", getLatestAircrafts);
router.get("/lists/:id", getAircraftById);
router.get("/lists/filters", getAircraftsByFilters);
router.get("/relatedAircrafts", getRelatedAircrafts)
// router.get("/lists/facets", getAircraftFacets); 

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

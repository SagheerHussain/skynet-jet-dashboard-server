const express = require("express");
const router = express.Router();

const {
    getAircraftsCategoryLists,
    getAircraftCategoryById,
    createAircraftCategory,
    updateAircraftCategory,
    deleteAircraftCategory,
} = require("../controllers/aircraftCategory.controller");

// GET
router.get("/lists", getAircraftsCategoryLists);
router.get("/lists/:id", getAircraftCategoryById);

// POST
router.post("/", createAircraftCategory);

// PUT
router.put("/update/:id", updateAircraftCategory);

// DELETE
router.delete("/delete/:id", deleteAircraftCategory);

module.exports = router;

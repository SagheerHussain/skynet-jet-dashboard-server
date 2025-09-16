const express = require("express");
const router = express.Router();
const { getBrandsLists, getBrandsById, createBrand, updateBrand, deleteBrand, bulkDeleteBrand } = require("../controllers/brand.controller");
const upload = require("../upload");

/* ------------------- GET ---------------------- */
router.get("/lists", getBrandsLists);
router.get("/lists/:id", getBrandsById);

/* ------------------- POST ---------------------- */
router.post("/", upload.single("logo"), createBrand);

/* ------------------- PUT ---------------------- */
router.put("/update/:id", upload.single("logo"), updateBrand);

/* ------------------- DELETE ---------------------- */
router.delete("/delete/:id", deleteBrand);
router.delete("/bulkDelete", bulkDeleteBrand);

module.exports = router;
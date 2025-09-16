const express = require("express");
const router = express.Router();

const { getReviewsLists, getReviewById, createReview, updateReview, deleteReview, bulkDeleteReviews } = require("../controllers/review.controller");

/* ------------------- GET ---------------------- */
router.get("/lists", getReviewsLists);
router.get("/lists/:id", getReviewById);

/* ------------------- POST ---------------------- */
router.post("/", createReview);

/* ------------------- PUT ---------------------- */
router.put("/update/:id", updateReview);

/* ------------------- DELETE ---------------------- */
router.delete("/delete/:id", deleteReview);
router.delete("/bulkDelete", bulkDeleteReviews);

module.exports = router;

const Reviews = require("../models/Review.model");

/* ------------------- GET ---------------------- */
const getReviewsLists = async (req, res) => {
  try {
    const reviews = await Reviews.find().lean();
    if (reviews.length === 0) {
      return res
        .status(200)
        .json({ message: "No reviews found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Reviews found",
        success: true,
        data: reviews,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Reviews.findById({ _id: id }).lean();
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Review found", success: true, data: review });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- POST ---------------------- */
const createReview = async (req, res) => {
  try {
    const { name, review, location } = req.body;

    if (!name || !review || !location) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const newReview = await Reviews.create({
      name,
      review,
      location,
    });
    return res
      .status(201)
      .json({ message: "Review created", success: true, data: newReview });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- PUT ---------------------- */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, review, location } = req.body;

    const updatedReview = await Reviews.findByIdAndUpdate(
      { _id: id },
      {
        name,
        review,
        location,
      },
      {
        new: true,
      }
    );  
    if (!updatedReview) {
      return res
        .status(404)
        .json({ message: "Review not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Review updated", success: true, data: updatedReview });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- DELETE ---------------------- */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Reviews.findByIdAndDelete({ _id: id });
    if (!deletedReview) {
      return res
        .status(404)
        .json({ message: "Review not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Review deleted", success: true, data: deletedReview });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const bulkDeleteReviews = async (req, res) => {
  try {
    const { ids } = req.body;
    const deletedReviews = await Reviews.deleteMany({ _id: { $in: ids } });
    return res
      .status(200)
      .json({ message: "All reviews deleted", success: true, data: deletedReviews });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getReviewsLists,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  bulkDeleteReviews,
};

const Aircraft = require("../models/Aircraft.model");
const Team = require("../models/Team.model");
const Review = require("../models/Review.model");
const Blog = require("../models/Blog.model");

const getAnalysisLists = async (req, res) => {
  try {
    const aircrafts = await Aircraft.find();
    const teams = await Team.find();
    const reviews = await Review.find();
    const blogs = await Blog.find();

    const aircraftCount = aircrafts.length;
    const teamCount = teams.length;
    const reviewCount = reviews.length;
    const blogCount = blogs.length;

    return res.json({
      data: {
        aircraft: aircraftCount,
        team: teamCount,
        review: reviewCount,
        blog: blogCount,
      },
      success: true,
      message: "Analysis found",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = {
  getAnalysisLists,
};

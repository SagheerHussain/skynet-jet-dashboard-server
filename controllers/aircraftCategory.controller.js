const AircraftCategory = require("../models/AircraftCategory.model");

/* ------------------- GET ---------------------- */
const getAircraftsCategoryLists = async (req, res) => {
  try {
    const aircraftsCategories = await AircraftCategory.find();
    if (aircraftsCategories.length === 0) {
      return res
        .status(200)
        .json({ message: "No aircrafts found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Aircrafts found",
        success: true,
        data: aircraftsCategories,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getAircraftCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const aircraftCategory = await AircraftCategory.findById({ _id: id });
    if (!aircraftCategory) {
      return res
        .status(404)
        .json({ message: "Aircraft not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Aircraft found", success: true, data: aircraftCategory });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- POST ---------------------- */
const createAircraftCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const slug = name.toLowerCase().replace(/\s/g, "-");

    const aircraftCategory = await AircraftCategory.create({
      name,
      slug,
    });
    return res
      .status(201)
      .json({ message: "Aircraft created", success: true, data: aircraftCategory });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const updateAircraftCategory = async (req, res) => {
  try {
    console.log(req.body, req.params)
    const { id } = req.params;
    const { name } = req.body;

    const slug = name.toLowerCase().replace(/\s/g, "-");

    const aircraftCategory = await AircraftCategory.findByIdAndUpdate(
      { _id: id },
      {
        name,
        slug,
      },
      {
        new: true,
      }
    );
    if (!aircraftCategory) {
      return res
        .status(404)
        .json({ message: "Aircraft not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Aircraft updated", success: true, data: aircraftCategory });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const deleteAircraftCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const aircraftCategory = await AircraftCategory.findByIdAndDelete({ _id: id });
    if (!aircraftCategory) {
      return res
        .status(404)
        .json({ message: "Aircraft not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Aircraft deleted", success: true, data: aircraftCategory });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getAircraftsCategoryLists,
  getAircraftCategoryById,
  createAircraftCategory,
  updateAircraftCategory,
  deleteAircraftCategory,
};

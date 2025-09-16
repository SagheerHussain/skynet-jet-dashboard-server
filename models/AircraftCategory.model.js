const mongoose = require("mongoose");

const aircraftCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("AircraftCategory", aircraftCategorySchema);

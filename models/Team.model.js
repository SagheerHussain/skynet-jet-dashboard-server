const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
    required: true,
  },
  team_member_picture: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  facebook: {
    type: String
  },
  instagram: {
    type: String
  },
  linkedin: {
    type: String
  },
  youtube: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);

const mongoose = require("mongoose");

const aircraftSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: Number },
    price: { type: Number },
    status: {
      type: String,
      enum: [
        "for-sale",
        "sold",
        "wanted",
        "coming-soon",
        "sale-pending",
        "off-market",
        "acquired",
      ],
    },
    latitude: { type: String },
    longitude: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "AircraftCategory" },
    airframe: { type: Number },
    engine: { type: Number },
    propeller: { type: Number },
    overview: { type: String },
    description: {
      version: { type: Number, default: 1 },
      sections: {
        type: Map,
        of: new mongoose.Schema({ html: String, text: String, items: [String] }, { _id: false }),
        default: {} // <- important
      }
    },
    contactAgent: { name: String, phone: String, email: String },
    images: [String],
    featuredImage: { type: String },
    videoUrl: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Aircraft", aircraftSchema);

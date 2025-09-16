const mongoose = require('mongoose');

const BlogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    slug: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogCategory', BlogCategorySchema);
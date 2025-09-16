const BlogCategory = require("../models/BlogCategory.model");

/* ------------------- GET ---------------------- */
const getBlogCategoryLists = async (req, res) => {
  try {
    const blogCategoryLists = await BlogCategory.find().lean();
    if (!blogCategoryLists.length) {
      return res
        .status(200)
        .json({ message: "No blog categories found", success: false });
    }
    return res.status(200).json({
      message: "Blog categories found",
      success: true,
      data: blogCategoryLists,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getBlogCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogCategory = await BlogCategory.findById({ _id: id }).lean();
    if (!blogCategory) {
      return res
        .status(200)
        .json({ message: "No blog category found", success: false });
    }
    return res.status(200).json({
      message: "Blog category found",
      success: true,
      data: blogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- POST ---------------------- */
const createBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const slug = name.toLowerCase().replace(/\s/g, "-");

    const blogCategory = await BlogCategory.create({ name, slug });
    return res.status(200).json({
      message: "Blog category created",
      success: true,
      data: blogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- PUT ---------------------- */
const updateBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const slug = name.toLowerCase().replace(/\s/g, "-");

    const blogCategory = await BlogCategory.findByIdAndUpdate(
      { _id: id },
      {
        name,
        slug,
      },
      { new: true }
    );
    if (!blogCategory) {
      return res
        .status(200)
        .json({ message: "No blog category found", success: false });
    }
    return res.status(200).json({
      message: "Blog category updated",
      success: true,
      data: blogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- DELETE ---------------------- */
const deleteBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const blogCategory = await BlogCategory.findByIdAndDelete({ _id: id });
    if (!blogCategory) {
      return res
        .status(200)
        .json({ message: "No blog category found", success: false });
    }
    return res.status(200).json({
      message: "Blog category deleted",
      success: true,
      data: blogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const bulkDeleteBlogCategory = async (req, res) => {
  try {
    const { ids } = req.body;
    const blogCategory = await BlogCategory.deleteMany({ _id: { $in: ids } });
    if (!blogCategory) {
      return res
        .status(200)
        .json({ message: "No blog category found", success: false });
    }
    return res.status(200).json({
      message: "Blog category deleted",
      success: true,
      data: blogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getBlogCategoryLists,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  bulkDeleteBlogCategory,
};

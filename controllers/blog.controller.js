const Blog = require("../models/Blog.model");
const cloudinary = require("../config/cloudinary");
const sanitizeHtml = require("sanitize-html");

// OPTIONAL: allowlist of tags/attrs you permit from Quill
const SANITIZE_OPTS = {
  allowedTags: [
    "p","br","strong","b","em","i","u","s","span","ul","ol","li","blockquote",
    "h1","h2","h3","h4","h5","h6","a","img","code","pre","hr"
  ],
  allowedAttributes: {
    a: ["href","name","target","rel"],
    img: ["src","alt"],
    span: ["class"]
  },
  // prevent javascript: links etc.
  allowedSchemes: ["http","https","mailto","tel"],
  allowProtocolRelative: false,
  // (optional) strip empty tags
  nonTextTags: ["style","script","textarea","noscript"]
};

/* ------------------- GET ---------------------- */
const getBlogLists = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author").populate("category").lean();
    if (blogs.length === 0) {
      return res
        .status(200)
        .json({ message: "No blogs found", success: false });
    }
    return res.status(200).json({
      message: "Blogs found",
      success: true,
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById({ _id: id }).populate("author").populate("category").lean();
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Blog found", success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- POST ---------------------- */
const createBlog = async (req, res) => {
  try {
    const { title, category, author, description } = req.body;

    if ((!title, !category, !author, !description)) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    console.log(req.body, req.file)

    let coverImage;

    if (req.file) {
      coverImage = await cloudinary.uploader.upload(req.file.path);
    } 
    const cleanHtml = sanitizeHtml(description);

    const blog = await Blog.create({
      title,
      category,
      author,
      description: cleanHtml,
      coverImage: coverImage.secure_url,
    });
    return res
      .status(201)
      .json({ message: "Blog created", success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- PUT ---------------------- */
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, author, description } = req.body;

    let coverImage;

    if (req.file) {
      coverImage = await cloudinary.uploader.upload(req.file.path);
    }

    const blog = await Blog.findById({ _id: id }).lean();

    const cleanHtml = sanitizeHtml(description, SANITIZE_OPTS);

    const updateBlog = await Blog.findByIdAndUpdate(
      { _id: id },
      {
        title,
        category,
        author,
        description: cleanHtml,
        coverImage: req.file ? coverImage.secure_url : blog.coverImage,
      },
      { new: true }
    );

    if (!updateBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }

    return res
      .status(201)
      .json({ message: "Blog updated", success: true, data: updateBlog });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- DELETE ---------------------- */
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete({ _id: id });
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Blog deleted", success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    const blog = await Blog.deleteMany({ _id: { $in: ids } });
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Blog deleted", success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getBlogLists,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  bulkDelete,
};

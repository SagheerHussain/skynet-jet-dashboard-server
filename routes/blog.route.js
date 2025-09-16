const express = require("express");
const router = express.Router();

const upload = require("../upload");

const { getBlogLists, getBlogById, createBlog, updateBlog, deleteBlog, bulkDelete } = require("../controllers/blog.controller");

/* ------------------- GET ---------------------- */
router.get("/lists", getBlogLists);
router.get("/lists/:id", getBlogById);

/* ------------------- POST ---------------------- */
router.post("/", upload.single("coverImage"), createBlog);

/* ------------------- PUT ---------------------- */
router.put("/update/:id", upload.single("coverImage"), updateBlog);

/* ------------------- DELETE ---------------------- */
router.delete("/delete/:id", deleteBlog);
router.delete("/bulkDelete", bulkDelete);

module.exports = router;
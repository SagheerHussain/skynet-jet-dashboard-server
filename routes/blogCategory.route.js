const express = require("express");
const router = express.Router();

const {
    getBlogCategoryLists,
    getBlogCategoryById,
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    bulkDeleteBlogCategory,
} = require("../controllers/blogCategories.controller");

/* ------------------- GET ---------------------- */
router.get("/lists", getBlogCategoryLists);
router.get("/lists/:id", getBlogCategoryById);

/* ------------------- POST ---------------------- */
router.post("/", createBlogCategory);

/* ------------------- PUT ---------------------- */
router.put("/update/:id", updateBlogCategory);

/* ------------------- DELETE ---------------------- */
router.delete("/delete/:id", deleteBlogCategory);
router.delete("/bulkDelete", bulkDeleteBlogCategory);

module.exports = router;
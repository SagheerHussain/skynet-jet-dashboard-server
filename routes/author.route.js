const express = require("express");
const router = express.Router();

const {
  getAuthorsLists,
  getAuthorsById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  bulkDeleteAuthor,
} = require("../controllers/author.controller");

/* ------------------- GET ---------------------- */
router.get("/lists", getAuthorsLists);
router.get("/lists/:id", getAuthorsById);

/* ------------------- POST ---------------------- */
router.post("/", createAuthor);

/* ------------------- PUT ---------------------- */
router.put("/update/:id", updateAuthor);

/* ------------------- DELETE ---------------------- */
router.delete("/delete/:id", deleteAuthor);
router.delete("/bulkDelete", bulkDeleteAuthor);

module.exports = router;

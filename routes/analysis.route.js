const express = require("express");
const router = express.Router();

const { getAnalysisLists } = require("../controllers/analysis.controller");

// GET
router.get("/lists", getAnalysisLists);

module.exports = router;

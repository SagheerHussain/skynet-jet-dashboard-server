const express = require("express");
const router = express.Router();
const upload = require('../upload');

const { getTeamLists, getTeamById, createTeam, updateTeam, deleteTeam, bulkDelete } = require("../controllers/team.controller")

// GET
router.get("/lists", getTeamLists);
router.get("/lists/:id", getTeamById);

// POST
router.post("/", upload.single("profile_picture"), createTeam);

// PUT
router.put("/update/:id", upload.single("profile_picture"), updateTeam);

// DELETE
router.delete("/delete/:id", deleteTeam);
router.delete("/bulkDelete", bulkDelete);

module.exports = router;

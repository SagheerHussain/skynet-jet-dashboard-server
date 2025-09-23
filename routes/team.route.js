const express = require("express");
const router = express.Router();
const upload = require("../upload");

const {
  getTeamLists,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  bulkDelete,
} = require("../controllers/team.controller");

// GET
router.get("/lists", getTeamLists);
router.get("/lists/:id", getTeamById);

// POST
router.post(
  "/",
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "team_member_picture", maxCount: 1 },
  ]),
  createTeam
);

// PUT
router.put(
  "/update/:id",
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "team_member_picture", maxCount: 1 },
  ]),
  updateTeam
);

// DELETE
router.delete("/delete/:id", deleteTeam);
router.delete("/bulkDelete", bulkDelete);

module.exports = router;

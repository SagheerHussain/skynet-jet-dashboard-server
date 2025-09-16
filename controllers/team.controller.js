// install once:
// npm i sanitize-html
const sanitizeHtml = require("sanitize-html");
const Team = require("../models/Team.model");
const cloudinary = require("../config/cloudinary");

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
const getTeamLists = async (req, res) => {
  try {
    const teams = await Team.find().lean();
    return res.status(200).json({
      message: teams.length ? "Teams found" : "No teams found",
      success: true,
      data: teams
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).lean();
    if (!team) {
      return res.status(404).json({ message: "Team not found", success: false });
    }
    return res.status(200).json({ message: "Team found", success: true, data: team });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- POST ---------------------- */
const createTeam = async (req, res) => {
  try {
    const { name, description, designation, phone, email, address, facebook, instagram, linkedin, youtube } = req.body;

    console.log(req.body)

    // FIX: validation
    if (!name || !description || !designation || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }

    // Sanitize Quill HTML
    const safeDescription = sanitizeHtml(description, SANITIZE_OPTS);

    let profileUrl = null;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      profileUrl = upload?.secure_url || null;
    }

    const team = await Team.create({
      name,
      profile_picture: profileUrl,
      description: safeDescription,
      designation,
      phone,
      email,
      address,
      facebook,
      instagram,
      linkedin,
      youtube
    });

    return res.status(201).json({ message: "Team created", success: true, data: team });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- PUT ---------------------- */
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, designation, phone, email, address, facebook, instagram, linkedin, youtube } = req.body;

    const existing = await Team.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Team not found", success: false });
    }

    let profileUrl = existing.profile_picture || null;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      profileUrl = upload?.secure_url || profileUrl;
    }

    const safeDescription = typeof description === "string"
      ? sanitizeHtml(description, SANITIZE_OPTS)
      : existing.description;

    const updated = await Team.findByIdAndUpdate(
      id,
      {
        name: name ?? existing.name,
        profile_picture: profileUrl,
        description: safeDescription,
        designation: designation ?? existing.designation,
        phone: phone ?? existing.phone,
        email: email ?? existing.email,
        address: address ?? existing.address,
        facebook: facebook ?? existing.facebook,
        instagram: instagram ?? existing.instagram,
        linkedin: linkedin ?? existing.linkedin,
        youtube: youtube ?? existing.youtube
      },
      { new: true }
    );

    return res.status(200).json({ message: "Team updated", success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- DELETE ---------------------- */
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found", success: false });
    }
    return res.status(200).json({ message: "Team deleted", success: true, data: team });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "ids required (array)", success: false });
    }
    const result = await Team.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      message: "Teams deleted",
      success: true,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getTeamLists,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  bulkDelete
};

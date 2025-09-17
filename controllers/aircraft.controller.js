const Aircraft = require("../models/Aircraft.model");
const cloudinary = require("../config/cloudinary");
const Category = require("../models/AircraftCategory.model");
const fs = require("fs/promises");
const sanitizeHtml = require("sanitize-html");

const ROOT_FOLDER = "Mason Amelia Assets";

// OPTIONAL: allowlist of tags/attrs you permit from Quill
const SANITIZE_OPTS = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "span",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "img",
    "code",
    "pre",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt"],
    span: ["class"],
  },
  // prevent javascript: links etc.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  // (optional) strip empty tags
  nonTextTags: ["style", "script", "textarea", "noscript"],
};

/* ===================== Shared Helpers (top-level) ===================== */
const toNum = (v) =>
  v === undefined || v === null || v === "" ? undefined : Number(v);

/** tolerant JSON: { name:"A" } or "{name:'A'}" → real JSON */
const parseJsonLoose = (str, label) => {
  if (!str) return null;
  if (typeof str !== "string") return str;
  let s = str.trim();
  try {
    return JSON.parse(s); // strict first
  } catch {}
  // quote unquoted keys → { name:"A" } => { "name":"A" }
  s = s.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
  // single quotes → double
  s = s.replace(/'/g, '"');
  try {
    return JSON.parse(s);
  } catch {
    throw new Error(`Invalid ${label} JSON`);
  }
};

/* ------------------- GET ---------------------- */
const getAircraftsLists = async (req, res) => {
  try {
    // ---------- pagination inputs ----------
    const pageSize = Math.max(1, Number(req.query.pageSize) || 16);
    const pageRequested = Math.max(1, Number(req.query.page) || 1);

    // ---------- read filters from query ----------
    const {
      status,       // optional, if 'all' then ignored
      categories,   // comma-separated slugs
      minPrice,
      maxPrice,
      minAirframe,
      maxAirframe,
      minEngine,
      maxEngine,
    } = req.query;

    const toNum = (v) =>
      v === undefined || v === null || v === "" ? undefined : Number(v);

    const filter = {};

    // status
    if (status && status !== "all") {
      filter.status = status;
    }

    // categories by slug
    if (categories) {
      const slugs = String(categories)
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (slugs.length) {
        const found = await Category.find({ slug: { $in: slugs } })
          .select("_id")
          .lean();
        const ids = found.map((c) => c._id);
        if (ids.length === 0) {
          return res.status(200).json({
            message: "No aircrafts found",
            success: true,
            data: [],
            total: 0,
            totalItems: 0,
            page: 1,
            pageRequested,
            pageSize,
            pageCount: 0,
            hasPrev: false,
            hasNext: false,
          });
        }
        filter.category = { $in: ids };
      }
    }

    // price range
    const pMin = toNum(minPrice);
    const pMax = toNum(maxPrice);
    if (Number.isFinite(pMin) || Number.isFinite(pMax)) {
      filter.price = {};
      if (Number.isFinite(pMin)) filter.price.$gte = pMin;
      if (Number.isFinite(pMax)) filter.price.$lte = pMax;
    }

    // airframe range
    const aMin = toNum(minAirframe);
    const aMax = toNum(maxAirframe);
    if (Number.isFinite(aMin) || Number.isFinite(aMax)) {
      filter.airframe = {};
      if (Number.isFinite(aMin)) filter.airframe.$gte = aMin;
      if (Number.isFinite(aMax)) filter.airframe.$lte = aMax;
    }

    // engine range
    const eMin = toNum(minEngine);
    const eMax = toNum(maxEngine);
    if (Number.isFinite(eMin) || Number.isFinite(eMax)) {
      filter.engine = {};
      if (Number.isFinite(eMin)) filter.engine.$gte = eMin;
      if (Number.isFinite(eMax)) filter.engine.$lte = eMax;
    }

    // ---------- count with SAME filter ----------
    const totalItems = await Aircraft.countDocuments(filter);
    const pageCount = Math.ceil(totalItems / pageSize); // can be 0
    const page = pageCount > 0 ? Math.min(pageRequested, pageCount) : 1; // clamp only if there are items
    const skip = (page - 1) * pageSize;

    // ---------- fetch page ----------
    const data = await Aircraft.find(filter)
      .sort({ createdAt: -1 })
      .populate("category")
      .skip(skip)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      message: data.length ? "Aircrafts found" : "No aircrafts found",
      success: true,
      data,
      total: data.length,      // items on this page
      totalItems,              // total matching items
      page,                    // effective (clamped) page
      pageRequested,           // what client asked for
      pageSize,
      pageCount,
      hasPrev: pageCount > 0 ? page > 1 : false,
      hasNext: pageCount > 0 ? page < pageCount : false,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getJetRanges = async (req, res) => {
  try {
    const aircrafts = await Aircraft.find().select("price airframe engine").lean();
    if (aircrafts.length === 0) {
      return res
        .status(200)
        .json({ message: "No aircrafts found", success: false });
    }

    const minPrice = Math.min(...aircrafts.map((a) => a.price));
    const maxPrice = Math.max(...aircrafts.map((a) => a.price));
    const minAirframe = Math.min(...aircrafts.map((a) => a.airframe));
    const maxAirframe = Math.max(...aircrafts.map((a) => a.airframe));
    const minEngine = Math.min(...aircrafts.map((a) => a.engine));
    const maxEngine = Math.max(...aircrafts.map((a) => a.engine));

    return res.status(200).json({
      message: "Aircrafts found",
      success: true,
      data: { minPrice, maxPrice, minAirframe, maxAirframe, minEngine, maxEngine },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

const getLatestAircrafts = async (req, res) => {
  try {
    const aircrafts = await Aircraft.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    if (aircrafts.length === 0) {
      return res
        .status(200)
        .json({ message: "No aircrafts found", success: false });
    }
    return res.status(200).json({
      message: "Aircrafts found",
      success: true,
      data: aircrafts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getAircraftById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const aircraft = await Aircraft.findById({ _id: id })
      .populate("category")
      .lean();
    if (!aircraft) {
      return res
        .status(404)
        .json({ message: "Aircraft not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Aircraft found", success: true, data: aircraft });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getAircraftsByFilters = async (req, res) => {
  try {
    const {
      category,
      status,
      airframe,
      engine,
      propeller,
      minPrice,
      maxPrice,
      search,
      page,
      pageSize,
    } = req.query;

    const p = Number(page) || 1;
    const ps = Number(pageSize) || 10;
    const skip = (p - 1) * ps;

    const filters = {};
    if (category) filters.category = category;
    if (airframe) filters.airframe = Number(airframe);
    if (engine) filters.engine = Number(engine);
    if (propeller) filters.propeller = Number(propeller);
    if (status) filters.status = status;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }
    if (search) {
      // description is an object; adjust if you want to search inner html fields
      filters.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    const aircrafts = await Aircraft.find(filters).skip(skip).limit(ps).lean();

    if (aircrafts.length === 0) {
      return res
        .status(200)
        .json({ message: "No aircrafts found", success: false });
    }

    return res.status(200).json({
      message: "Aircrafts found",
      success: true,
      data: aircrafts,
      total: aircrafts.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- POST ---------------------- */
const createAircraft = async (req, res) => {
  try {
    let {
      title,
      year,
      price,
      status,
      category,
      location,
      description,
      overview,
      airframe,
      engine,
      propeller,
      contactAgent,
      videoUrl,
    } = req.body;

    if (
      !title ||
      !price ||
      !category ||
      !location ||
      !description ||
      !overview
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const safeOverview = sanitizeHtml(overview, SANITIZE_OPTS);

    let descriptionObj;
    try {
      descriptionObj =
        typeof description === "string" ? JSON.parse(description) : description;
    } catch {
      return res
        .status(400)
        .json({ success: false, message: "Invalid description JSON" });
    }
    if (
      !descriptionObj ||
      typeof descriptionObj !== "object" ||
      !descriptionObj.sections
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid description: "sections" is required',
      });
    }

    let contactAgentObj = null;
    if (contactAgent) {
      try {
        contactAgentObj = parseJsonLoose(contactAgent, "contactAgent");
      } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
      }
    }

    year = toNum(year);
    price = toNum(price);
    airframe = toNum(airframe);
    engine = toNum(engine);
    propeller = toNum(propeller);
    if (Number.isNaN(price)) {
      return res
        .status(400)
        .json({ success: false, message: "Price must be a number" });
    }

    // ---------- NEW: pick files by field name ----------
    const imagesFiles = req.files?.images || [];
    const featuredFile = (req.files?.featuredImage || [])[0];

    // ---------- Upload gallery images ----------
    const uploaded = [];
    for (const f of imagesFiles) {
      const r = await cloudinary.uploader.upload(f.path, {
        folder: ROOT_FOLDER,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });
      uploaded.push(r);
      await fs.unlink(f.path).catch(() => {});
    }
    const imageUrls = uploaded.map((x) => x.secure_url);

    // ---------- Upload featured image (optional) ----------
    let featuredUrl = undefined;
    if (featuredFile) {
      const fr = await cloudinary.uploader.upload(featuredFile.path, {
        folder: ROOT_FOLDER,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });
      featuredUrl = fr.secure_url;
      await fs.unlink(featuredFile.path).catch(() => {});
    }

    const aircraft = await Aircraft.create({
      title,
      year,
      price,
      overview: safeOverview,
      status,
      category,
      location,
      description: descriptionObj,
      airframe,
      engine,
      propeller,
      contactAgent: contactAgentObj,
      images: imageUrls,
      featuredImage: featuredUrl, // ✅ save it
      videoUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Aircraft created",
      data: aircraft,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------- PUT ---------------------- */
const updateAircraft = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      title,
      year,
      price,
      status,
      category,
      location,
      overview,
      description,
      airframe,
      engine,
      propeller,
      contactAgent,
      videoUrl,
      keepImages,
    } = req.body;

    const safeOverview = sanitizeHtml(overview, SANITIZE_OPTS);

    let descriptionObj;
    if (description !== undefined) {
      try {
        descriptionObj =
          typeof description === "string"
            ? JSON.parse(description)
            : description;
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid description JSON" });
      }
      if (
        !descriptionObj ||
        typeof descriptionObj !== "object" ||
        !descriptionObj.sections
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid description: "sections" is required',
        });
      }
    }

    let contactAgentObj = null;
    if (contactAgent !== undefined && contactAgent !== "") {
      try {
        contactAgentObj = parseJsonLoose(contactAgent, "contactAgent");
      } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
      }
    }

    const yearNum = toNum(year);
    const priceNum = toNum(price);
    const airframeNum = toNum(airframe);
    const engineNum = toNum(engine);
    const propellerNum = toNum(propeller);
    if (price !== undefined && Number.isNaN(priceNum)) {
      return res
        .status(400)
        .json({ success: false, message: "Price must be a number" });
    }

    let keep = [];
    if (keepImages !== undefined) {
      try {
        keep =
          typeof keepImages === "string" ? JSON.parse(keepImages) : keepImages;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid keepImages (must be JSON array of URLs)",
        });
      }
      if (!Array.isArray(keep)) keep = [];
    }

    // ---------- NEW: pick files by field name ----------
    const imagesFiles = req.files?.images || [];
    const featuredFile = (req.files?.featuredImage || [])[0];

    // ---------- Upload new gallery images ----------
    const uploaded = [];
    for (const f of imagesFiles) {
      const r = await cloudinary.uploader.upload(f.path, {
        folder: ROOT_FOLDER,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });
      uploaded.push(r.secure_url);
      await fs.unlink(f.path).catch(() => {});
    }

    // ---------- Build patch ----------
    const patch = {};
    if (title !== undefined) patch.title = title;
    if (year !== undefined) patch.year = yearNum;
    if (price !== undefined) patch.price = priceNum;
    if (status !== undefined) patch.status = status;
    if (category !== undefined) patch.category = category;
    if (location !== undefined) patch.location = location;
    if (description !== undefined) patch.description = descriptionObj;
    if (overview !== undefined) patch.overview = safeOverview;
    if (airframe !== undefined) patch.airframe = airframeNum;
    if (engine !== undefined) patch.engine = engineNum;
    if (propeller !== undefined) patch.propeller = propellerNum;
    if (contactAgent !== undefined) patch.contactAgent = contactAgentObj;
    if (videoUrl !== undefined) patch.videoUrl = videoUrl;

    // ---------- If a new featured image file came, upload & replace ----------
    if (featuredFile) {
      const fr = await cloudinary.uploader.upload(featuredFile.path, {
        folder: ROOT_FOLDER,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });
      patch.featuredImage = fr.secure_url;
      await fs.unlink(featuredFile.path).catch(() => {});
    }

    const current = await Aircraft.findById(id).lean();
    if (!current)
      return res
        .status(404)
        .json({ success: false, message: "Aircraft not found" });

    const baseKeep = keep.length
      ? keep
      : Array.isArray(current.images)
      ? current.images
      : [];
    patch.images = [...new Set([...(baseKeep || []), ...uploaded])];

    const aircraft = await Aircraft.findByIdAndUpdate(
      id,
      { $set: patch },
      { new: true }
    );
    if (!aircraft) {
      return res
        .status(404)
        .json({ success: false, message: "Aircraft not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Aircraft updated", data: aircraft });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------- DELETE ---------------------- */
const deleteAircraft = async (req, res) => {
  try {
    const { id } = req.params;
    const aircraft = await Aircraft.findByIdAndDelete({ _id: id });
    if (!aircraft) {
      return res
        .status(404)
        .json({ message: "Aircraft not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Aircraft deleted", success: true, data: aircraft });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const bulkDeleteAircraft = async (req, res) => {
  try {
    const { ids } = req.body;
    const aircrafts = await Aircraft.deleteMany({ _id: { $in: ids } });
    return res
      .status(200)
      .json({ message: "Aircrafts deleted", success: true, data: aircrafts });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getAircraftsLists,
  getJetRanges,
  getLatestAircrafts,
  getAircraftById,
  getAircraftsByFilters,
  createAircraft,
  updateAircraft,
  deleteAircraft,
  bulkDeleteAircraft,
};

const Brand = require("../models/Brands.model");
const cloudinary = require("../config/cloudinary");

/* ------------------- GET ---------------------- */
const getBrandsLists = async (req, res) => {
    try {
        const brands = await Brand.find().lean();
        if (brands.length === 0) {
            return res.status(200).json({ message: "No brands found", success: false });
        }
        return res.status(200).json({ message: "Brands found", success: true, data: brands });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const getBrandsById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findById({ _id: id });
        if (!brand) {
            return res.status(404).json({ message: "Brand not found", success: false });
        }
        return res.status(200).json({ message: "Brand found", success: true, data: brand });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

/* ------------------- POST ---------------------- */
const createBrand = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded", success: false });
        }
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);

        const brand = await Brand.create({ logo: uploadResponse.secure_url });
        return res.status(201).json({ message: "Brand created", success: true, data: brand });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

/* ------------------- PUT ---------------------- */
const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("file:", req.file);
        let uploadResponse;
        if (req.file) {
            uploadResponse = await cloudinary.uploader.upload(req.file.path);
        }

        const brandUrl = await Brand.findById({ _id: id });
        if (!brandUrl) {
            return res.status(404).json({ message: "Brand not found", success: false });
        }

        const brand = await Brand.findByIdAndUpdate({ _id: id }, { logo: req.file ? uploadResponse.secure_url : brandUrl.logo }, { new: true });
        return res.status(200).json({ message: "Brand updated", success: true, data: brand });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

/* ------------------- DELETE ---------------------- */
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findByIdAndDelete({ _id: id });
        if (!brand) {
            return res.status(404).json({ message: "Brand not found", success: false });
        }
        return res.status(200).json({ message: "Brand deleted", success: true, data: brand });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const bulkDeleteBrand = async (req, res) => {
    try {
        const { ids } = req.body;
        const brands = await Brand.deleteMany({ _id: { $in: ids } });
        return res.status(200).json({ message: "Brands deleted", success: true, data: brands });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    getBrandsLists,
    getBrandsById,
    createBrand,
    updateBrand,
    deleteBrand,
    bulkDeleteBrand,
};

const Author = require("../models/author.model");

/* ------------------- GET ---------------------- */
const getAuthorsLists = async (req, res) => {
    try {
        const authors = await Author.find().lean();

        if (authors.length === 0) {
            return res
                .status(200)
                .json({ message: "No authors found", success: false });
        }

        res.status(200).json({ data: authors, success: true, message: "Authors Fetched Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

const getAuthorsById = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await Author.findById({ _id: id }).lean();
        if (!author) {
            return res
                .status(404)
                .json({ message: "Author not found", success: false });
        }
        return res
            .status(200)
            .json({ message: "Author found", success: true, data: author });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

/* ------------------- POST ---------------------- */
const createAuthor = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ message: "Missing required fields", success: false });
        }
        const author = await Author.create({ name });
        return res
            .status(201)
            .json({ message: "Author created", success: true, data: author });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

/* ------------------- PUT ---------------------- */
const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const author = await Author.findByIdAndUpdate({ _id: id }, { name }, { new: true });
        if (!author) {
            return res
                .status(404)
                .json({ message: "Author not found", success: false });
        }
        return res
            .status(200)
            .json({ message: "Author updated", success: true, data: author });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

/* ------------------- DELETE ---------------------- */
const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await Author.findByIdAndDelete({ _id: id });
        if (!author) {
            return res
                .status(404)
                .json({ message: "Author not found", success: false });
        }
        return res
            .status(200)
            .json({ message: "Author deleted", success: true, data: author });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

/* ------------------- DELETE ---------------------- */
const bulkDeleteAuthor = async (req, res) => {
    try {
        const { ids } = req.body;
        const authors = await Author.deleteMany({ _id: { $in: ids } });
        return res
            .status(200)
            .json({ message: "Authors deleted", success: true, data: authors });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

module.exports = {
    getAuthorsLists,
    getAuthorsById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    bulkDeleteAuthor
}

const express = require("express");
const router = express.Router();

const {
    getContactLists,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    bulkDeleteContact,
} = require("../controllers/contact.controller");

// GET
router.get("/lists", getContactLists);
router.get("/lists/:id", getContactById);

// POST
router.post("/", createContact);

// PUT
router.put("/update/:id", updateContact);

// DELETE
router.delete("/delete/:id", deleteContact);
router.delete("/bulkDelete", bulkDeleteContact);

module.exports = router;

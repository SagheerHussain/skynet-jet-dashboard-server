const Contact = require("../models/Contact.model");

/* ------------------- GET ---------------------- */
const getContactLists = async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (contacts.length === 0) {
      return res
        .status(200)
        .json({ message: "No contacts found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Contacts found",
        success: true,
        data: contacts,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById({ _id: id });
    if (!contact) {
      return res
        .status(404)
        .json({ message: "Contact not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Contact found", success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- POST ---------------------- */
const createContact = async (req, res) => {
  try {
    const { email, address, phone, facebook, instagram, linkedin, youtube } = req.body;

    if (!email || !address || !phone || !facebook || !instagram || !linkedin || !youtube) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const contact = await Contact.create({
      email,
      address,
      phone,
      facebook,
      instagram,
      linkedin,
      youtube,
    });
    return res
      .status(201)
      .json({ message: "Contact created", success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- PUT ---------------------- */
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, address, phone, facebook, instagram, linkedin, youtube } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      { _id: id },
      {
        email,
        address,
        phone,
        facebook,
        instagram,
        linkedin,
        youtube,
      },
      {
        new: true,
      }
    );
    if (!contact) {
      return res
        .status(404)
        .json({ message: "Contact not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Contact updated", success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ------------------- DELETE ---------------------- */
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete({ _id: id });
    if (!contact) {
      return res
        .status(404)
        .json({ message: "Contact not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Contact deleted", success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const bulkDeleteContact = async (req, res) => {
  try {
    const { ids } = req.body;
    const deletedContact = await Contact.deleteMany({ _id: { $in: ids } });
    return res
      .status(200)
      .json({ message: "All contacts deleted", success: true, data: deletedContact });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getContactLists,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContact,
};

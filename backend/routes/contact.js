import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// GET contact info
router.get("/", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({}); // create default if not exists
    }
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST update contact info
router.post("/", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact(req.body);
    } else {
      Object.assign(contact, req.body);
    }
    await contact.save();
    res.json({ success: true, contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST reset to default
router.post("/reset", async (req, res) => {
  try {
    await Contact.deleteMany();
    const contact = await Contact.create({});
    res.json({ success: true, contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

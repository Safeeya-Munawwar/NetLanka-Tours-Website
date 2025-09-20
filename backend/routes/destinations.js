import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Destination from "../models/Destination.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_FOLDER = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// GET all destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

// POST new destination
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const newDest = new Destination({
      name,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await newDest.save();
    res.status(201).json(newDest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create destination" });
  }
});

// PUT update destination
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const dest = await Destination.findById(id);
    if (!dest) return res.status(404).json({ error: "Destination not found" });

    dest.name = name || dest.name;
    dest.description = description || dest.description;

    if (req.file) {
      if (dest.imageUrl) {
        const oldImagePath = path.join(__dirname, "..", dest.imageUrl.replace("/uploads/", "uploads/"));
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      dest.imageUrl = `/uploads/${req.file.filename}`;
    }

    await dest.save();
    res.json(dest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update destination" });
  }
});

// DELETE destination
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dest = await Destination.findById(id);
    if (!dest) return res.status(404).json({ error: "Destination not found" });

    if (dest.imageUrl) {
      const imagePath = path.join(__dirname, "..", dest.imageUrl.replace("/uploads/", "uploads/"));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await dest.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete destination" });
  }
});

export default router;

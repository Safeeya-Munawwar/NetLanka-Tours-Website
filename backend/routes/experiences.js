import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Experience from "../models/Experience.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads folder
const UPLOADS_FOLDER = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// GET all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

// POST new experience
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newExp = new Experience({
      title,
      description: description || "",
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await newExp.save();
    res.status(201).json(newExp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create experience" });
  }
});

// PUT update experience
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const exp = await Experience.findById(id);
    if (!exp) return res.status(404).json({ error: "Experience not found" });

    exp.title = title || exp.title;
    exp.description = description || exp.description;

    if (req.file) {
      if (exp.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          exp.imageUrl.replace("/uploads/", "uploads/")
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      exp.imageUrl = `/uploads/${req.file.filename}`;
    }

    await exp.save();
    res.json(exp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update experience" });
  }
});

// DELETE experience
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exp = await Experience.findById(id);
    if (!exp) return res.status(404).json({ error: "Experience not found" });

    if (exp.imageUrl) {
      const imagePath = path.join(__dirname, "..", exp.imageUrl.replace("/uploads/", "uploads/"));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await exp.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

export default router;

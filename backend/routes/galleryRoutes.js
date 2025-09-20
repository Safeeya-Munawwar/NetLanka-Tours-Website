import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import GalleryPhoto from "../models/GalleryPhoto.js";
import fs from "fs";

const router = express.Router(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_FOLDER = path.join(__dirname, "..", "uploads");

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// GET all photos
router.get("/", async (req, res) => {
  try {
    const photos = await GalleryPhoto.find();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST add photo
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image required" });

    const imageUrl = `/uploads/${req.file.filename}`;
    const photo = new GalleryPhoto({
      title,
      imageUrl,
      imageFileName: req.file.originalname,
    });
    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update photo
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const photo = await GalleryPhoto.findById(id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    if (title) photo.title = title;

    if (req.file) {
      // Delete old image file
      const oldImagePath = path.join(__dirname, "..", photo.imageUrl.replace("/uploads/", "uploads/"));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);

      photo.imageUrl = `/uploads/${req.file.filename}`;
      photo.imageFileName = req.file.originalname;
    }
    await photo.save();
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE photo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await GalleryPhoto.findById(id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // Delete image file
    const imagePath = path.join(__dirname, "..", photo.imageUrl.replace("/uploads/", "uploads/"));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await photo.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

import express from "express";
import Transport from "../models/Transport.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ----------------- ROUTES -----------------

// GET all transports
router.get("/", async (req, res) => {
  try {
    const transports = await Transport.find();
    res.json(transports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create transport
// POST create transport
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const data = {
      ...req.body,
      vehicles: req.body.vehicles ? JSON.parse(req.body.vehicles) : [],
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };
    const transport = new Transport(data);
    await transport.save();
    res.json(transport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update transport
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const data = {
      ...req.body,
      vehicles: req.body.vehicles ? JSON.parse(req.body.vehicles) : [],
    };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const updated = await Transport.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE transport
router.delete("/:id", async (req, res) => {
  try {
    await Transport.findByIdAndDelete(req.params.id);
    res.json({ message: "Transport deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

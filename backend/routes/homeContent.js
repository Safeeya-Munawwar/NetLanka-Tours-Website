import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import HomeContent from "../models/HomeContent.js";

const router = express.Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ------------------ GET Home Content ------------------
router.get("/", async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.json(content);
  } catch (err) {
    console.error("GET /api/home-content error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ PUT Home Content ------------------
// Use multer middleware for multiple transport images
router.put("/", upload.array("transportFiles"), async (req, res) => {
  try {
    const { title, intro, description, contact, email, address, stats, transport } = req.body;

    // Parse JSON arrays
    const statsArr = stats ? JSON.parse(stats) : [];
    const transportArr = transport ? transport.map(t => JSON.parse(t)) : [];

    // Map uploaded files to transport entries
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (transportArr[index]) {
          transportArr[index].img = `/uploads/${file.filename}`;
        }
      });
    }

    // Sanitize stats
    const cleanStats = statsArr.map((s) => ({
      number: String(s.number || ""),
      label: String(s.label || ""),
    }));

    // Sanitize transport (keep existing img if no new file uploaded)
// Fetch existing
const existing = await HomeContent.findOne();

const cleanTransport = transportArr.map((t, index) => {
  const existingItem = existing?.transport?.[index];
  return {
    name: String(t.name || ""),
    img: t.img || existingItem?.img || "", // ✅ fallback to existing
    details: String(t.details || ""),
  };
});

    if (existing) {
      const updated = await HomeContent.findByIdAndUpdate(
        existing._id,
        {
          title,
          intro,
          description,
          contact,
          email,      // <-- add this
          address,    // <-- add this
          stats: cleanStats,
          transport: cleanTransport,
        },
        { new: true, runValidators: true }
      );
      return res.json(updated);
    } else {
      const created = await HomeContent.create({
        title,
        intro,
        description,
        contact,
        email,      // <-- add this
        address,    // <-- add this
        stats: cleanStats,
        transport: cleanTransport,
      });
      return res.json(created);
    }
  } catch (err) {
    console.error("PUT /api/home-content error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});


export default router;

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Blog from "../models/Blog.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_FOLDER = path.join(__dirname, "..", "uploads");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// POST a new blog
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const newBlog = new Blog({
      title,
      content,
      imageUrl: `/uploads/${req.file.filename}`,
      imageFileName: req.file.originalname,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add blog" });
  }
});

// GET a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});


// PUT update a blog
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    if (req.file) {
      const oldImagePath = path.join(__dirname, "..", blog.imageUrl.replace("/uploads/", "uploads/"));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);

      blog.imageUrl = `/uploads/${req.file.filename}`;
      blog.imageFileName = req.file.originalname;
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE a blog
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.imageUrl) {
      const imagePath = path.join(__dirname, "..", blog.imageUrl.replace("/uploads/", "uploads/"));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await blog.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;

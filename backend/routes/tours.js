import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Tour from "../models/Tour.js";

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

// GET all tours
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: "Failed to fetch tours" });
  }
});

// POST add new tour
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      destinationId,
      title,
      location,
      description,
      rating,
      type,
      price,
      duration,
      isSpecial,
      itinerary,
      transport,
      transportPrices, // ✅ add this
    } = req.body;
    
    const parsedItinerary = itinerary ? JSON.parse(itinerary) : [];
    const parsedTransport = transport ? JSON.parse(transport) : [];
    const parsedTransportPrices = transportPrices ? JSON.parse(transportPrices) : {};
    
    const newTour = new Tour({
      title,
      location,
      description,
      rating: rating ? Number(rating) : 0,
      type,
      price: price ? Number(price) : 0,
      duration,
      isSpecial: isSpecial === "true" || isSpecial === true,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      itinerary: Array.isArray(parsedItinerary) ? parsedItinerary : [],
      transport: Array.isArray(parsedTransport) ? parsedTransport : [],
      transportPrices: parsedTransportPrices, // ✅ save it
      destinationId,
    });
    

    await newTour.save();
    res.status(201).json(newTour);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: "Failed to add tour" });
  }
});

// PUT update tour
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      destinationId, // ✅ include this
      title,
      location,
      description,
      rating,
      type,
      price,
      duration,
      isSpecial,
      itinerary,
      transport,
      transportPrices,
    } = req.body;

    const tour = await Tour.findById(id);
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    // Update fields
    tour.title = title || tour.title;
    tour.location = location || tour.location;
    tour.description = description || tour.description;
    tour.rating = rating !== undefined ? Number(rating) : tour.rating;
    tour.type = type || tour.type;
    tour.price = price !== undefined ? Number(price) : tour.price;
    tour.duration = duration || tour.duration;
    tour.isSpecial = isSpecial === "true" || isSpecial === true;

    // ✅ Update destinationId if provided
    if (destinationId) {
      tour.destinationId = destinationId;
    }

    // Parse JSON fields
    tour.itinerary = itinerary ? JSON.parse(itinerary) : tour.itinerary;
    tour.transport = transport ? JSON.parse(transport) : tour.transport;
    tour.transportPrices = transportPrices ? JSON.parse(transportPrices) : tour.transportPrices;

    if (req.file) {
      // Delete old image
      if (tour.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          tour.imageUrl.replace("/uploads/", "uploads/")
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      tour.imageUrl = `/uploads/${req.file.filename}`;
    }

    await tour.save();
    res.json(tour);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: "Failed to update tour" });
  }
});


// DELETE a tour
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    if (tour.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "..",
        tour.imageUrl.replace("/uploads/", "uploads/")
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await tour.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: "Failed to delete tour" });
  }
});

// GET tours by destinationId
router.get("/by-destination/:destinationId", async (req, res) => {
  try {
    const { destinationId } = req.params;
    const tours = await Tour.find({ destinationId });
    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tours for destination" });
  }
});

export default router;

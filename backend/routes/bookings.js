import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// -----------------------------
// GET all bookings (optional page filter)
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const { page } = req.query; // e.g., ?page=tours
    const filter = page ? { page } : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// -----------------------------
// GET bookings by page (path param)
// -----------------------------
router.get("/page/:page", async (req, res) => {
  try {
    const { page } = req.params; // tours | transport | floatingBooking

    let bookings;
    if (page === "tours") {
      // fetch both tours and floating bookings
      bookings = await Booking.find({ page: { $in: ["tours", "floatingBooking"] } }).sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ page }).sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// -----------------------------
// UPDATE booking
// -----------------------------
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update allowed fields
    booking.status = req.body.status || booking.status;
    booking.vehicle = req.body.vehicle || booking.vehicle;
    booking.pickupLocation = req.body.pickupLocation || booking.pickupLocation;
    booking.dropLocation = req.body.dropLocation || booking.dropLocation; // transport-only
    booking.pickupDate = req.body.pickupDate || booking.pickupDate;
    booking.pickupTime = req.body.pickupTime || booking.pickupTime;

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// CREATE new booking
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body); 
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// -----------------------------
// DELETE booking
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

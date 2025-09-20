import express from "express";
import CustomTour from "../models/CustomTour.js";

const router = express.Router();

// ✅ Create a custom tour request
router.post("/", async (req, res) => {
  try {
    const newRequest = new CustomTour(req.body); // includes vehicle, pickupLocation, pickupDate, pickupTime
    await newRequest.save();
    res.status(201).json({ message: "Custom tour request saved", data: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all custom tour requests
router.get("/", async (req, res) => {
  try {
    const requests = await CustomTour.find().populate("tourId", "title location type");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single request by ID
router.get("/:id", async (req, res) => {
  try {
    const request = await CustomTour.findById(req.params.id).populate("tourId", "title");
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a custom request
router.put("/:id", async (req, res) => {
  try {
    const updated = await CustomTour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Request not found" });
    res.json({ message: "Request updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a custom tour request
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CustomTour.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Request not found" });
    res.json({ message: "Custom request deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

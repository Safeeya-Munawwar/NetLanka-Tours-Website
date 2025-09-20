import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    vehicle: [{ type: String }],
    image: { type: String }, // image path
    method: { type: String },
    location: { type: String },
    date: { type: String },
    time: { type: String },
    bg: { type: String, default: "#f0f6ff" },
  },
  { timestamps: true }
);

const Transport = mongoose.model("Transport", transportSchema);

export default Transport;

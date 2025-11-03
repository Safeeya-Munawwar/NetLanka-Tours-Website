import mongoose from "mongoose";

const vehicleDetailSchema = new mongoose.Schema({
  type: { type: String, required: true },      // e.g., "Car", "Van", "Bus"
  ac: { type: String, default: "Non AC" },     // AC / Non AC
  seats: { type: Number, default: 4 },
  luggage: { type: Number, default: 1 },  
  capacity: { type: Number, default: 1 },      // optional luggage capacity
});

const transportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    vehicles: [vehicleDetailSchema],            // array of vehicle details
    image: { type: String },                     // image path
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

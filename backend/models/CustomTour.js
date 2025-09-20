import mongoose from "mongoose";

const customTourSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: false,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferences: { type: String },
    duration: { type: String },
    budget: { type: String },

    // ✅ Transport details (same as booking)
    vehicle: { type: String, default: "van" }, // car | van | bus | airport
    pickupLocation: { type: String, default: "" },
    pickupDate: { type: Date },
    pickupTime: { type: String, default: "" },

    status: { type: String, enum: ["pending", "completed"], default: "pending" },
  },
  { timestamps: true }
);

const CustomTour =
  mongoose.models.CustomTour || mongoose.model("CustomTour", customTourSchema);

export default CustomTour;

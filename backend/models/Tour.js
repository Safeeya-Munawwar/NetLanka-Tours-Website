import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  day: Number,
  description: String,
});

const tourSchema = new mongoose.Schema({
  title: String,
  location: String,
  duration: String,
  rating: Number,
  description: String,
  price: Number,
  type: { type: String, default: "day" },
  isSpecial: { type: Boolean, default: false },
  imageUrl: String,
  itinerary: { type: [itinerarySchema], default: [] },

  // ✅ Transport field
  transport: {
    type: [String], // e.g., ["Car", "Van", "Bus"]
    default: [],
  },
transportPrices: { type: Object, default: {} },

destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },

});

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;

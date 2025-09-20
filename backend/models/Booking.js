import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  // Common booking fields
  tourId: String,
  tourTitle: String,
  location: String,
  price: Number,
  members: Number,
  total: Number,
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email'] // validate email
  },
  phone: { type: String, required: true },

  // Transport-specific fields
  vehicle: { type: String, default: "van" },        // car | van | bus | airport
  pickupLocation: { type: String, default: "" },    // e.g., Colombo Airport / Hotel
  dropLocation: { type: String, default: "" },      // Only for transport bookings
  pickupDate: { type: Date },
  pickupTime: { type: String, default: "" },        // "09:00 AM"

  // Page-wise field
  page: { 
    type: String, 
    enum: ['tours', 'transport', 'floatingBooking'], 
    required: true 
  },

  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

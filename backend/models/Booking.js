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
    match: [/.+@.+\..+/, 'Please enter a valid email'] 
  },
  phone: { type: String, required: true },

  // Transport-specific fields
  vehicle: { type: String, default: "van" },       
  pickupLocation: { type: String, default: "" },   
  dropLocation: { type: String, default: "" },    
  pickupDate: { type: Date },
  pickupTime: { type: String, default: "" },  

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

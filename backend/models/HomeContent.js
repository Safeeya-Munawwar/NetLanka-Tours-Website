import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
  number: String,
  label: String,
});

// New schema for transport vehicles
const TransportSchema = new mongoose.Schema({
  name: String,
  img: String,
  details: String,
});

const HomeContentSchema = new mongoose.Schema({
  title: String,
  intro: String,
  description: String,
  contact: String,
  email: String, // add this
  address: String, // add this
  stats: [StatSchema],
  transport: [TransportSchema],
});


export default mongoose.model("HomeContent", HomeContentSchema);

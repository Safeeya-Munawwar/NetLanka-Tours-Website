import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
});

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;

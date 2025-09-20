import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  author: { type: String },
  imageUrl: { type: String },
  imageFileName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Blog", BlogSchema);

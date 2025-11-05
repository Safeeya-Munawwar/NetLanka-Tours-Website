import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
});

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;

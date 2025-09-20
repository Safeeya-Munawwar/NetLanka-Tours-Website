import mongoose from "mongoose";

const GalleryPhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true }, 
  imageFileName: { type: String },
});

const GalleryPhoto = mongoose.model("GalleryPhoto", GalleryPhotoSchema);

export default GalleryPhoto;

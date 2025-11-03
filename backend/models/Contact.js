import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  phone: { type: String, default: "+94777 111553" },
  email: { type: String, default: "info@netlankatours.lk" },
  corporateOffice: { type: String, default: "No 15/7, Bernadett Mawatha, Kandana, Sri Lanka" },
  regionalOffice: { type: String, default: "337/1, Katugasthora Road, Kandy, Sri Lanka" },
  corporateCoords: { type: [Number], default: [7.0010, 79.9150] }, // [lat, lng]
  regionalCoords: { type: [Number], default: [7.2907, 80.6330] },
  socialMedia: {
    Facebook: { type: String, default: "https://www.facebook.com" },
    Youtube: { type: String, default: "https://www.youtube.com" },
    Tripadvisor: { type: String, default: "https://www.tripadvisor.com" },
    Pinterest: { type: String, default: "https://www.pinterest.com" },
    Instagram: { type: String, default: "https://www.instagram.com" },
    Google: { type: String, default: "https://www.google.com" },
  },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

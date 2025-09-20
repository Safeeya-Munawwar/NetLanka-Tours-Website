require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Test DB connected"))
  .catch((err) => console.log("❌ Error:", err));

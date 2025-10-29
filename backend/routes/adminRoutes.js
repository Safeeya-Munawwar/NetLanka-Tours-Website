import express from "express";
import User from "../models/User.js";
import Tour from "../models/Tour.js";
import Destination from "../models/Destination.js";
import GalleryPhoto from "../models/GalleryPhoto.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// ✅ Admin Dashboard Route
router.get("/dashboard", async (req, res) => {
  try {
    // Stats summary
    const [
      totalTours,
      totalDestinations,
      totalGallery,
      totalBlogs,
      totalUsers,
      totalComments,
      totalBookings,
    ] = await Promise.all([
      Tour.countDocuments(),
      Destination.countDocuments(),
      GalleryPhoto.countDocuments(),
      Blog.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
      Booking.countDocuments(),
    ]);

    // ✅ Monthly bookings (for chart)
    const currentYear = new Date().getFullYear();
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const bookingsData = months.map((m, i) => ({
      month: m,
      total: monthlyBookings.find((b) => b._id === i + 1)?.total || 0,
    }));

    // ✅ Recent updates (from latest Blog, Tour, Gallery)
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3);
    const recentTours = await Tour.find().sort({ _id: -1 }).limit(2);
    const recentGallery = await GalleryPhoto.find().sort({ _id: -1 }).limit(2);

    res.json({
      stats: {
        totalTours,
        totalDestinations,
        totalGallery,
        totalBlogs,
        totalUsers,
        totalComments,
        totalBookings,
      },
      bookingsData,
      recentUpdates: {
        blogs: recentBlogs,
        tours: recentTours,
        gallery: recentGallery,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

export default router;

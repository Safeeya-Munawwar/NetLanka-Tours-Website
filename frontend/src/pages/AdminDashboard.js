import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import {
  FaUsers,
  FaMapMarkedAlt,
  FaImages,
  FaBlog,
  FaChartLine,
  FaComment,
  FaBook,
} from "react-icons/fa";
import { MdTour } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: {},
    bookingsData: [],
    recentUpdates: { blogs: [], tours: [], gallery: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const { stats, bookingsData, recentUpdates } = data;

  const statCards = [
    {
      title: "Total Tours",
      value: stats.totalTours,
      icon: <MdTour className="text-green-600 text-3xl" />,
    },
    {
      title: "Destinations",
      value: stats.totalDestinations,
      icon: <FaMapMarkedAlt className="text-blue-600 text-3xl" />,
    },
    {
      title: "Gallery Images",
      value: stats.totalGallery,
      icon: <FaImages className="text-purple-600 text-3xl" />,
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs,
      icon: <FaBlog className="text-orange-600 text-3xl" />,
    },
    {
      title: "Transports",
      value: stats.totalTransports,
      icon: <FaChartLine className="text-green-700 text-3xl" />,
    },
    {
      title: "Comments",
      value: stats.totalComments,
      icon: <FaComment className="text-indigo-600 text-3xl" />,
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: <FaBook className="text-red-600 text-3xl" />,
    },
    {
      title: "Active Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-pink-600 text-3xl" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header with Logo */}
      <header className="flex justify-between items-center bg-white shadow-md px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
        <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/images/logo.PNG" alt="NetLanka Logo" style={{ maxWidth: "40px" }} />
      </div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-900 font-serif tracking-wide">
            NetLanka Admin Panel
          </h1>
        </div>
        <div className="text-sm text-gray-600 italic">Welcome, Admin</div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-green-800">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor your website’s statistics, performance, and updates.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10 animate-pulse">
            Loading dashboard data...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white shadow-md hover:shadow-2xl rounded-xl p-6 flex items-center gap-4 transition-transform hover:scale-105 hover:bg-green-50"
                >
                  <div className="bg-green-100 p-3 rounded-lg">{item.icon}</div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {item.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {item.value || 0}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart + Updates Section */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bookings Chart */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl"
              >
                <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <FaChartLine /> Monthly Bookings Trend
                </h2>
                {bookingsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-400 text-center h-56 flex items-center justify-center">
                    No booking data available.
                  </div>
                )}
              </motion.div>

              {/* Recent Updates */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl"
              >
                <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  📰 Recent Updates
                </h2>
                <ul className="text-gray-700 space-y-3">
                  {recentUpdates.blogs.map((b) => (
                    <li key={b._id} className="border-b pb-2">
                      ✏️ <span className="font-semibold text-green-800">Blog:</span>{" "}
                      <span className="font-medium">{b.title}</span>
                    </li>
                  ))}
                  {recentUpdates.tours.map((t) => (
                    <li key={t._id} className="border-b pb-2">
                      ✅ <span className="font-semibold text-green-800">New Tour:</span>{" "}
                      <span className="font-medium">{t.title}</span>
                    </li>
                  ))}
                  {recentUpdates.gallery.map((g) => (
                    <li key={g._id} className="border-b pb-2">
                      🖼️ <span className="font-semibold text-green-800">Gallery Image:</span>{" "}
                      <span className="font-medium">{g.title}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-4">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-green-700">NetLanka</span> Admin
          Panel — All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;

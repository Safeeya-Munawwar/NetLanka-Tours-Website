import React, { useEffect, useState } from "react";
import axios from "axios";
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

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: {},
    bookingsData: [],
    recentUpdates: { blogs: [], tours: [], gallery: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/dashboard")
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
    { title: "Total Tours", value: stats.totalTours, icon: <MdTour className="text-green-600 text-3xl" /> },
    { title: "Destinations", value: stats.totalDestinations, icon: <FaMapMarkedAlt className="text-blue-600 text-3xl" /> },
    { title: "Gallery Images", value: stats.totalGallery, icon: <FaImages className="text-purple-600 text-3xl" /> },
    { title: "Blog Posts", value: stats.totalBlogs, icon: <FaBlog className="text-orange-600 text-3xl" /> },
    { title: "Active Users", value: stats.totalUsers, icon: <FaUsers className="text-pink-600 text-3xl" /> },
    { title: "Comments", value: stats.totalComments, icon: <FaComment className="text-indigo-600 text-3xl" /> },
    { title: "Bookings", value: stats.totalBookings, icon: <FaBook className="text-red-600 text-3xl" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your website’s performance and content activity.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading dashboard data...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {statCards.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md hover:shadow-xl rounded-xl p-5 flex items-center gap-4 transition-transform hover:scale-105"
              >
                <div className="bg-green-50 p-3 rounded-lg">{item.icon}</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-800">
                    {item.value || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Updates */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <FaChartLine /> Monthly Bookings
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
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-400 text-center h-56 flex items-center justify-center">
                  No booking data yet.
                </div>
              )}
            </div>

            {/* Recent Updates */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                📰 Recent Updates
              </h2>
              <ul className="text-gray-700 space-y-3">
                {recentUpdates.blogs.map((b) => (
                  <li key={b._id} className="border-b pb-2">
                    ✏️ Blog: <span className="font-medium">{b.title}</span>
                  </li>
                ))}
                {recentUpdates.tours.map((t) => (
                  <li key={t._id} className="border-b pb-2">
                    ✅ New Tour: <span className="font-medium">{t.title}</span>
                  </li>
                ))}
                {recentUpdates.gallery.map((g) => (
                  <li key={g._id} className="border-b pb-2">
                    🖼️ New Gallery Image:{" "}
                    <span className="font-medium">{g.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      <div className="mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} NetLanka Admin Panel — All Rights Reserved.
      </div>
    </div>
  );
};

export default AdminDashboard;

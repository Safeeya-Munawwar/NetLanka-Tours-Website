import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaUserCircle } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const AdminCommentPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("all");
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 3000);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load comments");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`${API_BASE}/api/comments/${id}`);
      showPopup("Comment deleted successfully!");
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      showPopup("Failed to delete comment", "error");
    }
  };

  const pageCategories = ["all", "home", "contact", "blog"];
  const groupedComments = comments.reduce((groups, comment) => {
    const page = comment.page || "unknown";
    if (!groups[page]) groups[page] = [];
    groups[page].push(comment);
    return groups;
  }, {});
  const filteredComments =
    activePage === "all" ? comments : groupedComments[activePage] || [];

  return (
    <div className="max-w-[1500px] mx-auto my-6 p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-500 shadow-lg font-[Times_New_Roman]">
      <h3 className="text-center mb-10 text-3xl sm:text-4xl font-bold text-green-900">
        Admin Comments Management
      </h3>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {pageCategories.map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`w-36 sm:w-48 md:w-56 py-3 rounded-md font-semibold transition-all duration-300 ${
              activePage === page
                ? "bg-orange-500 text-white shadow-md scale-105"
                : "bg-green-900 text-white hover:bg-green-700"
            }`}
          >
            {page.toUpperCase()} (
            {page === "all"
              ? comments.length
              : groupedComments[page]?.length || 0}
            )
          </button>
        ))}
      </div>

      {/* Loading / Error Messages */}
      {loading && (
        <p className="text-center text-lg text-green-900">Loading comments...</p>
      )}
      {error && <p className="text-center text-red-700">{error}</p>}
      {!loading && filteredComments.length === 0 && (
        <p className="text-center text-gray-700">No comments found.</p>
      )}

      {/* Comments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredComments.map((c) => (
          <div
            key={c._id}
            className="bg-gray-100 border-2 border-green-800 rounded-xl p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div className="flex-grow">
              <p className="font-bold text-green-900 mb-2 text-sm sm:text-base">
                <FaUserCircle className="inline text-green-900 mr-2" />
                {c.name} ({c.email}) —{" "}
                <span className="font-normal text-gray-600 text-xs">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </p>
              <p className="text-sm sm:text-base whitespace-pre-wrap mb-3 text-gray-800">
                {c.message}
              </p>
            </div>
            <button
              onClick={() => handleDelete(c._id)}
              className="flex items-center justify-center gap-2 bg-red-700 text-white px-4 py-2 rounded-md mt-3 hover:bg-red-800 transition"
            >
              <FaTrashAlt /> Delete
            </button>
          </div>
        ))}
      </div>

      {/* Popup Notification */}
      {popup && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-opacity ${
            popupType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
};

export default AdminCommentPage;

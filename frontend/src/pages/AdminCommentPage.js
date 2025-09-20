import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaUserCircle } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const AdminCommentPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activePage, setActivePage] = useState("all"); // default: show all
// Add at the top inside the component
const [popup, setPopup] = useState("");
const [popupType, setPopupType] = useState("success");

const showPopup = (message, type = "success") => {
  setPopup(message);
  setPopupType(type);
  setTimeout(() => setPopup(""), 3000); // auto-hide after 3s
};

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch comments
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

  useEffect(() => {
    fetchComments();
  }, []);

  // Delete comment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`${API_BASE}/api/comments/${id}`);
      showPopup("Blog deleted successfully!");
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      showPopup("Failed to delete comment");
    }
  };

  // Page categories
  const pageCategories = ["all", "home", "contact", "blog"];

  // Group comments by page
  const groupedComments = comments.reduce((groups, comment) => {
    const page = comment.page || "unknown";
    if (!groups[page]) groups[page] = [];
    groups[page].push(comment);
    return groups;
  }, {});

  // Filtered comments by active page
  const filteredComments =
    activePage === "all" ? comments : groupedComments[activePage] || [];

  return (
    <div style={{
      maxWidth: 1500,
      margin: "20px",
      fontFamily: "'Times New Roman', Times, serif" ,
      gap: '20px',  
      padding: '30px',
      background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
      borderRadius: '16px',
      boxShadow: '0 6px 16px rgba(0, 100, 34, 0.15)',
      transition: 'all 0.3s ease',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
     <div
  style={{
    display: "flex",
    justifyContent: "center", // pushes logo to the right
  }}
>
  <img
    src="/images/logo.PNG"
    alt="NetLanka Logo"
    style={{
      maxWidth: "100px",
      height: "auto",
      objectFit: "contain",
    }}
  />
</div>
      <h3
        style={{
          textAlign: "center",
          marginBottom: 40,
          fontSize: isMobile ? "1.8rem" : "2.6rem",
          fontWeight: 700,
          color: "#2c5d30",
          fontFamily: "'Times New Roman', Times, serif",
        }}
      >
        Admin Comments Management
      </h3>
      <div style={{ margin: "0 auto" }}>
      {/* Category Buttons with count */}
      <div style={styles.categoryButtons}>
        {pageCategories.map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            style={{
              width: 120,
              backgroundColor: activePage === page ? "#ffa500" : "#2c5d30",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: 5,
              marginRight: 10,
              marginBottom: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontFamily: "'Times New Roman', Times, serif",
              transition: "all 0.3s",
            }}
          >
            {page.toUpperCase()} ({page === "all" ? comments.length : (groupedComments[page]?.length || 0)})
          </button>
        ))}
      </div>

      {loading && <p style={{ fontFamily: "'Times New Roman', Times, serif" }}>Loading comments...</p>}
      {error && <p style={{ color: "crimson", fontFamily: "'Times New Roman', Times, serif" }}>{error}</p>}
      {!loading && filteredComments.length === 0 && <p style={{ fontFamily: "'Times New Roman', Times, serif" }}>No comments found.</p>}

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          alignItems: "stretch", // all cards same height
        }}
      >
        {filteredComments.map((c) => (
          <div
            key={c._id}
            style={{
              ...styles.commentCard,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <p style={styles.commentHeader}>
                <FaUserCircle style={{ marginRight: 6, color: "#064420" }} />
                {c.name} ({c.email}) —{" "}
                <span style={styles.commentDate}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </p>
              <p style={styles.commentMessage}>{c.message}</p>
            </div>
            <button style={styles.deleteButton} onClick={() => handleDelete(c._id)}>
              <FaTrashAlt style={{ marginRight: 6 }} /> Delete
            </button>
          </div>
        ))}
      </div>
      {/* Popup */}
{popup && (
  <div style={{
    position: "fixed",
    top: 20,
    right: 20,
    backgroundColor: popupType === "success" ? "#4CAF50" : "#d32f2f",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 6,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 9999,
    fontWeight: "bold",
  }}>
    {popup}
  </div>
)}
</div>
    </div>
  );
};

const styles = {
  categoryButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
    flexWrap: "wrap",
  },
  commentCard: {
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    backgroundColor: "#f6f6f6",
    border: "2px solid #064420", // Dark green border
    fontFamily: "'Times New Roman', Times, serif",
  },  
  commentHeader: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "'Times New Roman', Times, serif",
  },
  commentDate: {
    fontWeight: "normal",
    color: "#555",
    fontSize: 12,
    fontFamily: "'Times New Roman', Times, serif",
  },
  commentMessage: {
    fontSize: 15,
    whiteSpace: "pre-wrap",
    marginBottom: 12,
    fontFamily: "'Times New Roman', Times, serif",
  },
  deleteButton: {
    backgroundColor: "#b71c1c",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    display: "flex",
    alignItems: "center",       // vertical alignment
    justifyContent: "center",   // horizontal alignment (centers text/icon)
    marginTop: 10,
    fontFamily: "'Times New Roman', Times, serif",
  }  
};

export default AdminCommentPage;

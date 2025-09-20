/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

const AdminCustomTour = () => {
  const [customTours, setCustomTours] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ preferences: "", duration: "", budget: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch tours
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customTours");
      setCustomTours(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const closeEdit = () => setEditId(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/customTours/${editId}`, editForm);
      alert("Request updated successfully!");
      fetchTours();
      closeEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  // Export functions
  const exportToExcel = () => {
    const data = customTours.map((t) => ({
      "Tour Title": t.tourId?.title || "",
      Name: t.name,
      Email: t.email,
      Phone: t.phone,
      Preferences: t.preferences,
      Duration: t.duration,
      Budget: t.budget,
      Status: t.status || "pending",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CustomTours");
    XLSX.writeFile(wb, "CustomTours.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Custom Tour Requests", 14, 15);

    let y = 25;
    customTours.forEach((t, idx) => {
      const status = t.status || "pending";
      doc.setFontSize(12);
      doc.text(
        `${idx + 1}. Tour: ${t.tourId?.title || "N/A"} | Name: ${t.name} | Email: ${t.email} | Phone: ${t.phone} | Status: ${status}`,
        14,
        y
      );
      y += 7;
      doc.text(`   Preferences: ${t.preferences || "N/A"}`, 14, y);
      y += 7;
      doc.text(`   Duration: ${t.duration || "N/A"} | Budget: ${t.budget || "N/A"}`, 14, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("CustomTours.pdf");
  };

  // Filtered tours
  const filteredTours =
    filter === "all" ? customTours : customTours.filter((t) => (t.status || "pending") === filter);

  // Styles
  const containerStyle = {
    maxWidth: 1500,
    margin: "20px auto",
    fontFamily: "'Times New Roman', Times, serif",
    gap: '20px',  
    padding: '30px',
    background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
    borderRadius: '16px',
    boxShadow: '0 6px 16px rgba(0, 100, 34, 0.15)',
    transition: 'all 0.3s ease',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: 30,
    fontSize: isMobile ? "1.8rem" : "2.6rem",
    fontWeight: 700,
    color: "#2c5d30",
  };

  const filterButtonStyle = (btn) => ({
    minWidth: 120,
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
    backgroundColor: filter === btn ? "#ffa500" : "#2c5d30",
  });

  const tableContainer = {
    overflowX: "auto",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: 800 };
  const thTdStyle = { border: "1px solid #2c5d30", padding: 10, fontSize: 14 };
  const tableHeader = { backgroundColor: "#2c5d30", color: "#fff", fontWeight: 600 };
  const buttonStyle = { padding: "6px 10px", margin: "2px", borderRadius: 5, border: "none", cursor: "pointer", fontWeight: "600", fontSize: 13 };

  return (
    <div style={containerStyle}>
      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <img src="/images/logo.PNG" alt="NetLanka Logo" style={{ maxWidth: 100, height: "auto" }} />
      </div>

      <h3 style={headerStyle}>Admin Custom Tour Management</h3>

      {/* Filter Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button key={f} style={filterButtonStyle(f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <button
          onClick={exportToExcel}
          style={{ ...buttonStyle, backgroundColor: "#558b2f", color: "#fff", display: "flex", alignItems: "center", gap: 5, width: 180 }}
        >
          <FaFileExcel size={18} /> Export Excel
        </button>
        <button
          onClick={exportToPDF}
          style={{ ...buttonStyle, backgroundColor: "#ffa500", color: "#fff", display: "flex", alignItems: "center", gap: 5, width: 180 }}
        >
          <FaFilePdf size={18} /> Export PDF
        </button>
      </div>

      {/* Table */}
      <div style={tableContainer}>
        <table style={tableStyle}>
        <thead style={tableHeader}>
  <tr>
    {["Name", "Email", "Phone", "Preferences", "Duration", "Budget", "Vehicle", "Pickup Location", "Pickup Date", "Pickup Time", "Status", "Actions"].map((h) => (
      <th key={h} style={thTdStyle}>{h}</th>
    ))}
  </tr>
</thead>
<tbody>
  {filteredTours.length === 0 ? (
    <tr>
      <td colSpan={13} style={{ textAlign: "center", padding: 10 }}>No requests found.</td>
    </tr>
  ) : (
    filteredTours.map((t) => {
      const status = t.status || "pending";
      let rowBg = "#fff3cd"; // pending
      if (status === "approved") rowBg = "#d0f0c0";
      if (status === "rejected") rowBg = "#f8d7da";

      return (
        <tr key={t._id} style={{ backgroundColor: rowBg }}>
          <td style={thTdStyle}>{t.name}</td>
          <td style={thTdStyle}>{t.email}</td>
          <td style={thTdStyle}>{t.phone}</td>
          <td style={thTdStyle}>{t.preferences}</td>
          <td style={thTdStyle}>{t.duration}</td>
          <td style={thTdStyle}>{t.budget}</td>
          <td style={thTdStyle}>{t.vehicle || "N/A"}</td>
          <td style={thTdStyle}>{t.pickupLocation || "N/A"}</td>
          <td style={thTdStyle}>{t.pickupDate ? new Date(t.pickupDate).toLocaleDateString() : "N/A"}</td>
          <td style={thTdStyle}>{t.pickupTime || "N/A"}</td>
          <td style={thTdStyle}>{status.toUpperCase()}</td>
          <td style={thTdStyle}>
  {status === "pending" && (
    <>
      <button
        style={{ ...buttonStyle, backgroundColor: "#558b2f", color: "#fff", marginRight: 5 }}
        onClick={() =>
          axios.put(`http://localhost:5000/api/customTours/${t._id}`, { status: "approved" }).then(fetchTours)
        }
      >
        Approve
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: "#f44336", color: "#fff", marginRight: 5 }}
        onClick={() =>
          axios.put(`http://localhost:5000/api/customTours/${t._id}`, { status: "rejected" }).then(fetchTours)
        }
      >
        Reject
      </button>
    </>
  )}
  {(status === "approved" || status === "rejected") && (
    <button
      style={{ ...buttonStyle, backgroundColor: "#f0e68c", color: "#000", marginRight: 5 }}
      onClick={() =>
        axios.put(`http://localhost:5000/api/customTours/${t._id}`, { status: "pending" }).then(fetchTours)
      }
    >
      Reset
    </button>
  )}
  {/* ✅ Delete Button */}
  <button
    style={{ ...buttonStyle, backgroundColor: "#d32f2f", color: "#fff" }}
    onClick={() => {
      if (confirm("Are you sure you want to delete this request?")) {
        axios
          .delete(`http://localhost:5000/api/customTours/${t._id}`)
          .then(fetchTours)
          .catch((err) => alert("Failed to delete request"));
      }
    }}
  >
    Delete
  </button>
</td>

        </tr>
      );
    })
  )}
</tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <form onSubmit={handleEditSubmit} style={{ backgroundColor: "#fff", padding: 20, borderRadius: 12, width: isMobile ? "90%" : 400, display: "flex", flexDirection: "column" }}>
            <h3>Edit Custom Tour Request</h3>
            <label>Preferences</label>
            <textarea name="preferences" value={editForm.preferences} onChange={handleEditChange} style={{ marginBottom: 10, padding: 8 }} />
            <label>Duration</label>
            <input type="text" name="duration" value={editForm.duration} onChange={handleEditChange} style={{ marginBottom: 10, padding: 8 }} />
            <label>Budget</label>
            <input type="text" name="budget" value={editForm.budget} onChange={handleEditChange} style={{ marginBottom: 10, padding: 8 }} />
            <button type="submit" style={{ ...buttonStyle, backgroundColor: "#558b2f", color: "#fff", marginBottom: 10 }}>Save</button>
            <button type="button" onClick={closeEdit} style={{ ...buttonStyle, backgroundColor: "#f0e68c", color: "#000" }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCustomTour;

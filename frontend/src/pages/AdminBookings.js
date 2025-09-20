import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("tours"); // tours | transport | floatingBooking
  const [filterTours, setFilterTours] = useState("all");
  const [filterTransport, setFilterTransport] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/page/${source}`);
        console.log("Fetched bookings:", res.data);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, [source]);
  

  // ---------------- Actions ----------------
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Current filter per source
  const currentFilter = source === "tours" ? filterTours : filterTransport;

  const filteredBookings =
    currentFilter === "all"
      ? bookings
      : bookings.filter(b => b.status === currentFilter);

  // ---------------- Styles ----------------
  const containerStyle = {
    maxWidth: 1500,
    margin: "20px auto",
    fontFamily: "'Times New Roman', Times, serif",
    gap: "20px",
    padding: "30px",
    background: "linear-gradient(135deg, #c8f5d9, #4caf50)",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)",
    justifyContent: "center",
    alignItems: "center"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: 30,
    fontSize: isMobile ? "1.8rem" : "2.6rem",
    fontWeight: 700,
    color: "#2c5d30"
  };

  const sourceButtonStyle = (btn) => ({
    minWidth: 150,
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "'Times New Roman', Times, serif",
    transition: "all 0.3s",
    backgroundColor: source === btn ? "#ffa500" : "#2c5d30",
    marginBottom: 10
  });

  const filterButtonStyle = (btn) => ({
    minWidth: 120,
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "'Times New Roman', Times, serif",
    transition: "all 0.3s",
    backgroundColor: currentFilter === btn ? "#ffa500" : "#2c5d30",
    marginBottom: 10
  });

  const tableContainer = {
    overflowX: "auto",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };

  const thTdStyle = { border: "1px solid #2c5d30", padding: "10px", textAlign: "left", fontSize: 14 };

  const actionButtonStyle = (bg) => ({
    backgroundColor: bg,
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: 5,
    cursor: "pointer",
    marginRight: 5
  });

  // ---------------- Render ----------------
  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <img src="/images/logo.PNG" alt="NetLanka Logo" style={{ maxWidth: 100, height: "auto", objectFit: "contain" }} />
      </div>

      <h3 style={headerStyle}>Admin Bookings Management</h3>

      {/* Source Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <button style={sourceButtonStyle("tours")} onClick={() => setSource("tours")}>Tours / Floating Booking</button>
        <button style={sourceButtonStyle("transport")} onClick={() => setSource("transport")}>Transport Booking</button>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {["all", "pending", "completed"].map(f => (
          <button
            key={f}
            style={filterButtonStyle(f)}
            onClick={() => source === "tours" ? setFilterTours(f) : setFilterTransport(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={tableContainer}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p style={{ textAlign: "center" }}>No bookings found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead style={{ backgroundColor: "#2c5d30", color: "#fff", fontWeight: 600 }}>
              <tr>
                <th style={thTdStyle}>Date</th>
                <th style={thTdStyle}>Name</th>
                <th style={thTdStyle}>Email</th>
                <th style={thTdStyle}>Phone</th>
                <th style={thTdStyle}>{source === "tours" ? "Tour" : "Vehicle"}</th>
                <th style={thTdStyle}>Location</th>
                {source === "transport" && <th style={thTdStyle}>Pickup Location</th>}
                {source === "transport" && <th style={thTdStyle}>Drop Location</th>}
                <th style={thTdStyle}>Members</th>
                <th style={thTdStyle}>Pickup Date</th>
                <th style={thTdStyle}>Pickup Time</th>
                <th style={thTdStyle}>Total (LKR)</th>
                <th style={thTdStyle}>Status</th>
                <th style={thTdStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => (
                <tr key={b._id} style={{ backgroundColor: b.status === "completed" ? "#d0f0c0" : "transparent" }}>
                  <td style={thTdStyle}>{new Date(b.createdAt).toLocaleString()}</td>
                  <td style={thTdStyle}>{b.name}</td>
                  <td style={thTdStyle}>{b.email}</td>
                  <td style={thTdStyle}>{b.phone}</td>
                  <td style={thTdStyle}>{source === "tours" ? b.tourTitle : b.vehicle}</td>
                  <td style={thTdStyle}>{b.location}</td>
                  {source === "transport" && <td style={thTdStyle}>{b.pickupLocation}</td>}
                  {source === "transport" && <td style={thTdStyle}>{b.dropLocation}</td>}
                  <td style={thTdStyle}>{b.members}</td>
                  <td style={thTdStyle}>{b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : ""}</td>
                  <td style={thTdStyle}>{b.pickupTime}</td>
                  <td style={thTdStyle}>{b.total}</td>
                  <td style={thTdStyle}>{b.status.toUpperCase()}</td>
                  <td style={thTdStyle}>
                    <button style={actionButtonStyle("#4caf50")} onClick={() => updateStatus(b._id, "completed")}>Completed</button>
                    <button style={actionButtonStyle("#ff9800")} onClick={() => updateStatus(b._id, "pending")}>Pending</button>
                    <button style={actionButtonStyle("#f44336")} onClick={() => deleteBooking(b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

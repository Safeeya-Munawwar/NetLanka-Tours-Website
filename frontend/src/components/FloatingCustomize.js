// src/components/FloatingCustomize.js
import React, { useState } from "react";
import axios from "axios";

const FloatingCustomize = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferences: "",
    duration: "",
    budget: "",
    vehicle: "",         // optional transport
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/customTours", form);
      alert("Your customization request has been sent successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        preferences: "",
        duration: "",
        budget: "",
        vehicle: "",
        pickupLocation: "",
        pickupDate: "",
        pickupTime: "",
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send customization request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
    padding: "15px",
  };

  const modalForm = {
    background: "#fff",
    padding: "25px 30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
    borderTop: "5px solid #2e7d32",
    maxHeight: "90vh",   // 👈 limit modal height
    overflowY: "auto",   // 👈 scroll inside modal
  };

  const inputStyle = {
    marginBottom: "12px", padding: "10px"
  };

  const submitButton = {
    background: "#2e7d32",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    marginBottom: "8px",
  };

  const cancelButton = {
    background: "#ccc",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          right: "20px",
          background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
          color: "white",
          padding: "14px 20px",
          borderRadius: "50px",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          zIndex: 2000,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          fontFamily: "'Times New Roman', Times, serif",
        }}
        onClick={() => setOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
        }}
      >
        ✒️ <span>Customize a Tour</span>
      </div>

      {open && (
        <div style={modalOverlay} onClick={() => setOpen(false)}>
          <form
            style={modalForm}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2 style={{ marginBottom: "15px", color: "#2e7d32" }}>Customize Your Tour</h2>

            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
               <label>Email:</label>         
              <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={form.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <label>Preferred Destinations / Preferences:</label>
            <textarea
  name="preferences"
  placeholder="Preferred Destinations / Preferences"
  value={form.preferences}
  onChange={handleChange}
  style={{ 
    ...inputStyle, 
    height: 140,          // 👈 increased height
    resize: "vertical",   // 👈 allow vertical resize
    minHeight: 100
  }}
/>
            <label>Duration (Days):</label>
            <input
              type="number"
              name="duration"
              placeholder="Duration (days)"
              value={form.duration}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Budget (LKR):</label>
            <input
              type="number"
              name="budget"
              placeholder="Budget (LKR)"
              value={form.budget}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Preferred Vehicle:</label>
            <input
              type="text"
              name="vehicle"
              placeholder="Preferred Vehicle (Car / Van / Bus)"
              value={form.vehicle}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Pickup Location:</label>
            <input
              type="text"
              name="pickupLocation"
              placeholder="Pickup Location"
              value={form.pickupLocation}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Pickup Date:</label>
            <input
              type="date"
              name="pickupDate"
              placeholder="Pickup Date"
              value={form.pickupDate}
              onChange={handleChange}
              style={inputStyle}
            />
            <label>Pickup Time:</label>
            <input
              type="time"
              name="pickupTime"
              placeholder="Pickup Time"
              value={form.pickupTime}
              onChange={handleChange}
              style={inputStyle}
            />

            <button type="submit" style={submitButton} disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
            <button
              type="button"
              style={cancelButton}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingCustomize;

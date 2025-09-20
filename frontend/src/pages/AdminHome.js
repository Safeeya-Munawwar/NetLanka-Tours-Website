import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000"; // change if your backend runs elsewhere

function AdminHome() {
  const [contentData, setContentData] = useState({
    title: "",
    intro: "",
    description: "",
    contact: "",
    email: "",
    address: "",
    stats: [],
    transport: [],
  });
  const [popup, setPopup] = useState("");
  const [newTransport, setNewTransport] = useState({
    name: "",
    file: null,
    details: "",
  });
  

  // ----------------- Load content from backend -----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/home-content`);
        const data = res.data;

        setContentData({
          title: data.title || "",
          intro: data.intro || "",
          description: data.description || "",
          contact: data.contact || "",
          email: data.email || "",
          address: data.address || "",
          stats: Array.isArray(data.stats) ? data.stats : [],
          transport: Array.isArray(data.transport)
            ? data.transport.map((t) => ({
                ...t,
                imgPreview: t.img ? `${BACKEND_URL}${t.img}` : "",
              }))
            : [],
        });
      } catch (err) {
        console.error("Failed to load admin content", err);
      }
    };

    fetchData();
  }, []);

  // ----------------- Handlers -----------------
  const handleInputChange = (field, value) => {
    setContentData({ ...contentData, [field]: value });
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...contentData.stats];
    updatedStats[index][field] = value;
    setContentData({ ...contentData, stats: updatedStats });
  };

  const handleDeleteTransport = (index) => {
    const updatedTransport = [...contentData.transport];
    updatedTransport.splice(index, 1);
    setContentData({ ...contentData, transport: updatedTransport });
  };

  const handleSave = async () => {
    try {
      const sanitizedStats = contentData.stats.map((s) => ({
        number: String(s.number || ""),
        label: String(s.label || ""),
      }));

      const formData = new FormData();
      formData.append("title", contentData.title);
      formData.append("intro", contentData.intro);
      formData.append("description", contentData.description);
      formData.append("contact", contentData.contact);
      formData.append("email", contentData.email);
      formData.append("address", contentData.address);
      formData.append("stats", JSON.stringify(sanitizedStats));

      contentData.transport.forEach((t, index) => {
        if (t.file) formData.append("transportFiles", t.file);
        formData.append(
          `transport[${index}]`,
          JSON.stringify({ name: t.name, details: t.details })
        );
      });

      await axios.put(`${BACKEND_URL}/api/home-content`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPopup("Content Updated Successfully!");
      setTimeout(() => setPopup(""), 2000);
    } catch (err) {
      console.error("Update failed", err);
      setPopup("Failed to update content.");
      setTimeout(() => setPopup(""), 2000);
    }
  };

  // ----------------- Focus/Blur styling -----------------
  const handleFocus = (e) => (e.currentTarget.style.borderColor = "#2e7d32");
  const handleBlur = (e) => (e.currentTarget.style.borderColor = "#a5d6a7");

  // ----------------- JSX -----------------
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Admin Home Management</h2>

      {/* Title, Intro, Description, Contact, Email, Address */}
      {["title", "intro", "description", "contact", "email", "address"].map((field, idx) => (
        <label key={idx} style={labelStyle}>
          {field.charAt(0).toUpperCase() + field.slice(1)}:
          {field === "intro" || field === "description" ? (
            <textarea
              rows={field === "intro" ? 3 : 6}
              value={contentData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          ) : (
            <input
              type="text"
              value={contentData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </label>
      ))}

      {/* Stats */}
      <h3 style={subHeadingStyle}>Stats</h3>
      {contentData.stats.length === 0 && <p style={italicStyle}>No stats available</p>}
      {contentData.stats.map((stat, i) => (
        <div key={i} style={statRowStyle}>
          <input
            type="text"
            placeholder="Number"
            value={stat.number}
            onChange={(e) => handleStatChange(i, "number", e.target.value)}
            style={statInputNumberStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <input
            type="text"
            placeholder="Label"
            value={stat.label}
            onChange={(e) => handleStatChange(i, "label", e.target.value)}
            style={statInputLabelStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      ))}

      {/* Transport */}
{/* Transport Section */}
<h3 style={subHeadingStyle}>Transport Options</h3>
<div style={transportBoxStyle}>
  {/* Fields to add/edit transport */}
  <div style={transportInputRowStyle}>
  <input
  type="text"
  placeholder="Vehicle Name"
  style={inputStyle}
  value={newTransport.name}
  onChange={(e) =>
    setNewTransport({ ...newTransport, name: e.target.value })
  }
/>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setNewTransport({ ...newTransport, file: e.target.files[0] })
  }
/>

<input
  type="text"
  placeholder="Details"
  style={inputStyle}
  value={newTransport.details}
  onChange={(e) =>
    setNewTransport({ ...newTransport, details: e.target.value })
  }
/>

<button
  type="button"
  style={addButtonStyle}
  onClick={() => {
    if (!newTransport.name && !newTransport.details) return;
    setContentData({
      ...contentData,
      transport: [...contentData.transport, newTransport],
    });
    setNewTransport({ name: "", file: null, details: "" }); // reset form
  }}
>
  Add Transport
</button>
  </div>

  {/* Existing transport grid */}
  <div style={transportGridStyle}>
    {contentData.transport.length === 0 && (
      <p style={italicStyle}>No transport options</p>
    )}
    {contentData.transport.map((t, i) => (
      <div key={i} style={transportCardStyle}>
        {t.imgPreview && (
          <img
            src={t.imgPreview}
            alt={t.name}
            style={transportImageStyle}
          />
        )}
        <h4 style={{ margin: "10px 0 5px" }}>{t.name}</h4>
        <p style={{ fontSize: 14, color: "#333" }}>{t.details}</p>
        <button
          type="button"
          onClick={() => handleDeleteTransport(i)}
          style={deleteButtonStyle}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
</div>

      <button type="button" style={saveButtonStyle} onClick={handleSave}>
        Save Changes
      </button>

      {/* Popup */}
      {popup && (
        <div
          style={{
            ...popupStyle,
            backgroundColor: popup.includes("Successfully") ? "#4CAF50" : "#d32f2f",
          }}
        >
          {popup}
        </div>
      )}
    </div>
  );
}

// ----------------- Styles -----------------
const containerStyle = {
  maxWidth: 1200,
  margin: "20px auto",
  padding: "30px",
  backgroundColor: "#e8f5e9",
  borderRadius: 16,
  fontFamily: "'Times New Roman', Times, serif",
};
const headingStyle = { textAlign: "center", fontSize: 28, fontWeight: "700", marginBottom: 20 };
const subHeadingStyle = { fontSize: 20, fontWeight: "600", marginTop: 30, marginBottom: 10, color: "#1b5e20" };
const labelStyle = { display: "block", marginTop: 15, marginBottom: 6, fontWeight: 600 };
const inputStyle = { width: "100%", padding: 10, borderRadius: 6, border: "1px solid #a5d6a7", marginBottom: 8, boxSizing: "border-box" };
const statRowStyle = { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 };
const statInputNumberStyle = { ...inputStyle, flex: "1 1 100px" };
const statInputLabelStyle = { ...inputStyle, flex: "2 1 150px" };
const deleteButtonStyle = { padding: "6px 12px", backgroundColor: "#d32f2f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const addButtonStyle = { padding: "12px 20px", backgroundColor: "#388e3c", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold", marginBottom: 20 };
const saveButtonStyle = { padding: "12px 20px", backgroundColor: "#2e7d32", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" };
const popupStyle = { position: "fixed", top: 20, right: 20, padding: "12px 20px", borderRadius: 6, color: "#fff", zIndex: 9999, fontWeight: "bold" };
const italicStyle = { fontStyle: "italic", color: "#4a6b39" };
const transportBoxStyle = {
  border: "2px solid #a5d6a7",
  borderRadius: 12,
  padding: 20,
  backgroundColor: "#f1f8e9",
  marginBottom: 20,
};

const transportInputRowStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: 20,
};

const transportGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: 15,
};

const transportCardStyle = {
  border: "1px solid #c8e6c9",
  borderRadius: 12,
  padding: 10,
  textAlign: "center",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
  cursor: "pointer",
};

const transportImageStyle = {
  width: "100%",
  height: 100,
  objectFit: "cover",
  borderRadius: 8,
  marginBottom: 10,
};


export default AdminHome;

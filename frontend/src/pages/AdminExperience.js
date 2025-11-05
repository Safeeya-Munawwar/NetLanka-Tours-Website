import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: null,
  });
  const [editing, setEditing] = useState(false);
  const formRef = useRef(null);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 2000);
  };

  const fetchExperiences = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/experiences");
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/experiences/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Experience Updated!", "success");
      } else {
        await axios.post("http://localhost:5000/api/experiences", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Experience Added!", "success");
      }
      setFormData({ id: "", title: "", description: "", image: null });
      setEditing(false);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      showPopup("Failed to save experience.", "error");
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      id: exp._id,
      title: exp.title,
      description: exp.description,
      image: null,
    });
    setEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/experiences/${id}`);
      fetchExperiences();
      showPopup("Experience Deleted!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Delete failed.", "error");
    }
  };

  const styles = {
    form: {
      maxWidth: 600,
      margin: "20px auto",
      padding: 20,
      background: "#f9f9f9",
      borderRadius: 10,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    input: {
      width: "100%",
      padding: 10,
      margin: "10px 0",
      borderRadius: 5,
      border: "1px solid #ccc",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    button: {
      backgroundColor: "#1b5e20",
      color: "#fff",
      padding: "10px 15px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      marginRight: 10,
      width: 200,
    },
    cancelButton: {
      backgroundColor: "#c0392b",
      color: "#fff",
      padding: "10px 15px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      width: 200,
    },
  };

  return (
    <div style={{ maxWidth: 1500, margin: "20px", fontFamily: "Times New Roman", padding: "30px", background: "linear-gradient(135deg, #d7e8ff, #2196f3)", borderRadius: 16 }}>
      <h3 style={{ textAlign: "center", marginBottom: 40, fontSize: "2.6rem", color: "#0d47a1" }}>
        Admin Experience Management
      </h3>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ textAlign: "center", color: "#0d47a1" }}>
          {editing ? "Edit Experience" : "Add New Experience"}
        </h2>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Experience Title" required style={styles.input} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" style={styles.input} />
        <input type="file" name="image" onChange={handleChange} style={{ marginBottom: 10 }} />
        <div style={{ textAlign: "center", marginTop: 10, display: "flex", justifyContent: "center", gap: 10 }}>
          <button type="submit" style={styles.button}>{editing ? "Update" : "Add"}</button>
          <button type="button" onClick={() => { setEditing(false); setFormData({ id: "", title: "", description: "", image: null }); }} style={styles.cancelButton}>Cancel</button>
        </div>
      </form>

      {/* Experiences Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: 20 }}>
        {experiences.map((exp) => (
          <div key={exp._id} style={{ background: "#fff", padding: 15, borderRadius: 10, border: "3px solid #1565c0", textAlign: "center" }}>
            {exp.imageUrl && <img src={`http://localhost:5000${exp.imageUrl}`} alt={exp.title} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />}
            <h3 style={{ fontSize: 18 }}>{exp.title}</h3>
            <p style={{ fontSize: 14, color: "#555" }}>{exp.description}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={() => handleEdit(exp)} style={{ flex: 1, backgroundColor: "#64b5f6", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>Edit</button>
              <button onClick={() => handleDelete(exp._id)} style={{ flex: 1, backgroundColor: "#ef5350", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {popup && <div style={{ position: "fixed", top: 20, right: 20, backgroundColor: popupType === "success" ? "#4CAF50" : "#d32f2f", color: "#fff", padding: "12px 20px", borderRadius: 6, zIndex: 9999, fontWeight: "bold" }}>{popup}</div>}
    </div>
  );
};

export default AdminExperience;

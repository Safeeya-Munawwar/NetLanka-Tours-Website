import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AdminDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
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

  const fetchDestinations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDestinations();
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
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editing) {
        await axios.put(
          `http://localhost:5000/api/destinations/${formData.id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showPopup("Destination Updated!", "success");
      } else {
        await axios.post("http://localhost:5000/api/destinations", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Destination Added!", "success");
      }
      setFormData({ id: "", name: "", description: "", category: "", image: null });
      setEditing(false);
      fetchDestinations();
    } catch (err) {
      console.error(err);
      showPopup("Failed to save destination.", "error");
    }
  };

  const handleEdit = (dest) => {
    setFormData({
      id: dest._id,
      name: dest.name,
      description: dest.description,
      category: dest.category || "",
      image: null,
    });
    setEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/destinations/${id}`);
      fetchDestinations();
      showPopup("Destination Deleted!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Delete failed.", "error");
    }
  };

  const categories = [
    "Beach",
    "Hill Country",
    "Wildlife Safari",
    "Cultural Heritage",
    "Adventure",
    "City & Urban",
  ];

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
    <div
      style={{
        maxWidth: 1500,
        margin: "20px",
        fontFamily: "'Times New Roman', Times, serif",
        gap: "20px",
        padding: "30px",
        background: "linear-gradient(135deg, #c8f5d9, #4caf50)",
        borderRadius: "16px",
        boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/images/logo.PNG" alt="NetLanka Logo" style={{ maxWidth: "100px" }} />
      </div>

      <h3
        style={{
          textAlign: "center",
          marginBottom: 40,
          fontSize: "2.6rem",
          fontWeight: 700,
          color: "#2c5d30",
        }}
      >
        Admin Destination Management
      </h3>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ textAlign: "center", color: "#1b5e20" }}>
          {editing ? "Edit Destination" : "Add New Destination"}
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Destination Name"
          required
          style={styles.input}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="3"
          style={styles.input}
        />

        <input type="file" name="image" onChange={handleChange} style={{ marginBottom: 10 }} />

        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            display: "flex",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <button type="submit" style={styles.button}>
            {editing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setFormData({ id: "", name: "", description: "", category: "", image: null });
            }}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Grid Grouped by Category */}
      {categories.map((cat) => {
        const filtered = destinations.filter((d) => d.category === cat);
        if (filtered.length === 0) return null;
        return (
          <div key={cat} style={{ marginTop: 40 }}>
            <h2 style={{ color: "#1b5e20", borderBottom: "2px solid #2e7d32" }}>{cat}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginTop: 20,
              }}
            >
              {filtered.map((dest) => (
                <div
                  key={dest._id}
                  style={{
                    background: "#fff",
                    padding: 15,
                    borderRadius: 10,
                    border: "3px solid #2e7d32",
                    textAlign: "center",
                  }}
                >
                  {dest.imageUrl && (
                    <img
                      src={`http://localhost:5000${dest.imageUrl}`}
                      alt={dest.name}
                      style={{
                        width: "100%",
                        height: 140,
                        objectFit: "cover",
                        borderRadius: 8,
                        marginBottom: 10,
                      }}
                    />
                  )}
                  <h3 style={{ fontSize: 18 }}>{dest.name}</h3>
                  <p style={{ fontSize: 14, color: "#555" }}>{dest.description}</p>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => handleEdit(dest)}
                      style={{
                        flex: 1,
                        backgroundColor: "#81C784",
                        border: "none",
                        padding: 8,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dest._id)}
                      style={{
                        flex: 1,
                        backgroundColor: "#E57373",
                        border: "none",
                        padding: 8,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {popup && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            backgroundColor: popupType === "success" ? "#4CAF50" : "#d32f2f",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 6,
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          {popup}
        </div>
      )}
    </div>
  );
};

export default AdminDestination;

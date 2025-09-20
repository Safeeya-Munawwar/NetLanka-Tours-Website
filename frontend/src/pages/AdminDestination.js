import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AdminDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
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
    setTimeout(() => setPopup(""), 2000); // Popup disappears after 2 seconds
  };

  
  // Fetch all destinations
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
      setFormData({ id: "", name: "", description: "", image: null });
      setEditing(false);
      fetchDestinations();
    } catch (err) {
      console.error(err);
      showPopup("Failed to save destination.", "error");
    }
  };

  const handleEdit = (dest) => {
    setFormData({ id: dest._id, name: dest.name, description: dest.description, image: null });
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

  const styles = {
  form: { maxWidth: 600, margin: "20px auto", padding: 20, background: "#f9f9f9", borderRadius: 10, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
    input: { width: "100%", padding: 10, margin: "10px 0", borderRadius: 5, border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box" },
    button: { backgroundColor: "#1b5e20", color: "#fff", padding: "10px 15px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 10, width: 200 },
    cancelButton: { backgroundColor: "#c0392b", color: "#fff", padding: "10px 15px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: "bold", width: 200  },
    card: { position: "relative", background: "#fff", padding: 15, borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", width: 280,   border: "3px solid #2e7d32" },
    image: { width: "100%", height: 180, objectFit: "cover", borderRadius: 8 },
    info: { margin: "5px 0", fontSize: "1rem" },
    cardButtons: { marginTop: 10, display: "flex", gap: 10 },
    editBtn: { flex: 1, backgroundColor: "#81C784", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
    deleteBtn: { flex: 1, backgroundColor: "#E57373", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",   
    gap: "20px",
  }
  
  };

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
        fontSize: "2.6rem",
        fontWeight: 700,
        color: "#2c5d30",
      }}
    >
      Admin Destination Management
    </h3>

      {/* Form */}
      <div style={{ margin: "0 auto" }}>
      <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ textAlign: "center", color: "#1b5e20" }}>{editing ? "Edit Destination" : "Add New Destination"}</h2>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Destination Name" required style={styles.input} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" style={styles.input} />
        <input type="file" name="image" onChange={handleChange} style={{ marginBottom: 10 }} />
        <div style={{ textAlign: "center", marginTop: 10, display: "flex", justifyContent: "center", gap: 10 }}>
  <button type="submit" style={styles.button}>
    {editing ? "Update" : "Add"}
  </button>

  <button
    type="button"
    onClick={() => {
      setEditing(false);
      setFormData({ id: "", name: "", description: "", image: null });
    }}
    style={styles.cancelButton}
  >
    Cancel
  </button>
</div>


      </form>

      {/* Destinations Grid */}
 
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // responsive width
    gap: "20px",
    justifyContent: "center",
    marginTop: 30,
  }}
>
  {destinations.map((dest) => (
    <div
      key={dest._id}
      style={{
        background: "#fff",
        padding: 15,
        borderRadius: 10,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        border: "3px solid #2e7d32",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 220, // ensures uniform card size
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
      <h3 style={{ margin: "5px 0", fontSize: 18 }}>{dest.name}</h3>
      <p style={{ fontSize: 14, color: "#555", flexGrow: 1 }}>{dest.description}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 10, width: "100%" }}>
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

export default AdminDestination;

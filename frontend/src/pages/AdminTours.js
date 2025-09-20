import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import "./AdminTours.css"; // For slide animation

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSpecial, setIsSpecial] = useState(false);
  const [price, setPrice] = useState("");
  const [type, setType] = useState("day");
  const [editId, setEditId] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const formRef = useRef(null);
  const [popup, setPopup] = useState(""); // popup message
  const [popupType, setPopupType] = useState("success"); // success or error

  // Filters
  const [mainFilter, setMainFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");

  // Itinerary visibility per tour
  const [itineraryVisibility, setItineraryVisibility] = useState({});

  const isMobile = window.innerWidth <= 768;

  // Add at the top with other useState
const [transport, setTransport] = useState([]);
// Replace single price with transportPrices
const [transportPrices, setTransportPrices] = useState({});

// Transport options
const transportOptions = ["Car", "Van", "Bus", "Boat", "Train"]; // You can customize

// Transport icons mapping
const transportIcons = {
  Car: "🚗",
  Van: "🚐",
  Bus: "🚌",
  Boat: "⛴️",
  Train: "🚆",
};

  // Fetch all tours
  const fetchTours = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tours");
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setLocation("");
    setDuration("");
    setRating(0);
    setDescription("");
    setImageFile(null);
    setIsSpecial(false);
    setPrice("");
    setType("day");
    setTransport([]);
    setTransportPrices({});
    setItinerary([]);
    setEditId(null);
  };

  // Add/update tour
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Build FormData
    const formDataObj = new FormData();
    formDataObj.append("title", title);
    formDataObj.append("location", location);
    formDataObj.append("duration", duration);
    formDataObj.append("rating", rating);
    formDataObj.append("description", description);
    formDataObj.append("isSpecial", isSpecial);
    formDataObj.append("price", price);
    formDataObj.append("type", type);
    if (imageFile) formDataObj.append("image", imageFile);
  // In handleSubmit, append transport
formDataObj.append("transport", JSON.stringify(transport));
formDataObj.append("transportPrices", JSON.stringify(transportPrices));
    // ✅ Always append itinerary as JSON string
    formDataObj.append("itinerary", JSON.stringify(itinerary));
  
    try {
      if (editId) {
        // ✅ Use PUT with FormData including itinerary
        await axios.put(`http://localhost:5000/api/tours/${editId}`, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Tour Updated Successfully!", "success");
      } else {
        await axios.post("http://localhost:5000/api/tours", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Tour Added Successfully!", "success");
      }
  
      fetchTours();
      resetForm();
    } catch (error) {
      console.error("Error submitting tour:", error);
      showPopup("Error saving tour.", "error");
    }
  };
  
    // Popup helper
    const showPopup = (message, type = "success") => {
      setPopup(message);
      setPopupType(type);
      setTimeout(() => setPopup(""), 2000); // hide after 2s
    };

  // Edit tour
  const handleEdit = (tour) => {
    setTitle(tour.title);
    setLocation(tour.location);
    setDuration(tour.duration);
    setRating(tour.rating);
    setDescription(tour.description);
    setIsSpecial(tour.isSpecial);
    setPrice(tour.price || "");
    setType(tour.type || "day");
    // In handleEdit, set transport from tour
setTransport(tour.transport || []);
setTransportPrices(tour.transportPrices || {});
    setItinerary(tour.itinerary || []);
    setEditId(tour._id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete tour
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tours/${id}`);
        fetchTours();
        showPopup("Tour Deleted!", "success")
      } catch (error) {
        console.error("Error deleting tour:", error);
        showPopup("Delete failed.", "error");
      }
    }
  };

  // Itinerary functions
  const addItineraryItem = () =>
    setItinerary([...itinerary, { day: itinerary.length + 1, description: "" }]);
  const updateItineraryItem = (index, value) => {
    const updated = [...itinerary];
    updated[index].description = value;
    setItinerary(updated);
  };
  const removeItineraryItem = (index) => {
    const updated = itinerary.filter((_, i) => i !== index);
    setItinerary(updated.map((item, i) => ({ ...item, day: i + 1 })));
  };

  // Toggle itinerary visibility per tour
  const toggleItinerary = (id) => {
    setItineraryVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter tours
  const filteredTours = tours.filter((tour) => {
    if (mainFilter !== "all" && tour.type !== mainFilter) return false;
    if (subFilter === "special") return tour.isSpecial;
    if (subFilter === "regular") return !tour.isSpecial;
    return true;
  });

  const itineraryLinkStyle = {
    display: "inline-flex",
    alignItems: "center",
    color: "#2e7d32",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "color 0.3s",
  };
  
  const arrowStyle = (isOpen) => ({
    display: "inline-block",
    marginLeft: 6,
    transition: "transform 0.3s ease",
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
  });
  
  
  const styles = {
    formStyle: {
      maxWidth: "95%",
      width: "100%",
      margin: "20px auto",
      padding: 20,
      background: "#f9f9f9",
      borderRadius: 10,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    inputStyle: {
      width: "100%",
      padding: 10,
      margin: "10px 0",
      borderRadius: 5,
      border: "1px solid #ccc",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    buttonStyle: {
      backgroundColor: "#2c5d30",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: 5,
      cursor: "pointer",
      marginRight: 10,
      marginTop: 10,
      textAlign: "center",
      width: "100%",
      maxWidth: 120,
    },
    fbuttonStyle: {
      backgroundColor: "#2c5d30",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: 5,
      cursor: "pointer",
      marginRight: 10,
      marginTop: 10,
      textAlign: "center",
      width: "100%",
      maxWidth: 250,
    },
    cbuttonStyle: {
      backgroundColor: "#c0392b",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: 5,
      cursor: "pointer",
      marginRight: 10,
      marginTop: 10,
      textAlign: "center",
      width: "100%",
      maxWidth: 250,
    },
    cardStyle: {
      position: "relative",
      background: "#fff",
      padding: 15,
      borderRadius: 10,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      border: "3px solid #2e7d32", // Dark green border      
    },
    imageStyle: { width: "100%", height: 180, objectFit: "cover", borderRadius: 10 },
    infoStyle: { margin: "5px 0", fontSize: "1rem" },
    itineraryBox: { background: "#eef7ee", padding: 10, borderRadius: 5, marginTop: 10 },
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
          fontSize: isMobile ? "1.8rem" : "2.6rem",
          fontWeight: 700,
          color: "#2c5d30",
        }}
      >
        Admin Tours Management
      </h3>

      {/* Form */}
      <div style={{ margin: "0 auto" }}>
      <form ref={formRef} onSubmit={handleSubmit} style={styles.formStyle}>
        <h2 style={{ color: "#064420", textAlign: "center" }}>{editId ? "Edit Tour" : "Add New Tour"}</h2>
        <label>Title:</label>
        <input style={styles.inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <label>Location:</label>
        <input style={styles.inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required />
        <label>Duration:</label>
        <input style={styles.inputStyle} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" required />
        <label>Type:</label>
        <select style={styles.inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="day">Day Tour</option>
          <option value="round">Round Tour</option>
        </select>
        <label>Rating:</label>
        <input style={styles.inputStyle} type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (0-5)" min="0" max="5" />
        <label>Price per Person (LKR):</label>
        <input style={styles.inputStyle} type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" min="0" />
         {/* ✅ Transport Options with Prices */}
<label>Select Transport Options:</label>
<div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "15px" }}>
  {transportOptions.map((option) => (
    <label key={option} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <input
        type="checkbox"
        checked={transport.includes(option)}
        onChange={(e) => {
          if (e.target.checked) {
            // Add new transport option
            setTransport([...transport, option]);
          } else {
            // Remove transport + its price
            setTransport(transport.filter((t) => t !== option));
            const updatedPrices = { ...transportPrices };
            delete updatedPrices[option];
            setTransportPrices(updatedPrices);
          }
        }}
      />
      {transportIcons[option]} {option}
    </label>
  ))}
</div>

{/* ✅ Show price fields only for selected transports */}
{transport.map((t) => (
  <div key={t} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
    <span style={{ minWidth: "80px" }}>{transportIcons[t]} {t}</span>
    <input
      type="number"
      placeholder={`Price for ${t}`}
      style={styles.inputStyle}
      value={transportPrices[t] || ""}
      onChange={(e) =>
        setTransportPrices({ ...transportPrices, [t]: e.target.value })
      }
    />
  </div>
))}

        <label>Description:</label>
        <textarea style={styles.inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <label>Image:</label>
        <input style={styles.inputStyle} type="file" onChange={(e) => setImageFile(e.target.files[0])} />
    
        {/* Itinerary */}
       
          <label>Itinerary:</label>
          {itinerary.map((item, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <label>Day {item.day}:</label>
              <input
                style={styles.inputStyle}
                value={item.description}
                onChange={(e) => updateItineraryItem(index, e.target.value)}
                placeholder="Description"
              />
              <button type="button" onClick={() => removeItineraryItem(index)} style={{ ...styles.buttonStyle, backgroundColor: "#c0392b", maxWidth: 100 }}>
                Remove
              </button>
            </div>
          ))}
    <button
  type="button"
  onClick={addItineraryItem}
  style={{
    ...styles.buttonStyle,
    maxWidth: 120,        // smaller width
    padding: "6px 10px",  // smaller padding
    fontSize: "0.85rem",  // smaller text
    marginRight: "20px",  // increased right margin
    marginLeft: 20,
  }}  
>
  + Add Day
</button>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1rem", cursor: "pointer", marginTop: 10 }}>
        Special Tour: 
          <input type="checkbox" checked={isSpecial} onChange={() => setIsSpecial(!isSpecial)} style={{ width: 18, height: 18 }} />
        
        </label>

        <div style={{ textAlign: "center" }}>
          <button type="submit" style={styles.fbuttonStyle}>{editId ? "Update" : "Add"}</button>
          <button type="button" onClick={resetForm} style={styles.cbuttonStyle}>Clear</button>
        </div>
      </form>

      {/* Filters */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {["all", "day", "round"].map((f) => (
          <button
            key={f}
            onClick={() => { setMainFilter(f); setSubFilter("all"); }}
            style={{
              width: 120,
              backgroundColor: mainFilter === f ? "#ffa500" : "#2c5d30",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: 5,
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            {f === "all" ? "All Tours" : f === "day" ? "Day Tours" : "Round Tours"}
          </button>
        ))}
      </div>

      {(mainFilter === "day" || mainFilter === "round") && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {["all", "special", "regular"].map((f) => (
            <button
              key={f}
              onClick={() => setSubFilter(f)}
              style={{
                width: 130,
                backgroundColor: subFilter === f ? "#ffa500" : "#2c5d30",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: 5,
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              {f === "all" ? "All" : f === "special" ? "Special" : "Regular"}
            </button>
          ))}
        </div>
      )}

     {/* Tours Grid */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  }}
>
  {filteredTours.map((tour) => (
    <div key={tour._id} style={styles.cardStyle}>
      {tour.isSpecial && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "orange",
            color: "white",
            padding: "5px 10px",
            borderRadius: 5,
          }}
        >
          ⭐ Special
        </div>
      )}
      <img src={`http://localhost:5000${tour.imageUrl}`} alt={tour.title} style={styles.imageStyle} />
      <h3 style={{ margin: "10px 0 5px", color: "#2c5d30" }}>{tour.title}</h3>
      <p style={styles.infoStyle}>📍 {tour.location}</p>
      <p style={styles.infoStyle}>⏱ {tour.duration}</p>
      <p style={styles.infoStyle}>💰 Price per Person - LKR {tour.price}</p>

{/* Transport Options in Grid */}
{tour.transport && tour.transport.length > 0 && (
  <div style={{ marginTop: 6, marginBottom: 6 }}>
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tour.transport.map((t, idx) => {
        const transportPrice = Number(tour.transportPrices?.[t] || 0);
        return (
          <li key={idx} style={{ marginBottom: 4 }}>
            {transportIcons[t] || "❓"} {t} - LKR {transportPrice.toLocaleString()}
          </li>
        );
      })}
    </ul>
  </div>
)}


      <p style={styles.infoStyle}>
        ⭐ {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < tour.rating ? "#ffc107" : "#ddd", fontSize: "1.1rem" }}>★</span>
        ))}
      </p>

      <p style={{ marginTop: 10, color: "#555" }}>{tour.description}</p>

      {/* Collapsible Itinerary */}
      <div style={{ marginTop: 10 }}>
        <span
          onClick={() => toggleItinerary(tour._id)}
          style={itineraryLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1b5e20")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#2e7d32")}
        >
          {itineraryVisibility[tour._id] ? "Hide Itinerary" : "View Itinerary"}
          <span style={arrowStyle(itineraryVisibility[tour._id])}>▶</span>
        </span>

        <CSSTransition
          in={itineraryVisibility[tour._id]}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <div style={{ ...styles.itineraryBox, background: "#d4f4dd", padding: 15, marginTop: 10 }}>
            {tour.itinerary && tour.itinerary.length > 0 ? (
              <ol>
                {tour.itinerary.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 5 }}>
                    <strong>Day {item.day}:</strong> {item.description}
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ color: "#555" }}>No itinerary available.</p>
            )}
          </div>
        </CSSTransition>
      </div>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        <button
          onClick={() => handleEdit(tour)}
          style={{ ...styles.buttonStyle, backgroundColor: "#81C784", width: 100 }}
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(tour._id)}
          style={{ ...styles.buttonStyle, backgroundColor: "#E57373", width: 100 }}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

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
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          {popup}
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminTours;

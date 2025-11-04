import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { CSSTransition } from "react-transition-group";

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState("");
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
  const [transport, setTransport] = useState([]);
  const [transportPrices, setTransportPrices] = useState({});
  const [popup, setPopup] = useState(""); // popup message
  const [popupType, setPopupType] = useState("success"); // success or error
  const [mainFilter, setMainFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [itineraryVisibility, setItineraryVisibility] = useState({});
  const formRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  const transportOptions = ["Car", "Van", "Bus", "Boat", "Train"];
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

  // Fetch all destinations
  const fetchDestinations = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  }, []);

  useEffect(() => {
    fetchTours();
    fetchDestinations();
  }, [fetchTours, fetchDestinations]);

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
    setDestinationId("");
    setEditId(null);
  };

  // Popup helper
  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 2000);
  };

  // Add/update tour
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!destinationId) {
      showPopup("Please select a destination.", "error");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("title", title);
    formDataObj.append("location", location);
    formDataObj.append("duration", duration);
    formDataObj.append("rating", rating);
    formDataObj.append("description", description);
    formDataObj.append("isSpecial", isSpecial);
    formDataObj.append("price", price);
    formDataObj.append("type", type);
    formDataObj.append("destinationId", destinationId);
    if (imageFile) formDataObj.append("image", imageFile);
    formDataObj.append("transport", JSON.stringify(transport));
    formDataObj.append("transportPrices", JSON.stringify(transportPrices));
    formDataObj.append("itinerary", JSON.stringify(itinerary));

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/tours/${editId}`,
          formDataObj,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
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
    setTransport(tour.transport || []);
    setTransportPrices(tour.transportPrices || {});
    setItinerary(tour.itinerary || []);
    setDestinationId(tour.destinationId || "");
    setEditId(tour._id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete tour
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tours/${id}`);
        fetchTours();
        showPopup("Tour Deleted!", "success");
      } catch (error) {
        console.error("Error deleting tour:", error);
        showPopup("Delete failed.", "error");
      }
    }
  };

  // Itinerary functions
  const addItineraryItem = () =>
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, description: "" },
    ]);
  const updateItineraryItem = (index, value) => {
    const updated = [...itinerary];
    updated[index].description = value;
    setItinerary(updated);
  };
  const removeItineraryItem = (index) => {
    const updated = itinerary.filter((_, i) => i !== index);
    setItinerary(updated.map((item, i) => ({ ...item, day: i + 1 })));
  };
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

  const styles = {
    formStyle: {
      maxWidth: "95%",
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
      width: "100%",
      maxWidth: 120,
    },
    cardStyle: {
      position: "relative",
      background: "#fff",
      padding: 15,
      borderRadius: 10,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      border: "3px solid #2e7d32",
    },
    imageStyle: {
      width: "100%",
      height: 180,
      objectFit: "cover",
      borderRadius: 10,
    },
    infoStyle: { margin: "5px 0", fontSize: "1rem" },
    itineraryBox: {
      background: "#eef7ee",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
  };

  return (
    <div
      style={{
        maxWidth: 1500,
        margin: 20,
        padding: 30,
        background: "linear-gradient(135deg, #c8f5d9, #4caf50)",
        borderRadius: 16,
      }}
    >
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
      <form ref={formRef} onSubmit={handleSubmit} style={styles.formStyle}>
        <h2
          style={{
            textAlign: "center",
            color: "#14532d", // same as text-green-900
            fontWeight: 600, // same as font-semibold
            fontSize: "1.5rem", // same as text-2xl
          }}
        >
          {editId ? "Edit Tour" : "Add New Tour"}
        </h2>

        {/* Destination Dropdown */}
        <label>Destination:</label>
        <select
          style={styles.inputStyle}
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          required
        >
          <option value="">Select Destination</option>
          {destinations.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <label>Title:</label>
        <input
          style={styles.inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <label>Location:</label>
        <input
          style={styles.inputStyle}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />

        <label>Duration:</label>
        <input
          style={styles.inputStyle}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration"
          required
        />

        <label>Type:</label>
        <select
          style={styles.inputStyle}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="day">Day Tour</option>
          <option value="round">Round Tour</option>
        </select>

        <label>Rating:</label>
        <input
          style={styles.inputStyle}
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating (0-5)"
          min="0"
          max="5"
        />

        <label>Price per Person (LKR):</label>
        <input
          style={styles.inputStyle}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          min="0"
        />

        {/* Transport Options */}
        <label>Select Transport Options:</label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 15,
            marginBottom: 15,
          }}
        >
          {transportOptions.map((option) => (
            <label
              key={option}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <input
                type="checkbox"
                checked={transport.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) setTransport([...transport, option]);
                  else {
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

        {transport.map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ minWidth: 80 }}>
              {transportIcons[t]} {t}
            </span>
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
        <textarea
          style={styles.inputStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <label>Image:</label>
        <input
          style={styles.inputStyle}
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

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
            <button
              type="button"
              onClick={() => removeItineraryItem(index)}
              style={{
                ...styles.buttonStyle,
                backgroundColor: "#c0392b",
                maxWidth: 100,
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItineraryItem}
          style={{ ...styles.buttonStyle, maxWidth: 120 }}
        >
          + Add Day
        </button>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "1rem",
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          Special Tour:
          <input
            type="checkbox"
            checked={isSpecial}
            onChange={() => setIsSpecial(!isSpecial)}
            style={{ width: 18, height: 18 }}
          />
        </label>

        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            style={{ ...styles.buttonStyle, maxWidth: 250 }}
          >
            {editId ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{
              ...styles.buttonStyle,
              backgroundColor: "#c0392b",
              maxWidth: 250,
            }}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Tours Grid */}
      {/* Filter Section */}
      <div className="flex flex-col items-center mt-4 sm:mt-8">
        {/* Main filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-3">
          {["all", "day", "round"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setMainFilter(f);
                setSubFilter("all"); // reset when main changes
              }}
              className={`w-48 sm:w-60 py-2 rounded font-serif text-white text-sm sm:text-lg transition-colors duration-300 ${
                mainFilter === f
                  ? "bg-orange-500 shadow-md scale-105"
                  : "bg-green-900 hover:bg-green-700"
              }`}
            >
              {f === "all"
                ? "All Tours"
                : f === "day"
                ? "Day Tours"
                : "Round Tours"}
            </button>
          ))}
        </div>

        {/* Sub-filter buttons — only visible for Day or Round tours */}
        {(mainFilter === "day" || mainFilter === "round") && (
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {["all", "special", "regular"].map((f) => (
              <button
                key={f}
                onClick={() => setSubFilter(f)}
                className={`w-40 sm:w-52 px-4 py-2 rounded font-serif text-white text-sm sm:text-md transition-colors duration-300 ${
                  subFilter === f
                    ? "bg-orange-500 shadow-md scale-105"
                    : "bg-green-900 hover:bg-green-700"
                }`}
              >
                {f === "all" ? "All" : f === "special" ? "Special" : "Regular"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tours Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          marginTop: 30,
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
            <img
              src={`http://localhost:5000${tour.imageUrl}`}
              alt={tour.title}
              style={styles.imageStyle}
            />
            <h3 style={{ margin: "10px 0 5px", color: "#2c5d30" }}>
              {tour.title}
            </h3>
            <p style={styles.infoStyle}>📍 {tour.location}</p>
            <p style={styles.infoStyle}>⏱ {tour.duration}</p>
            <p style={styles.infoStyle}>
              💰 Price per Person - LKR {tour.price}
            </p>

            {tour.transport && tour.transport.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {tour.transport.map((t, idx) => (
                  <li key={idx}>
                    {transportIcons[t] || "❓"} {t} - LKR{" "}
                    {Number(tour.transportPrices?.[t] || 0).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}

            <p style={styles.infoStyle}>
              ⭐{" "}
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < tour.rating ? "#ffc107" : "#ddd",
                    fontSize: "1.1rem",
                  }}
                >
                  ★
                </span>
              ))}
            </p>
            <p style={{ marginTop: 10, color: "#555" }}>{tour.description}</p>

            {/* Collapsible Itinerary */}
            <div style={{ marginTop: 10 }}>
              <span
                onClick={() => toggleItinerary(tour._id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: "#2e7d32",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {itineraryVisibility[tour._id]
                  ? "Hide Itinerary"
                  : "View Itinerary"}{" "}
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: 6,
                    transform: itineraryVisibility[tour._id]
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  ▶
                </span>
              </span>

              <CSSTransition
                in={itineraryVisibility[tour._id]}
                timeout={300}
                classNames="slide"
                unmountOnExit
              >
                <div
                  style={{
                    ...styles.itineraryBox,
                    background: "#d4f4dd",
                    padding: 15,
                    marginTop: 10,
                  }}
                >
                  {tour.itinerary && tour.itinerary.length > 0 ? (
                    <ol>
                      {tour.itinerary.map((item, idx) => (
                        <li key={idx}>
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
                style={{
                  ...styles.buttonStyle,
                  backgroundColor: "#81C784",
                  width: 100,
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tour._id)}
                style={{
                  ...styles.buttonStyle,
                  backgroundColor: "#E57373",
                  width: 100,
                }}
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

export default AdminTours;

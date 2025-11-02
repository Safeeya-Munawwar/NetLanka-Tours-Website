import React, { useState, useEffect } from "react";
import axios from "axios";

const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Beach",
    "Hill Country",
    "Wildlife Safari",
    "Cultural Heritage",
    "Adventure",
    "City & Urban",
  ];

  const fetchDestinations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/destinations");
      setDestinations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 50 }}>Loading destinations...</div>;
  }

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "20px auto",
        padding: "20px",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "3rem",
          marginBottom: 40,
          color: "#2e7d32",
          fontWeight: "bold",
        }}
      >
        Explore Destinations
      </h1>

      {categories.map((cat) => {
        const filtered = destinations.filter((d) => d.category === cat);
        if (filtered.length === 0) return null;

        return (
          <div key={cat} style={{ marginBottom: 50 }}>
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: 20,
                color: "#1b5e20",
                borderBottom: "2px solid #4caf50",
                display: "inline-block",
                paddingBottom: 4,
              }}
            >
              {cat}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20,
                marginTop: 20,
              }}
            >
              {filtered.map((dest) => (
                <div
                  key={dest._id}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  {dest.imageUrl && (
                    <img
                      src={`http://localhost:5000${dest.imageUrl}`}
                      alt={dest.name}
                      style={{ width: "100%", height: 180, objectFit: "cover" }}
                    />
                  )}
                  <div style={{ padding: 15 }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: 18, color: "#2e7d32" }}>
                      {dest.name}
                    </h3>
                    <p style={{ fontSize: 14, color: "#555" }}>{dest.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Destination;

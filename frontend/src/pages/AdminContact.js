import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet marker icon
const officeIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Draggable marker
function DraggableMarker({ position, setPosition }) {
  const [markerPos, setMarkerPos] = useState(position);

  useEffect(() => {
    setMarkerPos(position);
  }, [position]);

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPos([lat, lng]);
    setPosition([lat, lng]);
  };

  if (!markerPos) return null;
  return <Marker draggable position={markerPos} eventHandlers={{ dragend: handleDragEnd }} icon={officeIcon} />;
}

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Geocode using OpenStreetMap Nominatim
const geocodeAddress = async (address, setCoordsCallback) => {
  if (!address) return;
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: address, format: "json" },
    });
    if (res.data && res.data.length > 0) {
      const { lat, lon } = res.data[0];
      setCoordsCallback([parseFloat(lat), parseFloat(lon)]);
    }
  } catch (err) {
    console.error("Geocoding failed", err);
  }
};

export default function AdminContact() {
  const [contactInfo, setContactInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 3000);
  };

  const fetchContact = useCallback(async () => {
    try {
      const res = await axios.get("/api/contact");
      const data = res.data;
      setContactInfo({
        ...data,
        corporateCoords: data.corporateCoords || [7.0010, 79.9150],
        regionalCoords: data.regionalCoords || [7.2907, 80.6330],
      });
    } catch (err) {
      console.error(err);
      showPopup("Failed to fetch contact info", "error");
    }
  }, []);

  useEffect(() => {
    fetchContact();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setContactInfo((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleAddressChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const debouncedCorporate = useDebounce(contactInfo?.corporateOffice, 500);
  const debouncedRegional = useDebounce(contactInfo?.regionalOffice, 500);

  useEffect(() => {
    if (!editing) return;
    if (debouncedCorporate) {
      geocodeAddress(debouncedCorporate, coords =>
        setContactInfo(prev => ({ ...prev, corporateCoords: coords }))
      );
    }
  }, [debouncedCorporate, editing]);

  useEffect(() => {
    if (!editing) return;
    if (debouncedRegional) {
      geocodeAddress(debouncedRegional, coords =>
        setContactInfo(prev => ({ ...prev, regionalCoords: coords }))
      );
    }
  }, [debouncedRegional, editing]);

  const handleSave = async () => {
    try {
      await axios.post("/api/contact", contactInfo);
      showPopup("Contact Information Saved Successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      showPopup("Failed to save contact info", "error");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset to default values?")) return;
    try {
      const res = await axios.post("/api/contact/reset");
      setContactInfo(res.data.contact);
      showPopup("Contact Information Reset Successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      showPopup("Failed to reset contact info", "error");
    }
  };

  if (!contactInfo) return <div>Loading...</div>;

  return (
    <div style={container}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/images/logo.PNG" alt="NetLanka Logo" style={logoStyle} />
      </div>

      <h3 style={{ ...heading, fontSize: isMobile ? "1.8rem" : "2.6rem" }}>
        Admin Contact Management
      </h3>

      <div style={card}>
<div style={row}>
  <label style={labelStyle}>Phone:</label>
  <input name="phone" value={contactInfo.phone} onChange={handleChange} disabled={!editing} style={input} />
</div>

<div style={row}>
  <label style={labelStyle}>Email:</label>
  <input name="email" value={contactInfo.email} onChange={handleChange} disabled={!editing} style={input} />
</div>


        <label>
          Corporate Office:
          <textarea
            name="corporateOffice"
            value={contactInfo.corporateOffice}
            onChange={(e) => handleAddressChange("corporateOffice", e.target.value)}
            disabled={!editing}
            rows={3}
            style={input}
          />
        </label>

        <label>
          Regional Office:
          <textarea
            name="regionalOffice"
            value={contactInfo.regionalOffice}
            onChange={(e) => handleAddressChange("regionalOffice", e.target.value)}
            disabled={!editing}
            rows={3}
            style={input}
          />
        </label>

        <fieldset style={fieldset}>
          <legend style={legend}>Social Media Links</legend>
          {Object.entries(contactInfo.socialMedia).map(([platform, url]) => (
            <div key={platform}>
              <label style={socialLabel}>
                {platform} URL:
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleSocialChange(platform, e.target.value)}
                  disabled={!editing}
                  style={input}
                />
              </label>
            </div>
          ))}
        </fieldset>

 {/* Coordinates Section */}
{/* Coordinates */}
<div style={{ ...row, display: "flex", gap: 20, paddingTop: 20 }}>
  <div style={{ flex: "1 1 50%" }}>
    <label style={labelStyle}>Corporate Latitude:</label>
    <input
      type="number"
      value={contactInfo.corporateCoords[0]}
      onChange={(e) =>
        setContactInfo((prev) => ({
          ...prev,
          corporateCoords: [parseFloat(e.target.value), prev.corporateCoords[1]],
        }))
      }
      disabled={!editing}
      style={{ ...input, width: "100%" }}
    />
  </div>
  <div style={{ flex: "1 1 50%" }}>
    <label style={labelStyle}>Corporate Longitude:</label>
    <input
      type="number"
      value={contactInfo.corporateCoords[1]}
      onChange={(e) =>
        setContactInfo((prev) => ({
          ...prev,
          corporateCoords: [prev.corporateCoords[0], parseFloat(e.target.value)],
        }))
      }
      disabled={!editing}
      style={{ ...input, width: "100%" }}
    />
  </div>
</div>

<div style={{ ...row, display: "flex", gap: 20 }}>
  <div style={{ flex: "1 1 50%" }}>
    <label style={labelStyle}>Regional Latitude:</label>
    <input
      type="number"
      value={contactInfo.regionalCoords[0]}
      onChange={(e) =>
        setContactInfo((prev) => ({
          ...prev,
          regionalCoords: [parseFloat(e.target.value), prev.regionalCoords[1]],
        }))
      }
      disabled={!editing}
      style={{ ...input, width: "100%" }}
    />
  </div>
  <div style={{ flex: "1 1 50%" }}>
    <label style={labelStyle}>Regional Longitude:</label>
    <input
      type="number"
      value={contactInfo.regionalCoords[1]}
      onChange={(e) =>
        setContactInfo((prev) => ({
          ...prev,
          regionalCoords: [prev.regionalCoords[0], parseFloat(e.target.value)],
        }))
      }
      disabled={!editing}
      style={{ ...input, width: "100%" }}
    />
  </div>
</div>


        {/* Map */}
        {contactInfo.corporateCoords && contactInfo.regionalCoords && (
          <div style={mapContainer}>
            <MapContainer center={contactInfo.regionalCoords} zoom={8} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <DraggableMarker position={contactInfo.corporateCoords} setPosition={pos => setContactInfo(prev => ({ ...prev, corporateCoords: pos }))} />
              <DraggableMarker position={contactInfo.regionalCoords} setPosition={pos => setContactInfo(prev => ({ ...prev, regionalCoords: pos }))} />
            </MapContainer>
          </div>
        )}

        {/* Buttons */}
        <div style={buttonRow}>
          {!editing ? (
            <>
              <button style={button("#007bff")} onClick={() => setEditing(true)}>Edit</button>
              <button style={button("#dc3545")} onClick={handleReset}>Reset</button>
            </>
          ) : (
            <>
              <button style={button("#28a745")} onClick={handleSave}>Save</button>
              <button style={button("#6c757d")} onClick={() => setEditing(false)}>Cancel</button>
            </>
          )}
        </div>
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
        }}>{popup}</div>
      )}
    </div>
  );
}

// Styles
const container = {
  maxWidth: 1500,
  margin: "20px auto",
  fontFamily: "'Times New Roman', Times, serif",
  gap: 20,
  padding: 30,
  background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
  borderRadius: 16,
  boxShadow: '0 6px 16px rgba(0, 100, 34, 0.15)',
};

const logoStyle = { maxWidth: 100, height: "auto", objectFit: "contain" };
const heading = { textAlign: "center", marginBottom: 40, fontWeight: 700, letterSpacing: "0.04em", color: "#2c5d30" };
const card = { background: "#f4f9f4", borderRadius: 12, padding: 24, boxShadow: "0 6px 14px rgba(0, 128, 0, 0.12)" };
// Remove flex for rows
const row = { display: "block", marginBottom: 20 };

// Update input so it spans full width
const input = { 
  width: "100%", 
  padding: 12, 
  marginTop: 6, 
  borderRadius: 10, 
  border: "2px solid #a4d4a5", 
  fontSize: 16, 
  fontFamily: "'Times New Roman', Times, serif", 
  boxSizing: "border-box", 
  transition: "border-color 0.3s ease" 
};

// Add consistent label styling
const labelStyle = { 
  display: "block", 
  fontWeight: 600, 
  marginBottom: 6, 
  color: "#064420" 
};

const fieldset = { border: "1.5px solid #a4d4a5", borderRadius: 8, padding: 15, marginTop: 20 };
const legend = { fontWeight: 600, color: "#2c5d30" };
const socialLabel = { display: "block", fontWeight: 600, color: "#064420", marginBottom: 12 };
const mapContainer = { height: 400, marginTop: 20, border: "2px solid #a4d4a5", borderRadius: 12, overflow: "hidden" };
const buttonRow = { display: "flex", justifyContent: "center", gap: 12, marginTop: 24, flexWrap: "wrap" };
const button = (bg) => ({ backgroundColor: bg, color: "#fff", padding: "12px 28px", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 16, boxShadow: `0 4px 12px ${bg}80`, transition: "all 0.3s ease", width: 400 });

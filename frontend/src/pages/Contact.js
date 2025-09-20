import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaFacebook, FaYoutube, FaTripadvisor, FaPinterest, FaInstagram, FaGoogle } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "./Contact.css";

const API_BASE = "http://localhost:5000";

const socialMediaMap = {
  Facebook: { icon: <FaFacebook /> },
  Youtube: { icon: <FaYoutube /> },
  Tripadvisor: { icon: <FaTripadvisor /> },
  Pinterest: { icon: <FaPinterest /> },
  Instagram: { icon: <FaInstagram /> },
  Google: { icon: <FaGoogle /> },
};

// Define Leaflet icons with different colors
const blueIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/images/marker-icon-2x-blue.png",
  shadowUrl: process.env.PUBLIC_URL + "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/images/marker-icon-2x-green.png",
  shadowUrl: process.env.PUBLIC_URL + "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/images/marker-icon-2x-red.png",
  shadowUrl: process.env.PUBLIC_URL + "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


// Routing Component
// Routing Component – Collapsible route instructions with toggle icons
const Routing = ({ userLocation, offices }) => {
  const map = useMap();
  const routingRefs = useRef([]);
  const containerId = "instructions-container";

  useEffect(() => {
    if (!userLocation || !map) return;

    // Create instructions container
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.position = "absolute";
      container.style.top = "10px";
      container.style.right = "10px";
      container.style.width = "340px";
      container.style.maxHeight = "460px";
      container.style.overflowY = "auto";
      container.style.background = "#f9fff9";
      container.style.padding = "12px";
      container.style.borderRadius = "12px";
      container.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
      container.style.zIndex = 1000;
      container.style.fontSize = "14px";
      container.style.fontFamily = "'Times New Roman', Times, serif";
      document.querySelector(".leaflet-container")?.appendChild(container);
    }
    container.innerHTML = "";

    // Remove old routing controls safely
    routingRefs.current.forEach(ctrl => {
      if (ctrl) {
        try {
          map.removeControl(ctrl);
        } catch (e) {
          console.warn("Failed to remove routing control:", e);
        }
      }
    });
    routingRefs.current = [];

    // Sort offices by distance
    const sortedOffices = [...offices].sort((a, b) => {
      const distA = map.distance(userLocation, a.coords);
      const distB = map.distance(userLocation, b.coords);
      return distA - distB;
    });

    sortedOffices.forEach(({ name, coords, color }) => {
      if (!coords || coords.length !== 2) return;

      const routing = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(coords[0], coords[1])
        ],
        lineOptions: { styles: [{ color, weight: 5 }] },
        createMarker: (i, wp) => {
          if (!wp?.latLng) return null;

          // Starting point = user
          if (i === 0)
            return L.marker(wp.latLng, { icon: redIcon }).bindPopup("📍 Your Location");

          // Destination = office
          let officeIcon = blueIcon;
          if (name.toLowerCase().includes("corporate")) officeIcon = greenIcon;
          else if (name.toLowerCase().includes("regional")) officeIcon = blueIcon;

          return L.marker(wp.latLng, { icon: officeIcon }).bindPopup(`🏢 ${name}`);
        },
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1"
        }),
        addWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
      }).addTo(map);

      // ✅ Patch _clearLines to avoid null crash
      if (routing._clearLines) {
        const originalClear = routing._clearLines;
        routing._clearLines = function () {
          try {
            originalClear.call(this);
          } catch (err) {
            console.warn("Ignored routing clear error:", err);
          }
        };
      }

      // Listen for route events
      routing
        .on("routesfound", (e) => {
          const route = e.routes[0];
          if (!route) return;

          const distanceKm = (route.summary.totalDistance / 1000).toFixed(1);
          const durationMin = Math.round(route.summary.totalTime / 60);
          const steps = route.instructions || route.legs?.[0]?.steps || [];

          const stepsHtml = steps.map(step => {
            const dist = (step.distance / 1000).toFixed(2);
            let icon = "●";
            if (step.maneuver) {
              const type = step.maneuver.type?.toLowerCase();
              const mod = step.maneuver.modifier?.toLowerCase();
              if (type.includes("turn")) {
                if (mod === "left") icon = "←";
                else if (mod === "right") icon = "→";
                else if (mod === "uturn") icon = "↺";
                else icon = "↪";
              } else if (type.includes("depart")) icon = "▲";
              else if (type.includes("arrive")) icon = "■";
              else if (type.includes("merge")) icon = "⇨";
            }
            return `<li style="margin-bottom:6px; display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed #ccc;">
              <span>${icon} ${step.text}</span><span>${dist} km</span>
            </li>`;
          }).join("");

          container.innerHTML += `
            <div style="border:2px solid #064420; border-radius:10px; padding:10px; margin-bottom:14px; background:#fff;">
              <h4 style="margin-bottom:6px;color:#064420;">🏢 ${name}</h4>
              <p style="margin-bottom:8px;"><strong>Distance:</strong> ${distanceKm} km<br/>
              <strong>ETA:</strong> ${durationMin} min</p>
              <ol style="padding-left:14px; margin:0;">${stepsHtml}</ol>
            </div>
          `;
        })
        .on("routingerror", (e) => {
          console.warn("Routing error for", name, e);
        });

      routingRefs.current.push(routing);
    });

    // Live location update
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const newLoc = [pos.coords.latitude, pos.coords.longitude];
        routingRefs.current.forEach((ctrl, i) => {
          const office = sortedOffices[i];
          if (!ctrl || !ctrl.getPlan || !(office?.coords?.length === 2)) return;
          try {
            ctrl.getPlan().setWaypoints([
              L.latLng(newLoc[0], newLoc[1]),
              L.latLng(office.coords[0], office.coords[1])
            ]);
          } catch (e) {
            console.warn("Failed to update waypoints:", e);
          }
        });
      },
      err => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      routingRefs.current.forEach(ctrl => {
        if (ctrl) {
          try {
            map.removeControl(ctrl);
          } catch (e) {
            console.warn("Failed to remove routing control:", e);
          }
        }
      });
      routingRefs.current = [];
      if (container) container.remove();
    };
  }, [map, userLocation, offices]);

  return null;
};


// Map Legend Component
const MapLegend = ({ userLocation, userLocationName, regionalOfficeCoords, corporateOfficeCoords, regionalOfficeName, corporateOfficeName }) => {
  const map = useMap();
  const panTo = (coords) => { if (coords && coords.length === 2) map.setView(coords, 15, { animate: true }); };

  return (
    <div className="map-quick-jump">
      <div onClick={() => panTo(regionalOfficeCoords)}>🔵 {regionalOfficeName}</div>
      <div onClick={() => panTo(corporateOfficeCoords)}>🟢 {corporateOfficeName}</div>
      {userLocation && <div onClick={() => panTo(userLocation)}>🔴 {userLocationName}</div>}
    </div>
  );
};


// Contact Page
function Contact() {
  const [contactInfo, setContactInfo] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationName, setUserLocationName] = useState("");

  const fetchContactInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/contact`);
      setContactInfo(res.data);
    } catch (err) {
      console.error(err);
      setContactInfo({
        phone: "+94777 111553",
        email: "info@mahaweli.lk",
        corporateOffice: "No 15/7, Bernadett Mawatha, Kandana, Sri Lanka",
        regionalOffice: "337/1, Katugasthora Road, Kandy, Sri Lanka",
        corporateCoords: [7.0010, 79.9150],
        regionalCoords: [7.2907, 80.6330],
        socialMedia: {
          Facebook: "https://www.facebook.com",
          Youtube: "https://www.youtube.com",
          Tripadvisor: "https://www.tripadvisor.com",
          Pinterest: "https://www.pinterest.com",
          Instagram: "https://www.instagram.com",
          Google: "https://www.google.com",
        },
      });
    }
  };

  useEffect(() => {
    fetchContactInfo();
  
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
  
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${coords[0]}&lon=${coords[1]}&format=json`
            );
            const data = await res.json();
            setUserLocationName(data.display_name || "Your Location");
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setUserLocationName("Your Location");
          }
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);
  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    const { name, email, message } = form;
    if (!name || !email || !message) { setStatusMessage("Please fill all fields"); setStatusType("error"); return; }
    if (!/.+@.+\..+/.test(email)) { setStatusMessage("Please enter a valid email"); setStatusType("error"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/comments`, { page: "contact", name: name.trim(), email: email.trim(), message: message.trim() });
      if (res.status === 201) { setForm({ name: "", email: "", message: "" }); setStatusMessage("✅ Thank you! We'll get back to you soon."); setStatusType("success"); }
      else { setStatusMessage("Failed to send message"); setStatusType("error"); }
    } catch (err) { console.error(err.response || err.message); setStatusMessage("Failed to send message"); setStatusType("error"); }
    finally { setLoading(false); }
  };

  if (!contactInfo) return <div>Loading contact info...</div>;
  const { phone, email, corporateOffice, regionalOffice, corporateCoords, regionalCoords, socialMedia } = contactInfo;

  return (
    <div className="flex flex-col items-center" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

{/* Hero Section */}
<div
  className="w-full h-[400px] md:h-[450px] lg:h-[500px] relative flex flex-col justify-center items-center text-center bg-cover bg-center"
  style={{ backgroundImage: "url(/images/yala6.jpg)" }}
>
  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
  <div className="relative z-10 px-6 md:px-20">
    <h1 style={{
  fontFamily: "'Times New Roman', Times, serif", 
  fontWeight: 600,                               
  fontSize: "3rem",                            
  color: "#064420",                          
  textAlign: "center",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",    
  marginBottom: "1.5rem",                       
  marginTop: "0",     
    }}>
      Plan Your Adventure with Net Lanka Tours
    </h1>
    <p className="text-black text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
    Have questions or need assistance planning your adventure? Reach out to us! Whether it’s booking a tour, requesting a custom itinerary, or simply seeking travel advice, our friendly team is here to help. Connect via phone, email, or visit our corporate and regional offices. Your journey starts with a conversation.
    </p>
  </div>
</div>

{/* Contact + Form Section */}
<div
  style={{
    fontFamily: "'Times New Roman', Times, serif",
    background: "#dcfce7",
    width: "100%",
    maxWidth: 1500,
    padding: "50px",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)",
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    marginTop: 0, // overlap slightly with hero if desired
  }}
>
  {/* Left Column: Contact Details */}
  <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 20 }}>
  
  {/* Phone Card */}
  <div style={{
    background: "#d1d5db",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontSize: 18,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  }}>
    <div style={{ fontSize: 20, color: "#064420" }}>📞</div>
    <div> <strong>Phone:</strong> {phone} </div>
  </div>

  {/* Email Card */}
  <div style={{
    background: "#d1d5db",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontSize: 18,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  }}>
    <div style={{ fontSize: 20, color: "#064420" }}>📧</div>
    <div> <strong>Email:</strong> {email} </div>
  </div>

  {/* Corporate Office Card */}
  <div style={{
    background: "#d1d5db",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontSize: 18,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  }}>
    <div style={{ fontSize: 20, color: "#064420" }}>🏢</div>
    <div> <strong>Corporate Office:</strong> {corporateOffice} </div>
  </div>

  {/* Regional Office Card */}
  <div style={{
    background: "#d1d5db",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontSize: 18,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  }}>
    <div style={{ fontSize: 20, color: "#064420" }}>🏢</div>
    <div> <strong>Regional Office:</strong> {regionalOffice} </div>
  </div>



  {/* Social Media */}
  <div>
    <strong style={{ fontSize: 20 }}>Follow us on:</strong>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 12, fontSize: 32 }}>
      {Object.entries(socialMedia).map(([platform, url]) => {
        const { icon } = socialMediaMap[platform] || {};
        return icon && <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#064420" }}>{icon}</a>;
      })}
    </div>
  </div>
</div>


  {/* Right Column: Message Form */}
  <div style={{ flex: 1, minWidth: 280 }}>
    <h2 style={{ fontSize: "2rem", color: "#064420", marginBottom: 20, fontWeight: "600" }}>
      Send Us a Message
    </h2>
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 18 }}>
      <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required style={inputStyle} />
      <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required style={inputStyle} />
      <textarea name="message" placeholder="Your Message" rows="5" value={form.message} onChange={handleChange} required style={textareaStyle} />
      <button type="submit" disabled={loading} style={buttonStyle}>{loading ? "Sending..." : "Send"}</button>
      {statusMessage && <p style={{ color: statusType === "success" ? "green" : "crimson", fontWeight: 600 }}>{statusMessage}</p>}
    </form>
  </div>
</div>

{/* Map Section */}
<div
        style={{
          background: "#dcfce7", width: "100%", maxWidth: 1500, padding: "30px", borderRadius: "16px", boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)"
        }}
      >
  <h2 style={{ marginBottom: 15, fontSize: "2rem", color: "#064420", fontWeight: "600" }}>
    Find Us on the Map
  </h2>
  <div style={{ marginTop: 40, position: "relative", borderRadius: 12, overflow: "hidden" }}>
    <MapContainer center={regionalCoords} zoom={13} style={{ height: 420, width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={regionalCoords} icon={blueIcon} />
      <Marker position={corporateCoords} icon={greenIcon} />
      {userLocation && <Marker position={userLocation} icon={redIcon} />}
      <Routing
        userLocation={userLocation}
        offices={[
          { name: "Regional Office", coords: regionalCoords, color: "blue" },
          { name: "Corporate Office", coords: corporateCoords, color: "green" }
        ]}
      />
      <MapLegend 
        userLocation={userLocation} 
        userLocationName={userLocationName} 
        regionalOfficeCoords={regionalCoords} 
        corporateOfficeCoords={corporateCoords}
        regionalOfficeName={regionalOffice}
        corporateOfficeName={corporateOffice}
      />
    </MapContainer>
  </div>
</div>

</div>

  );
}

// Styles
const inputStyle = { padding: "14px 12px", borderRadius: 8, border: "1.8px solid #bbb", fontSize: 18 };
const textareaStyle = { ...inputStyle, resize: "vertical" };
const buttonStyle = { padding: "14px 24px", background: "#064420", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: "pointer" };

export default Contact;

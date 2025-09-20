import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LOCALSTORAGE_KEY = "mahaweli_about_data";

function AdminAbout() {
  const [aboutTexts, setAboutTexts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 3000);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    const savedData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};
    setAboutTexts(savedData.aboutTexts || [
      "Mahaweli Tours & Holidays started in 2009 in Kandy...",
      "We provide luxury vehicles and experienced guides..."
    ]);
    setTestimonials(savedData.testimonials || [
      { id: 1, name: "John Smith", message: "Great service!", date: "2025-06-15" }
    ]);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ aboutTexts, testimonials }));
    setSaving(false);
    showPopup("Changes Saved Successfully!");
  };

  const handleCancel = () => {
    const savedData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};
    setAboutTexts(savedData.aboutTexts || []);
    setTestimonials(savedData.testimonials || []);
    showPopup("Changes reverted!", "error");
  };

  const handleAboutChange = (index, value) => {
    const newAbout = [...aboutTexts];
    newAbout[index] = value;
    setAboutTexts(newAbout);
  };
  const handleAddAbout = () => setAboutTexts([...aboutTexts, ""]);
  const handleDeleteAbout = (index) => {
    if (window.confirm("Delete this paragraph?")) {
      setAboutTexts(aboutTexts.filter((_, i) => i !== index));
      showPopup("Paragraph deleted successfully!");
    }
  };

  const handleTestimonialChange = (id, field, value) => {
    setTestimonials(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };
  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: "",
      message: "",
      date: new Date().toISOString().split("T")[0],
    };
    setTestimonials([newTestimonial, ...testimonials]);
  };
  const handleDeleteTestimonial = (id) => {
    if (window.confirm("Delete this testimonial?")) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      showPopup("Testimonial deleted successfully!");
    }
  };

  // Button hover styles
  const addBtnHover = (e) => e.target.style.backgroundColor = "#1b4d21";
  const addBtnUnhover = (e) => e.target.style.backgroundColor = "#2e7d32";

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/images/logo.PNG" alt="NetLanka Logo" style={{ maxWidth: 100, height: "auto" }} />
      </div>

      <h3 style={{ textAlign: "center", marginBottom: 40, fontSize: isMobile ? "1.8rem" : "2.6rem", fontWeight: "700", color: "#2c5d30" }}>
        Admin About Management
      </h3>

      {/* About Section */}
      <section style={sectionStyle}>
        {aboutTexts.map((text, i) => (
          <div key={i} style={cardStyle}>
            <button
              onClick={() => handleDeleteAbout(i)}
              style={deleteIconStyle}
              title="Delete Paragraph"
            >
              ✖
            </button>
            <textarea
              rows={3}
              style={inputStyle}
              value={text}
              onChange={(e) => handleAboutChange(i, e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={handleAddAbout}
          style={addBtnStyle}
          onMouseEnter={addBtnHover}
          onMouseLeave={addBtnUnhover}
          type="button"
        >
          + Add Paragraph
        </button>
      </section>

      {/* Testimonials Section */}
      <section style={sectionStyle}>
        <h2 style={{ color: "#064420" }}>Testimonials</h2>
        <button
          onClick={handleAddTestimonial}
          style={addBtnStyle}
          onMouseEnter={addBtnHover}
          onMouseLeave={addBtnUnhover}
          type="button"
        >
          + Add Testimonial
        </button>

        {testimonials.length === 0 ? (
          <p>No testimonials found.</p>
        ) : isMobile ? (
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={20} slidesPerView={1}>
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div style={cardStyle}>
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    style={deleteIconStyle}
                    title="Delete Testimonial"
                  >
                    ✖
                  </button>
                  <input type="text" placeholder="Name" value={t.name} onChange={(e) => handleTestimonialChange(t.id, "name", e.target.value)} style={inputStyle} />
                  <input type="date" value={t.date} onChange={(e) => handleTestimonialChange(t.id, "date", e.target.value)} style={{ ...inputStyle, marginTop: 12 }} />
                  <textarea rows={3} placeholder="Message" value={t.message} onChange={(e) => handleTestimonialChange(t.id, "message", e.target.value)} style={{ ...inputStyle, marginTop: 12 }} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 20 }}>
            {testimonials.map((t) => (
              <div key={t.id} style={cardStyle}>
                <button
                  onClick={() => handleDeleteTestimonial(t.id)}
                  style={deleteIconStyle}
                  title="Delete Testimonial"
                >
                  ✖
                </button>
                <input type="text" placeholder="Name" value={t.name} onChange={(e) => handleTestimonialChange(t.id, "name", e.target.value)} style={inputStyle} />
                <input type="date" value={t.date} onChange={(e) => handleTestimonialChange(t.id, "date", e.target.value)} style={{ ...inputStyle, marginTop: 12 }} />
                <textarea rows={3} placeholder="Message" value={t.message} onChange={(e) => handleTestimonialChange(t.id, "message", e.target.value)} style={{ ...inputStyle, marginTop: 12 }} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save & Cancel */}
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={handleSave} disabled={saving} style={{ ...addBtnStyle, backgroundColor: saving ? "#4caf5080" : "#1b5e20", flex: 1 }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={handleCancel} style={{ ...addBtnStyle, backgroundColor: "#b71c1c", flex: 1 }}>
          Reset Changes
        </button>
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
  );
}

// Styles
const containerStyle = {
  maxWidth: 1500,
  margin: "20px",
  fontFamily: "'Times New Roman', Times, serif",
  gap: '20px',
  padding: '30px',
  background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
  borderRadius: '16px',
  boxShadow: '0 6px 16px rgba(0, 100, 34, 0.15)',
};

const sectionStyle = { marginBottom: 40, padding: 24, borderRadius: 12, backgroundColor: "#f4f9f4", boxShadow: "0 6px 14px rgba(0, 128, 0, 0.12)" };
const addBtnStyle = { padding: "12px 28px", backgroundColor: "#2e7d32", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: "700", fontSize: 16, boxShadow: "0 4px 12px rgba(46, 125, 50, 0.7)", transition: "background-color 0.3s ease" };
const inputStyle = { width: "100%", padding: 12, fontSize: 16, borderRadius: 10, border: "2px solid #a4d4a5", boxSizing: "border-box", fontFamily: "'Times New Roman', Times, serif", transition: "border-color 0.3s ease" };
const cardStyle = {
  position: "relative",
  background: "#e8f5e9",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 4px 12px rgba(0,128,0,0.1)",
};
const deleteIconStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  background: "#c62828",
  color: "#fff",
  width: 24,
  height: 24,
  borderRadius: "50%",
  border: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 14,
  cursor: "pointer",
  fontWeight: "bold",
};

export default AdminAbout;

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LOCALSTORAGE_KEY = "mahaweli_about_data";

const AdminAbout = () => {
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
    setAboutTexts(
      savedData.aboutTexts || [
        "Mahaweli Tours & Holidays started in 2009 in Kandy...",
        "We provide luxury vehicles and experienced guides..."
      ]
    );
    setTestimonials(
      savedData.testimonials || [
        { id: 1, name: "John Smith", message: "Great service!", date: "2025-06-15" }
      ]
    );

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
    const updated = [...aboutTexts];
    updated[index] = value;
    setAboutTexts(updated);
  };

  const handleAddAbout = () => setAboutTexts([...aboutTexts, ""]);

  const handleDeleteAbout = (index) => {
    if (window.confirm("Delete this paragraph?")) {
      setAboutTexts(aboutTexts.filter((_, i) => i !== index));
      showPopup("Paragraph deleted successfully!");
    }
  };

  const handleTestimonialChange = (id, field, value) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAddTestimonial = () => {
    const newT = {
      id: Date.now(),
      name: "",
      message: "",
      date: new Date().toISOString().split("T")[0],
    };
    setTestimonials([newT, ...testimonials]);
  };

  const handleDeleteTestimonial = (id) => {
    if (window.confirm("Delete this testimonial?")) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      showPopup("Testimonial deleted successfully!");
    }
  };

  return (
    <div style={{ maxWidth: 1500, margin: 20, padding: 30, background: "linear-gradient(135deg, #c8f5d9, #4caf50)", borderRadius: 16 }}>
      <h3 className="text-center text-green-900 font-extrabold text-3xl sm:text-4xl mb-10">
        Admin About Management
      </h3>

      {/* About Section */}
      <section className="bg-white/90 rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-green-900 font-bold text-xl mb-6">About Section</h2>
        <div className="flex flex-col gap-6">
          {aboutTexts.map((text, i) => (
            <div
              key={i}
              className="relative bg-green-50 border border-green-300 rounded-lg shadow p-4"
            >
              <button
                onClick={() => handleDeleteAbout(i)}
                title="Delete Paragraph"
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✖
              </button>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => handleAboutChange(i, e.target.value)}
                className="w-full border-2 border-green-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              />
            </div>
          ))}
          <button
            onClick={handleAddAbout}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
          >
            + Add Paragraph
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white/90 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-green-900 font-bold text-xl">Testimonials</h2>
          <button
            onClick={handleAddTestimonial}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
          >
            + Add Testimonial
          </button>
        </div>

        {testimonials.length === 0 ? (
          <p className="text-gray-700 italic">No testimonials found.</p>
        ) : isMobile ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="relative bg-green-50 border border-green-300 rounded-lg shadow p-4 mb-6">
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✖
                  </button>
                  <input
                    type="text"
                    placeholder="Name"
                    value={t.name}
                    onChange={(e) =>
                      handleTestimonialChange(t.id, "name", e.target.value)
                    }
                    className="w-full border-2 border-green-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="date"
                    value={t.date}
                    onChange={(e) =>
                      handleTestimonialChange(t.id, "date", e.target.value)
                    }
                    className="w-full border-2 border-green-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-green-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Message"
                    value={t.message}
                    onChange={(e) =>
                      handleTestimonialChange(t.id, "message", e.target.value)
                    }
                    className="w-full border-2 border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="relative bg-green-50 border border-green-300 rounded-lg shadow p-4"
              >
                <button
                  onClick={() => handleDeleteTestimonial(t.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✖
                </button>
                <input
                  type="text"
                  placeholder="Name"
                  value={t.name}
                  onChange={(e) =>
                    handleTestimonialChange(t.id, "name", e.target.value)
                  }
                  className="w-full border-2 border-green-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={t.date}
                  onChange={(e) =>
                    handleTestimonialChange(t.id, "date", e.target.value)
                  }
                  className="w-full border-2 border-green-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  rows={3}
                  placeholder="Message"
                  value={t.message}
                  onChange={(e) =>
                    handleTestimonialChange(t.id, "message", e.target.value)
                  }
                  className="w-full border-2 border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save & Cancel Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex-1 py-3 rounded-lg text-white font-semibold shadow-md transition ${
            saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition"
        >
          Reset Changes
        </button>
      </div>

      {/* Popup */}
      {popup && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-md shadow-lg font-bold text-white ${
            popupType === "success" ? "bg-green-700" : "bg-red-700"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
};

export default AdminAbout;

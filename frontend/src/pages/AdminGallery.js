import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    imageFile: null,
    imagePreview: "",
  });
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();
  const formRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
// Add at the top inside the component
const [popup, setPopup] = useState("");
const [popupType, setPopupType] = useState("success");

const showPopup = (message, type = "success") => {
  setPopup(message);
  setPopupType(type);
  setTimeout(() => setPopup(""), 3000); // auto-hide after 3s
};

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all photos
  const fetchPhotos = async () => {
    try {
      const res = await axios.get("/api/gallery");
      setPhotos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Input change
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 3 * 1024 * 1024; 
      if (file.size > maxSize) {
        showPopup("File size exceeds 3MB. Please choose a smaller image.");
    
        e.target.value = null;
        setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: "" }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ id: null, title: "", imageFile: null, imagePreview: "" });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showPopup("Title is required.");
      return;
    }
    if (!formData.imageFile && !formData.id) {
      showPopup("Image is required.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formData.title.trim());
    if (formData.imageFile) formPayload.append("image", formData.imageFile);

    try {
      if (formData.id) {
        await axios.put(`/api/gallery/${formData.id}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Photo updated successfully!");
      } else {
        await axios.post("/api/gallery", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Photo added successfully!", "success");
      }
      resetForm();
      fetchPhotos();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      showPopup("Error saving photo", "error");
    }
  };

  // Delete photo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await axios.delete(`/api/gallery/${id}`);
      showPopup("Photo deleted successfully!");
      fetchPhotos();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      showPopup("Error deleting photo");
      console.error(error);
    }
  };

  // Edit photo
  const startEdit = (photo) => {
    setFormData({
      id: photo._id,
      title: photo.title,
      imageFile: null,
      imagePreview: photo.imageUrl,
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Styles
  const inputStyle = {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box",
    fontFamily: "'Times New Roman', Times, serif",
  };
  const buttonStyle = {
    backgroundColor: "#2c5d30",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 5,
    cursor: "pointer",
    flex: 1,
    fontFamily: "'Times New Roman', Times, serif",
    width: 200
  };
  const cancelButtonStyle = { ...buttonStyle, flex: 1, backgroundColor: "#E57373", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold", color:"black"};

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
          fontWeight: "700",
          letterSpacing: "0.04em",
          color: "#2c5d30",
          fontFamily: "'Times New Roman', Times, serif",
        }}
      >
        Admin Gallery Management
      </h3>
      <div style={{ margin: "0 auto" }}>
      {message && (
        <p
          style={{
            marginTop: 20,
            color: message.includes("successfully") ? "green" : "red",
            textAlign: "center",
            fontWeight: "600",
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          {message}
        </p>
      )}

      {/* Form */}
      <div ref={formRef} style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 600,
            margin: 20,
            padding: 20,
            background: "#f9f9f9",
            borderRadius: 10,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            boxSizing: "border-box",
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          <h2 style={{ color: "#064420", textAlign: "center", fontFamily: "'Times New Roman', Times, serif", }}>
            {formData.id ? "Edit Photo" : "Add New Photo"}
          </h2>

          <label>Title:</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Photo Title"
            required
            style={inputStyle}
          />

          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={inputStyle}
          />
          {formData.imagePreview && (
            <img
              src={formData.imagePreview}
              alt="Preview"
              style={{ maxWidth: "100%", marginTop: 10, borderRadius: 4 }}
            />
          )}

<div style={{ display: "flex", gap: 10, marginTop: 20 }}>
  <button type="submit" style={buttonStyle}>
    {formData.id ? "Update Photo" : "Add Photo"}
  </button>
  <button type="button" onClick={resetForm} style={{ 
      ...cancelButtonStyle, 
      backgroundColor: "#c0392b", // red color
      color: "#fff" 
    }}>
    Cancel
  </button>
</div>

        </form>
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h3 style={{ color: "#064420", marginBottom: 20, fontFamily: "'Times New Roman', Times, serif", }}>All Photos</h3>

      {photos.length === 0 ? (
        <p>No photos found.</p>
      ) : isMobile ? (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
        >
          {photos.map((photo) => (
            <SwiperSlide key={photo._id}>
              <div
                style={{
                  border: "3px solid #2e7d32",
                  padding: 20,
                  borderRadius: 8,
                  textAlign: "center",
                  userSelect: "none",
                  fontFamily: "'Times New Roman', Times, serif",
                  background: "white"
                }}
              >
                <h4>{photo.title}</h4>
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  style={{
                    width: "100%",
                    borderRadius: 4,
                    margin: "10px 0",
                    height: 180,
                    objectFit: "cover",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                />
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => startEdit(photo)} style={{flex: 1, backgroundColor: "#81C784", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold", color:"black"}}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(photo._id)} style={cancelButtonStyle}>
                    Delete
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo._id}
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                padding: 15,
                 border: "3px solid #2e7d32",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                userSelect: "none",
                background: "#fff"
              }}
            >
              <h4 style={{ marginBottom: 10 }}>{photo.title}</h4>
              {photo.imageUrl && (
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  style={{ width: "100%", borderRadius: 4, marginBottom: 10, objectFit: "cover", height: 180 }}
                />
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => startEdit(photo)} style={{flex: 1, backgroundColor: "#81C784", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold", color:"black"}}>
                  Edit
                </button>
                <button onClick={() => handleDelete(photo._id)} style={cancelButtonStyle}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
}

export default AdminGallery;

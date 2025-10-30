import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AdminBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const formRef = useRef(null);
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

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || (!imageFile && !editId)) {
      showPopup("Please fill all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      if (editId) {
        await axios.put(`http://localhost:5000/api/blogs/${editId}`, formData);
        showPopup("Blog updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/blogs", formData);
        showPopup("Blog posted successfully!");
      }

      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setEditId(null);
      fetchBlogs();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving blog:", error);
      showPopup("Error saving blog.");
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setEditId(blog._id);
    setImagePreview(blog.imageUrl ? `http://localhost:5000${blog.imageUrl}` : null);
    setImageFile(null);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        showPopup("Blog deleted successfully!");
        fetchBlogs();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Delete failed:", error);
        showPopup("Delete failed.");
      }
    }
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
  };

  const buttonStyle = {
    backgroundColor: "#2c5d30",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 5,
    cursor: "pointer",
    flex: 1,
    fontSize: "1rem",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#b30000",
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
          fontWeight: "700",
          letterSpacing: "0.04em",
          color: "#2c5d30",
        }}
      >
        Admin Blog Management
      </h3>

      <div style={{ margin: "0 auto" }}>
      {message && (
        <p style={{ marginTop: 20, color: message.includes("successfully") ? "green" : "red", textAlign: "center", fontWeight: 600 }}>
          {message}
        </p>
      )}

      {/* Form */}
      <div ref={formRef} style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          style={{
            width: isMobile ? "100%" : 600,
            margin: 20,
            padding: 20,
            background: "#f9f9f9",
            borderRadius: 10,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ color: "#064420", textAlign: "center", marginBottom: 20 }}>
            {editId ? "Edit Blog Post" : "Add New Blog Post"}
          </h2>

          <div style={{ marginBottom: 10 }}>
            <label>Title:</label>
            <input value={title} placeholder="Blog Title" onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Content:</label>
            <textarea value={content} placeholder="Blog Content" onChange={(e) => setContent(e.target.value)} rows={5} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", maxHeight: 250, objectFit: "cover", marginTop: 10, borderRadius: 5 }}
              />
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" style={{ ...buttonStyle, width: isMobile ? "100%" : "45%" }}>
              {editId ? "Update Blog" : "Post Blog"}
            </button>
        
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setContent("");
                  setImageFile(null);
                  setImagePreview(null);
                }}
                style={{ ...cancelButtonStyle, width: isMobile ? "100%" : "45%" }}
              >
                Cancel
              </button>
           
          </div>
        </form>
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h3 style={{ color: "#064420", marginBottom: 20 }}>All Blogs</h3>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : isMobile ? (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <div style={{ background: "white", border: "3px solid #2e7d32", padding: 20, borderRadius: 8, userSelect: "none" }}>
              <h4
    style={{
      marginBottom: 10,
      color: "#2c3e50",
      fontWeight: "bold",
      fontSize: 18 // makes title slightly larger
    }}
  >
    {blog.title}</h4>
                <p>{blog.content}</p>
                {blog.imageUrl && (
                  <img
                    src={`http://localhost:5000${blog.imageUrl}`}
                    alt="blog"
                    style={{ width: "100%", borderRadius: 4, marginTop: 10, objectFit: "cover", maxHeight: 200 }}
                  />
                )}
                <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                  <button
                    onClick={() => handleEdit(blog)}
                    style={{flex: 1, backgroundColor: "#81C784", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold", color:"black" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    style={{ flex: 1, backgroundColor: "#E57373", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold", color:"black" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {blogs.map((blog) => (
            <div key={blog._id} style={{ background: "white",  border: "3px solid #2e7d32", padding: 20, borderRadius: 8, display: "flex", flexDirection: "column" }}>
              <h4 style={{ marginBottom: 10 }}>{blog.title}</h4>
              <p style={{ flexGrow: 1 }}>{blog.content}</p>
              {blog.imageUrl && (
                <img src={`http://localhost:5000${blog.imageUrl}`} alt="blog" style={{ width: "100%", borderRadius: 4, marginTop: 10, objectFit: "cover", maxHeight: 200 }} />
              )}
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleEdit(blog)}
                  style={{ flex: 1, backgroundColor: "#81C784", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold", color:"black" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  style={{ flex: 1, backgroundColor: "#E57373", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold", color:"black" }}
                >
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
};

export default AdminBlog;

import React, { useState, useEffect, useRef } from "react";
import axios from "../axiosConfig";
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
  const formRef = useRef(null);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 3000);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs");
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
      showPopup("Please fill all fields.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      if (editId) {
        await axios.put(`/api/blogs/${editId}`, formData);
        showPopup("Blog updated successfully!");
      } else {
        await axios.post("/api/blogs", formData);
        showPopup("Blog posted successfully!");
      }

      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setEditId(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      showPopup("Error saving blog.", "error");
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setEditId(blog._id);

    setImagePreview(
      blog.imageUrl ? `${axios.defaults.baseURL}${blog.imageUrl}` : null
    );

    setImageFile(null);

    formRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`/api/blogs/${id}`);

        showPopup("Blog deleted successfully!");
        fetchBlogs();
      } catch (error) {
        console.error("Delete failed:", error);
        showPopup("Delete failed.", "error");
      }
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto my-5 p-8 bg-gradient-to-br from-green-100 to-green-500 rounded-2xl shadow-md">
      <h3 className="text-center mb-10 font-bold text-green-900 text-3xl sm:text-4xl">
        Admin Blog Management
      </h3>

      {/* Blog Form */}
      <div ref={formRef} className="flex justify-center mb-10">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-full sm:w-[600px] bg-white shadow-lg rounded-lg p-6"
        >
          <h2 className="text-center text-green-900 font-semibold text-2xl mb-6">
            {editId ? "Edit Blog Post" : "Add New Blog Post"}
          </h2>

          <div className="mb-4">
            <label className="block font-medium mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog Title"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Blog Content"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-md mt-3"
              />
            )}
          </div>

          <div className="flex justify-center gap-4 flex-wrap mt-6">
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-green-900 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition"
            >
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
              className="w-full sm:w-1/2 bg-red-700 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Blog List */}
      <h3 className="text-green-900 text-xl font-semibold mb-5">All Blogs</h3>
      {blogs.length === 0 ? (
        <p className="text-gray-700">No blogs found.</p>
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
              <div className="bg-white border-4 border-green-700 p-5 rounded-xl text-center">
                <h4 className="font-bold text-lg text-gray-800 mb-2">
                  {blog.title}
                </h4>
                <p className="text-gray-700">{blog.content}</p>
                {blog.imageUrl && (
                  <img
                    src={`${axios.defaults.baseURL}${blog.imageUrl}`}
                    alt="blog"
                    className="w-full rounded-md mt-3 object-cover max-h-56"
                  />
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="flex-1 bg-green-300 hover:bg-green-400 py-2 rounded-md font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex-1 bg-red-300 hover:bg-red-400 py-2 rounded-md font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border-4 border-green-700 p-5 rounded-xl flex flex-col shadow"
            >
              <h4 className="font-bold text-lg mb-2 text-gray-800">
                {blog.title}
              </h4>
              <p className="text-gray-700 flex-grow">{blog.content}</p>
              {blog.imageUrl && (
                <img
                  src={`${axios.defaults.baseURL}${blog.imageUrl}`}
                  alt="blog"
                  className="w-full rounded-md mt-3 object-cover max-h-56"
                />
              )}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="flex-1 bg-green-300 hover:bg-green-400 py-2 rounded-md font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="flex-1 bg-red-300 hover:bg-red-400 py-2 rounded-md font-semibold"
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
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-md font-bold text-white shadow-lg z-50 transition-all duration-300 ${
            popupType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;

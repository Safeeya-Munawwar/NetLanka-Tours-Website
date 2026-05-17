import React, { useState, useEffect, useRef } from "react";
import axios from "../axiosConfig";
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
  const [message] = useState("");
  const fileInputRef = useRef();
  const formRef = useRef();
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  const resetForm = () => {
    setFormData({ id: null, title: "", imageFile: null, imagePreview: "" });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return showPopup("Title is required.");
    if (!formData.imageFile && !formData.id)
      return showPopup("Image is required.");

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
        showPopup("Photo added successfully!");
      }
      resetForm();
      fetchPhotos();
    } catch (error) {
      showPopup("Error saving photo", "error");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await axios.delete(`/api/gallery/${id}`);
      showPopup("Photo deleted successfully!");
      fetchPhotos();
    } catch (error) {
      showPopup("Error deleting photo");
      console.error(error);
    }
  };

  const startEdit = (photo) => {
    setFormData({
      id: photo._id,
      title: photo.title,
      imageFile: null,
      imagePreview: photo.imageUrl,
    });
    fileInputRef.current.value = null;
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-[1500px] mx-auto my-5 p-8 rounded-2xl bg-gradient-to-tr from-green-100 to-green-500">
      <h3 className="text-center mb-10 text-3xl sm:text-4xl font-bold text-green-900">
        Admin Gallery Management
      </h3>

      {message && (
        <p
          className={`text-center font-semibold ${
            message.includes("successfully") ? "text-green-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* FORM */}
      <div ref={formRef} className="flex justify-center mb-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md font-serif"
        >
          <h2 className="text-center text-green-900 font-semibold text-2xl mb-4">
            {formData.id ? "Edit Photo" : "Add New Photo"}
          </h2>

          <label className="font-semibold">Title:</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Photo Title"
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-2 mb-4 focus:ring-2 focus:ring-green-400"
          />

          <label className="font-semibold">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border border-gray-300 rounded-md p-2 mt-2 mb-4 focus:ring-2 focus:ring-green-400"
          />

          {formData.imagePreview && (
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="w-full rounded-md mt-3 mb-4 object-cover max-h-64"
            />
          )}

          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <button
              type="submit"
              className="bg-green-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 w-full sm:w-auto"
            >
              {formData.id ? "Update Photo" : "Add Photo"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <hr className="my-10 border-gray-400" />

      <h3 className="text-green-900 font-bold mb-5 text-lg sm:text-xl">
        All Photos
      </h3>

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
              <div className="bg-white border-4 border-green-700 p-4 rounded-lg text-center font-serif">
                <h4 className="font-bold mb-2">{photo.title}</h4>
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => startEdit(photo)}
                    className="flex-1 bg-green-400 text-black font-semibold py-2 rounded hover:bg-green-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(photo._id)}
                    className="flex-1 bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 font-serif">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className="bg-white border-4 border-green-700 p-4 rounded-lg flex flex-col"
            >
              <h4 className="font-bold mb-2">{photo.title}</h4>
              {photo.imageUrl && (
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(photo)}
                  className="flex-1 bg-green-400 text-black font-semibold py-2 rounded hover:bg-green-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(photo._id)}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POPUP */}
      {popup && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg font-semibold text-white ${
            popupType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
}

export default AdminGallery;

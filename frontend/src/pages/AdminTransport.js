import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function AdminTransport() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    type: "",
    ac: "Non AC",
    seats: 1,
    luggage: 0,
    capacity: 1,
    description: "",
    imageFile: null,
    imagePreview: "",
  });

  const fileInputRef = useRef();
  const formRef = useRef();

  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [, setIsMobile] = useState(window.innerWidth <= 768);

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

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get("/api/transport");
      setVehicles(
        data.map((v) => ({
          ...v,
          imagePreview: v.image ? v.image : "",
          imageFile: null,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 3 * 1024 * 1024;
      if (file.size > maxSize) {
        showPopup("File size exceeds 3MB. Please choose a smaller image.", "error");
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
    setFormData({
      id: null,
      type: "",
      ac: "Non AC",
      seats: 1,
      luggage: 0,
      capacity: 1,
      description: "",
      imageFile: null,
      imagePreview: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type.trim()) return showPopup("Vehicle type is required", "error");

    const formPayload = new FormData();
    formPayload.append("title", formData.type);
    formPayload.append("description", formData.description || "Transport vehicle");
    formPayload.append(
      "vehicles",
      JSON.stringify([
        {
          type: formData.type,
          ac: formData.ac,
          seats: Number(formData.seats),
          luggage: Number(formData.luggage),
          capacity: Number(formData.capacity),
        },
      ])
    );
    if (formData.imageFile) formPayload.append("image", formData.imageFile);

    try {
      const url = formData.id ? `/api/transport/${formData.id}` : "/api/transport";
      const method = formData.id ? "put" : "post";

      await axios({
        method,
        url,
        data: formPayload,
        headers: { "Content-Type": "multipart/form-data" },
      });

      showPopup(formData.id ? "Vehicle updated successfully!" : "Vehicle added successfully!");
      resetForm();
      fetchVehicles();
    } catch (err) {
      console.error("Save vehicle error:", err.response?.data || err.message);
      showPopup("Error saving vehicle.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`/api/transport/${id}`);
      showPopup("Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err) {
      console.error(err);
      showPopup("Error deleting vehicle.", "error");
    }
  };

  const startEdit = (vehicle) => {
    setFormData({
      id: vehicle._id,
      type: vehicle.vehicles?.[0]?.type || vehicle.title,
      ac: vehicle.vehicles?.[0]?.ac || "Non AC",
      seats: vehicle.vehicles?.[0]?.seats || 1,
      luggage: vehicle.vehicles?.[0]?.luggage || 0,
      capacity: vehicle.vehicles?.[0]?.capacity || 1,
      imageFile: null,
      imagePreview: vehicle.image || "",
      description: vehicle.description || "",
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-screen-xl mx-auto my-6 p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-500 shadow-lg">
      <h3 className="text-center mb-10 text-3xl md:text-4xl font-bold text-green-900">
        Admin Transport Management
      </h3>

      {/* ===== Form ===== */}
      <div ref={formRef} className="flex justify-center mb-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg space-y-4 border border-green-700"
        >
          <h2 className="text-center text-green-900 font-semibold text-2xl">
            {formData.id ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Type:</label>
            <input
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Vehicle Type"
              required
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">AC / Non AC:</label>
            <select
              name="ac"
              value={formData.ac}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option>AC</option>
              <option>Non AC</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["seats", "luggage", "capacity"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-1 font-medium capitalize">{field}:</label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="border rounded px-3 py-2"
            />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="mt-2 rounded-lg max-h-60 object-cover shadow-md"
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition"
            >
              {formData.id ? "Update Vehicle" : "Add Vehicle"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <hr className="my-10 border-green-700" />

      <h3 className="text-green-900 mb-4 text-2xl font-semibold">All Vehicles</h3>

      {vehicles.length === 0 ? (
        <p className="text-center text-gray-700">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v._id}
              className="bg-white p-4 rounded-xl border-2 border-green-700 shadow-sm flex flex-col transition hover:shadow-md"
            >
              <h4 className="font-semibold mb-2 text-lg text-green-900">{v.vehicles?.[0]?.type}</h4>
              {v.imagePreview && (
                <img
                  src={v.imagePreview}
                  alt={v.vehicles?.[0]?.type}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm text-gray-700 mb-1">{v.description}</p>
              <p className="text-sm">AC: {v.vehicles?.[0]?.ac}</p>
              <p className="text-sm">Seats: {v.vehicles?.[0]?.seats}</p>
              <p className="text-sm">Luggage: {v.vehicles?.[0]?.luggage}</p>
              <p className="text-sm">Capacity: {v.vehicles?.[0]?.capacity}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => startEdit(v)}
                  className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v._id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {popup && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-lg font-semibold text-white transition ${
            popupType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
}

export default AdminTransport;

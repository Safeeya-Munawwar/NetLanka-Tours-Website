import React, { useState, useEffect, useRef } from "react";
import axios from "../axiosConfig";

const AdminDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    image: null,
  });
  const [editing, setEditing] = useState(false);
  const formRef = useRef(null);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 2000);
  };

  const fetchDestinations = async () => {
    try {
      const res = await axios.get("/api/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editing) {
        await axios.put(`/api/destinations/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Destination Updated!", "success");
      } else {
        await axios.post("/api/destinations", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Destination Added!", "success");
      }
      setFormData({
        id: "",
        name: "",
        description: "",
        category: "",
        image: null,
      });
      setEditing(false);
      fetchDestinations();
    } catch (err) {
      console.error(err);
      showPopup("Failed to save destination.", "error");
    }
  };

  const handleEdit = (dest) => {
    setFormData({
      id: dest._id,
      name: dest.name,
      description: dest.description,
      category: dest.category || "",
      image: null,
    });
    setEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?"))
      return;
    try {
      await axios.delete(`/api/destinations/${id}`);
      fetchDestinations();
      showPopup("Destination Deleted!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Delete failed.", "error");
    }
  };

  const categories = [
    "Beach",
    "Hill Country",
    "Wildlife Safari",
    "Cultural Heritage",
    "Adventure",
    "City & Urban",
  ];

  return (
    <div className="max-w-[1500px] mx-auto my-5 p-8 bg-gradient-to-br from-green-100 to-green-400 rounded-2xl">
      <h3 className="text-center mb-10 text-4xl font-bold text-green-900">
        Admin Destination Management
      </h3>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-gray-50 p-6 rounded-xl shadow-md"
      >
        <h2 className="text-center text-green-900 font-semibold text-2xl mb-4">
          {editing ? "Edit Destination" : "Add New Destination"}
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Destination Name"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="3"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="mb-4 w-full"
        />

        <div className="flex justify-center gap-4 mt-4">
          <button
            type="submit"
            className="bg-green-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-all w-40"
          >
            {editing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setFormData({
                id: "",
                name: "",
                description: "",
                category: "",
                image: null,
              });
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-500 transition-all w-40"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Destination List Grouped by Category */}
      {categories.map((cat) => {
        const filtered = destinations.filter((d) => d.category === cat);
        if (filtered.length === 0) return null;
        return (
          <div key={cat} className="mt-10">
            <h2 className="text-green-800 text-xl font-semibold border-b-2 border-green-700 mb-4">
              {cat}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((dest) => (
                <div
                  key={dest._id}
                  className="bg-white p-4 rounded-lg border-2 border-green-700 text-center shadow-sm"
                >
                  {dest.imageUrl && (
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{dest.name}</h3>
                  <p className="text-sm text-gray-600">{dest.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(dest)}
                      className="flex-1 bg-green-300 hover:bg-green-400 text-green-900 py-1 rounded font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dest._id)}
                      className="flex-1 bg-red-300 hover:bg-red-400 text-red-900 py-1 rounded font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {popup && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg font-semibold text-white ${
            popupType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
};

export default AdminDestination;

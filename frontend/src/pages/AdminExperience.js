import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: null,
  });
  const [editing, setEditing] = useState(false);
  const formRef = useRef(null);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 2500);
  };

  const fetchExperiences = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/experiences");
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExperiences();
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
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editing) {
        await axios.put(
          `http://localhost:5000/api/experiences/${formData.id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showPopup("Experience updated successfully!", "success");
      } else {
        await axios.post("http://localhost:5000/api/experiences", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showPopup("Experience added successfully!", "success");
      }
      setFormData({ id: "", title: "", description: "", image: null });
      setEditing(false);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      showPopup("Failed to save experience.", "error");
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      id: exp._id,
      title: exp.title,
      description: exp.description,
      image: null,
    });
    setEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/experiences/${id}`);
      fetchExperiences();
      showPopup("Experience deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Delete failed.", "error");
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto my-5 p-8 rounded-2xl bg-gradient-to-tr from-green-100 to-green-500">
      <h3 className="text-center mb-10 text-3xl sm:text-4xl font-bold text-green-900">
        Admin Experience Management
      </h3>

      {/* Form */}
      <div
        ref={formRef}
        className="flex justify-center mb-10 font-serif"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-center text-green-900 font-semibold text-2xl mb-4">
            {editing ? "Edit Experience" : "Add New Experience"}
          </h2>

          <label className="font-semibold">Experience Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Experience Title"
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-2 mb-4 focus:ring-2 focus:ring-green-400"
          />

          <label className="font-semibold">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            className="w-full border border-gray-300 rounded-md p-2 mt-2 mb-4 focus:ring-2 focus:ring-green-400"
          />

          <label className="font-semibold">Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-2 mb-4 focus:ring-2 focus:ring-green-400"
          />

          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <button
              type="submit"
              className="bg-green-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 w-full sm:w-auto"
            >
              {editing ? "Update Experience" : "Add Experience"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormData({ id: "", title: "", description: "", image: null });
              }}
              className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <hr className="my-10 border-gray-400" />

      {/* Experience List */}
      <h3 className="text-green-900 font-bold mb-5 text-lg sm:text-xl">
        All Experiences
      </h3>

      {experiences.length === 0 ? (
        <p>No experiences found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 font-serif">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-white border-4 border-green-700 p-4 rounded-lg flex flex-col"
            >
              {exp.imageUrl && (
                <img
                  src={`http://localhost:5000${exp.imageUrl}`}
                  alt={exp.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <h4 className="font-bold mb-2 text-lg">{exp.title}</h4>
              <p className="text-gray-700 text-sm mb-3">{exp.description}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(exp)}
                  className="flex-1 bg-green-400 text-black font-semibold py-2 rounded hover:bg-green-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Notification */}
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
};

export default AdminExperience;

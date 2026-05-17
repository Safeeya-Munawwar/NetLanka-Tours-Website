import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";

const AdminHome = () => {
  const [contentData, setContentData] = useState({
    title: "",
    intro: "",
    description: "",
    contact: "",
    email: "",
    address: "",
    stats: [],
    transport: [],
  });

  const [popup, setPopup] = useState("");
  const [newTransport, setNewTransport] = useState({
    name: "",
    file: null,
    details: "",
    imgPreview: "",
  });

  // Detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Load content from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/home-content");
        const data = res.data;

        setContentData({
          title: data.title || "",
          intro: data.intro || "",
          description: data.description || "",
          contact: data.contact || "",
          email: data.email || "",
          address: data.address || "",
          stats: Array.isArray(data.stats) ? data.stats : [],
          transport: Array.isArray(data.transport)
            ? data.transport.map((t) => ({
                ...t,
                imgPreview: t.img ? `${t.img}` : "",
              }))
            : [],
        });
      } catch (err) {
        console.error("Failed to load admin content", err);
      }
    };
    fetchData();
  }, []);

  // Input handlers
  const handleInputChange = (field, value) =>
    setContentData({ ...contentData, [field]: value });

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...contentData.stats];
    updatedStats[index][field] = value;
    setContentData({ ...contentData, stats: updatedStats });
  };

  const handleTransportChange = (index, field, value) => {
    const updatedTransport = [...contentData.transport];
    updatedTransport[index][field] = value;
    setContentData({ ...contentData, transport: updatedTransport });
  };

  const handleTransportFileChange = (index, file) => {
    const updatedTransport = [...contentData.transport];
    updatedTransport[index].file = file;
    updatedTransport[index].imgPreview = URL.createObjectURL(file);
    setContentData({ ...contentData, transport: updatedTransport });
  };

  const handleDeleteTransport = (index) => {
    const updatedTransport = [...contentData.transport];
    updatedTransport.splice(index, 1);
    setContentData({ ...contentData, transport: updatedTransport });
  };

  const handleAddTransport = () => {
    if (!newTransport.name && !newTransport.details) return;

    const transportWithPreview = {
      ...newTransport,
      imgPreview: newTransport.file
        ? URL.createObjectURL(newTransport.file)
        : "",
    };

    setContentData({
      ...contentData,
      transport: [...contentData.transport, transportWithPreview],
    });

    setNewTransport({ name: "", file: null, details: "", imgPreview: "" });
  };

  // Save all content to backend
  const handleSave = async () => {
    try {
      const sanitizedStats = contentData.stats.map((s) => ({
        number: String(s.number || ""),
        label: String(s.label || ""),
      }));

      const formData = new FormData();
      formData.append("title", contentData.title);
      formData.append("intro", contentData.intro);
      formData.append("description", contentData.description);
      formData.append("contact", contentData.contact);
      formData.append("email", contentData.email);
      formData.append("address", contentData.address);
      formData.append("stats", JSON.stringify(sanitizedStats));

      contentData.transport.forEach((t, i) => {
        if (t.file) formData.append("transportFiles", t.file);
        formData.append(
          `transport[${i}]`,
          JSON.stringify({ name: t.name, details: t.details })
        );
      });

      await axios.put(`/api/home-content`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPopup("Content Updated Successfully!");
      setTimeout(() => setPopup(""), 2000);
    } catch (err) {
      console.error(err);
      setPopup("Failed to update content.");
      setTimeout(() => setPopup(""), 2000);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1500,
        margin: 20,
        padding: 30,
        background: "linear-gradient(135deg, #c8f5d9, #4caf50)",
        borderRadius: 16,
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: 40,
          fontSize: isMobile ? "1.8rem" : "2.6rem",
          fontWeight: 700,
          color: "#2c5d30",
        }}
      >
        Admin Home Management
      </h3>

      {/* Editable Main Content */}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-7xl mx-auto space-y-6 mt-6 w-full">
        {/* Title & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["title", "intro", "description", "contact", "email", "address"].map(
            (field) => (
              <div key={field} className="flex flex-col">
                <label className="font-semibold mb-1 capitalize">{field}</label>
                {field === "intro" || field === "description" ? (
                  <textarea
                    rows={field === "intro" ? 3 : 5}
                    className="p-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none w-full"
                    value={contentData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="p-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
                    value={contentData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                )}
              </div>
            )
          )}
        </div>

        {/* Stats Editing */}
        <div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Edit Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contentData.stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-green-50 p-3 rounded-lg shadow-sm w-full"
              >
                <input
                  type="text"
                  placeholder="Number"
                  value={stat.number}
                  className="flex-1.5 p-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
                  onChange={(e) =>
                    handleStatChange(i, "number", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={stat.label}
                  className="flex-2 p-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
                  onChange={(e) => handleStatChange(i, "label", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Transport Management */}
        <div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Transport Options
          </h2>

          {/* Add New Transport */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-start mb-4 w-full">
            <input
              type="text"
              placeholder="Vehicle Name"
              className="p-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 flex-1 min-w-[120px]"
              value={newTransport.name}
              onChange={(e) =>
                setNewTransport({ ...newTransport, name: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              className="flex-1 min-w-[120px]"
              onChange={(e) =>
                setNewTransport({ ...newTransport, file: e.target.files[0] })
              }
            />
            <input
              type="text"
              placeholder="Details"
              className="p-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 flex-1 min-w-[120px]"
              value={newTransport.details}
              onChange={(e) =>
                setNewTransport({ ...newTransport, details: e.target.value })
              }
            />
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition flex-none"
              onClick={handleAddTransport}
            >
              <FaPlus /> Add
            </button>
          </div>

          {/* Transport List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {contentData.transport.length === 0 && (
              <p className="text-gray-500 italic">No transport options</p>
            )}
            {contentData.transport.map((t, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center w-full space-y-2"
              >
                {t.imgPreview && (
                  <img
                    src={t.imgPreview}
                    alt={t.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <input
                  type="text"
                  value={t.name}
                  className="border p-1 rounded w-full text-center"
                  onChange={(e) =>
                    handleTransportChange(i, "name", e.target.value)
                  }
                />
                <textarea
                  value={t.details}
                  rows={2}
                  className="border p-1 rounded w-full text-center resize-none"
                  onChange={(e) =>
                    handleTransportChange(i, "details", e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) =>
                    handleTransportFileChange(i, e.target.files[0])
                  }
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-red-700 transition"
                    onClick={() => handleDeleteTransport(i)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-6">
          <button
            type="button"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto hover:bg-green-800 transition"
            onClick={handleSave}
          >
            <FaSave /> Save Changes
          </button>
        </div>
      </div>

      {/* Popup */}
      {popup && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-lg text-white font-bold z-50 ${
            popup.includes("Successfully") ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
};

export default AdminHome;

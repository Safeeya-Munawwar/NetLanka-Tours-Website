/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"; // ✅ Icons for statuses

const AdminCustomTour = () => {
  const [customTours, setCustomTours] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    preferences: "",
    duration: "",
    budget: "",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch tours
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customTours");
      setCustomTours(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const closeEdit = () => setEditId(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/customTours/${editId}`,
        editForm
      );
      alert("Request updated successfully!");
      fetchTours();
      closeEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = customTours.map((t) => ({
      "Tour Title": t.tourId?.title || "",
      Name: t.name,
      Email: t.email,
      Phone: t.phone,
      Preferences: t.preferences,
      Duration: t.duration,
      Budget: t.budget,
      Status: t.status || "pending",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CustomTours");
    XLSX.writeFile(wb, "CustomTours.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Custom Tour Requests", 14, 15);
    let y = 25;
    customTours.forEach((t, idx) => {
      const status = t.status || "pending";
      doc.setFontSize(12);
      doc.text(
        `${idx + 1}. Tour: ${t.tourId?.title || "N/A"} | Name: ${
          t.name
        } | Email: ${t.email} | Phone: ${t.phone} | Status: ${status}`,
        14,
        y
      );
      y += 7;
      doc.text(`   Preferences: ${t.preferences || "N/A"}`, 14, y);
      y += 7;
      doc.text(
        `   Duration: ${t.duration || "N/A"} | Budget: ${t.budget || "N/A"}`,
        14,
        y
      );
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("CustomTours.pdf");
  };

  // Filter tours
  const filteredTours =
    filter === "all"
      ? customTours
      : customTours.filter((t) => (t.status || "pending") === filter);

  // Status icons
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-700 inline" />;
      case "rejected":
        return <FaTimesCircle className="text-red-600 inline" />;
      default:
        return <FaClock className="text-yellow-600 inline" />;
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto p-6 my-6 rounded-2xl bg-gradient-to-br from-green-100 to-green-500 shadow-lg">
      <h3 className="text-center text-green-900 font-extrabold mb-10 text-3xl sm:text-4xl">
        Admin Custom Tour Management
      </h3>

      {/* Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-6">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`min-w-[120px] py-2 px-4 rounded-md font-semibold text-white transition-all ${
              filter === f
                ? "bg-orange-500 scale-105"
                : "bg-green-900 hover:bg-green-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end flex-wrap gap-3 mb-6">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2 rounded-md"
        >
          <FaFileExcel size={18} /> Export Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-md"
        >
          <FaFilePdf size={18} /> Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-5 rounded-xl shadow-md">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-green-900 text-white text-sm">
            <tr>
              {[
                "Name",
                "Email",
                "Phone",
                "Preferences",
                "Duration",
                "Budget",
                "Vehicle",
                "Pickup Location",
                "Pickup Date",
                "Pickup Time",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h} className="border border-green-800 p-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTours.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center p-4 text-gray-700 font-medium"
                >
                  No requests found.
                </td>
              </tr>
            ) : (
              filteredTours.map((t) => {
                const status = t.status || "pending";
                const rowBg =
                  status === "approved"
                    ? "bg-green-100"
                    : status === "rejected"
                    ? "bg-red-100"
                    : "bg-yellow-100";

                return (
                  <tr
                    key={t._id}
                    className={`${rowBg} border border-green-800 text-sm`}
                  >
                    <td className="p-2 border">{t.name}</td>
                    <td className="p-2 border">{t.email}</td>
                    <td className="p-2 border">{t.phone}</td>
                    <td className="p-2 border">{t.preferences}</td>
                    <td className="p-2 border">{t.duration}</td>
                    <td className="p-2 border">{t.budget}</td>
                    <td className="p-2 border">{t.vehicle || "N/A"}</td>
                    <td className="p-2 border">{t.pickupLocation || "N/A"}</td>
                    <td className="p-2 border">
                      {t.pickupDate
                        ? new Date(t.pickupDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border">{t.pickupTime || "N/A"}</td>
                    <td className="p-2 border font-semibold text-center">
                      {getStatusIcon(status)}{" "}
                      <span className="ml-1">{status.toUpperCase()}</span>
                    </td>
                    <td className="p-2 border text-center">
                      {status === "pending" && (
                        <>
                          <button
                            className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-md mr-2"
                            onClick={() =>
                              axios
                                .put(
                                  `http://localhost:5000/api/customTours/${t._id}`,
                                  { status: "approved" }
                                )
                                .then(fetchTours)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md mr-2"
                            onClick={() =>
                              axios
                                .put(
                                  `http://localhost:5000/api/customTours/${t._id}`,
                                  { status: "rejected" }
                                )
                                .then(fetchTours)
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(status === "approved" || status === "rejected") && (
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md mr-2"
                          onClick={() =>
                            axios
                              .put(
                                `http://localhost:5000/api/customTours/${t._id}`,
                                { status: "pending" }
                              )
                              .then(fetchTours)
                          }
                        >
                          Reset
                        </button>
                      )}
                      {/* <button
                        className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-md"
                        onClick={() => {
                          if (
                            confirm("Are you sure you want to delete this request?")
                          ) {
                            axios
                              .delete(
                                `http://localhost:5000/api/customTours/${t._id}`
                              )
                              .then(fetchTours)
                              .catch(() => alert("Failed to delete request"));
                          }
                        }}
                      >
                        Delete
                      </button> */}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-lg w-[90%] sm:w-[400px] shadow-lg space-y-3"
          >
            <h3 className="text-lg font-bold mb-2 text-green-900">
              Edit Custom Tour Request
            </h3>

            <label className="font-semibold">Preferences</label>
            <textarea
              name="preferences"
              value={editForm.preferences}
              onChange={handleEditChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <label className="font-semibold">Duration</label>
            <input
              name="duration"
              value={editForm.duration}
              onChange={handleEditChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <label className="font-semibold">Budget</label>
            <input
              name="budget"
              value={editForm.budget}
              onChange={handleEditChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeEdit}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCustomTour;

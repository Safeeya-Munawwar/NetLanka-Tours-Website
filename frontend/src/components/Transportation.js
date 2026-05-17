import React, { useState, useEffect } from "react";
import {
  FaPlaneArrival,
  FaPlaneDeparture,
  FaHotel,
  FaShuttleVan,
  FaCalendarCheck,
} from "react-icons/fa";
import axios from "../axiosConfig";

const Transportation = ({ transport = [] }) => {
  const [showCustomize, setShowCustomize] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    page: "transport",
    location: "",
    tourPrice: 0,
    transportPrice: 0,
    members: 1,
    total: 0,
    name: "",
    email: "",
    phone: "",
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    pickupTime: "",
    vehicle: "",
  });

  const pickupsDrops = [
    {
      type: "Pickup",
      method: "Airport Pickup",
      location: "Bandaranaike International Airport (CMB)",
      date: "10th Sep 2025",
      time: "09:00 AM",
      icon: <FaPlaneArrival size={18} />,
      color: "border-blue-500",
      bg: "bg-blue-50",
    },
    {
      type: "Drop",
      method: "Hotel Drop",
      location: "Galle Fort",
      date: "10th Sep 2025",
      time: "11:00 AM",
      icon: <FaHotel size={18} />,
      color: "border-red-500",
      bg: "bg-red-50",
    },
    {
      type: "Drop",
      method: "Airport Drop",
      location: "Bandaranaike International Airport (CMB)",
      date: "15th Sep 2025",
      time: "05:00 PM",
      icon: <FaPlaneDeparture size={18} />,
      color: "border-red-500",
      bg: "bg-red-50",
    },
  ];

  useEffect(() => {
    setVehicles(
      transport.map((v) => ({
        ...v,
        img: v.img
          ? v.img.startsWith("http")
            ? v.img
            : `${axios.defaults.baseURL}${v.img}`
          : "",
      }))
    );
  }, [transport]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    if (name === "members") {
      const membersNum = parseInt(value, 10) || 1;
      newForm.members = membersNum;
      const tourPrice = Number(newForm.tourPrice) || 0;
      const transportPrice = Number(newForm.transportPrice) || 0;
      newForm.total = tourPrice * membersNum + transportPrice;
    }

    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/bookings", {
        tourId: "transport-service",
        tourTitle: form.location,
        ...form,
      });

      alert("Your transport booking has been saved successfully!");
      setForm({
        location: "",
        tourPrice: 0,
        transportPrice: 0,
        members: 1,
        total: 0,
        name: "",
        email: "",
        phone: "",
        pickupLocation: "",
        dropLocation: "",
        pickupDate: "",
        pickupTime: "",
        vehicle: "",
      });
      setShowCustomize(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Comfortable Transportation Section */}
      <section className="relative overflow-hidden py-16">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/ella1.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>

        {/* Content Wrapper */}
        <div className="relative z-20 max-w-7xl mx-auto px-5">
          {/* Section Title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900">
              Comfortable Transportation
            </h2>
            <p className="text-gray-700 md:text-lg">
              Whether solo or in a group, enjoy hassle-free travel with safe,
              air-conditioned vehicles included in every package.
            </p>
          </div>

          {/* Vehicles Grid */}
          <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {vehicles.length ? (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.name}
                  onClick={() => {
                    setSelectedVehicle(vehicle.name);
                    setForm({ ...form, vehicle: vehicle.name });
                  }}
                  className={`w-full max-w-xs sm:max-w-sm md:max-w-md border-2 rounded-xl overflow-hidden cursor-pointer transform bg-white shadow-md transition duration-300 hover:scale-105 hover:shadow-xl ${
                    selectedVehicle === vehicle.name
                      ? "border-green-800"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={vehicle.img}
                    alt={vehicle.name}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover"
                  />
                  <h4 className="text-center mt-2 font-semibold text-sm sm:text-base">
                    {vehicle.name}
                  </h4>
                  <p className="text-center text-gray-600 text-xs sm:text-sm p-2">
                    {vehicle.details}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">
                No transport options available.
              </p>
            )}
          </div>

          {/* View More Button */}
          {vehicles.length > 0 && (
            <div className="flex justify-center mt-6 w-full">
              <button
                onClick={() => (window.location.href = "/transport")}
                className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaShuttleVan /> View More Transports
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Pickup & Drop Section */}
      <section className="text-center px-4 mb-6 max-w-6xl mx-auto pt-14">
        <div className="flex justify-center gap-6 mb-4 text-green-800 text-3xl">
          <FaPlaneArrival />
          <FaHotel />
          <FaPlaneDeparture />
        </div>
        <h3 className="text-2xl font-semibold text-green-900 mb-2">
          Pickup & Drop Services
        </h3>
        <p className="text-gray-600 mb-6">
          Hassle-free airport and hotel transfers with comfortable vehicles.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {pickupsDrops.map((item, idx) => (
            <div
              key={idx}
              className={`w-full max-w-xs sm:max-w-sm border-l-4 ${item.color} ${item.bg} p-3 rounded-lg shadow-md cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <p className="flex items-center gap-2 mb-1 text-sm sm:text-base">
                {item.icon} <strong>{item.type}</strong>
              </p>
              <p className="mb-1 text-sm sm:text-base">
                <strong>Method:</strong> {item.method}
              </p>
              <p className="mb-1 text-sm sm:text-base">
                <strong>Location:</strong> {item.location}
              </p>
              <p className="mb-1 text-sm sm:text-base">
                <strong>Date:</strong> {item.date}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Time:</strong> {item.time}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Book Transport Button */}
      <div className="flex justify-center mt-10 pb-12">
        <button
          onClick={() => setShowCustomize(!showCustomize)}
          className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <FaCalendarCheck />
          {showCustomize ? "Close Booking Form" : "Book Your Transport"}
        </button>
      </div>

      {/* Modal Form */}
      {showCustomize && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowCustomize(false)}
        >
          <form
            className="bg-white rounded-xl w-full max-w-md p-6 flex flex-col gap-4 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3 className="text-green-800 text-xl font-semibold mb-4 text-center">
              Book Transport
            </h3>

            {/* Input Fields */}
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Tour / Location"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Name"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Phone"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="number"
              name="members"
              value={form.members}
              onChange={handleChange}
              placeholder="Members"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="text"
              name="vehicle"
              value={form.vehicle}
              onChange={handleChange}
              placeholder="Vehicle"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
              readOnly
            />
            <input
              type="text"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              placeholder="Pickup Location"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="text"
              name="dropLocation"
              value={form.dropLocation}
              onChange={handleChange}
              placeholder="Drop Location"
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="date"
              name="pickupDate"
              value={form.pickupDate}
              onChange={handleChange}
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />
            <input
              type="time"
              name="pickupTime"
              value={form.pickupTime}
              onChange={handleChange}
              className="border border-green-600 rounded-lg p-2 w-full focus:outline-none"
            />

            <p className="text-gray-500 text-sm italic mt-2 text-center">
              We will contact you for further details and pricing.
            </p>

            {/* Form Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-900 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400 transition"
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

export default Transportation;

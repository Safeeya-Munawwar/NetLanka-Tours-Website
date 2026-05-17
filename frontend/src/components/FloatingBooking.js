import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import emailjs from "@emailjs/browser";

const FloatingBooking = () => {
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    tourId: "",
    location: "",
    tourPrice: 0, // 👈 per person
    transportPrice: 0, // 👈 fixed vehicle cost
    members: 1,
    total: 0,
    name: "",
    email: "",
    phone: "",
    page: "floatingBooking",
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    vehicle: "",
  });

  const initialFormState = { ...bookingForm };

  useEffect(() => {
    axios.get("/api/tours").then((res) => {
      setTours(res.data);
    });
  }, []);

  // Select Tour
  const handleTourSelect = (e) => {
    const selected = tours.find((t) => t._id === e.target.value);
    if (selected) {
      const price = Number(selected.price) || 0;
      setSelectedTour(selected);
      setBookingForm((prev) => ({
        ...prev,
        tourId: selected._id,
        location: selected.location,
        tourPrice: price,
        transportPrice: 0,
        members: 1,
        total: price, // initial total
        vehicle: "",
      }));
    }
  };

  // Select Transport
  const handleTransportSelect = (e) => {
    const vehicle = e.target.value;
    const transportPrice = Number(
      selectedTour?.transportPrices?.[vehicle] || 0
    );

    setBookingForm((prev) => {
      const total = prev.tourPrice * prev.members + transportPrice;
      return { ...prev, vehicle, transportPrice, total };
    });
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...bookingForm, [name]: value };

    if (name === "members") {
      const membersNum = parseInt(value, 10) || 1;
      updated.members = membersNum;

      const tourPrice = Number(updated.tourPrice) || 0;
      const transportPrice = Number(updated.transportPrice) || 0;

      updated.total = tourPrice * membersNum + transportPrice;
    }

    setBookingForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save booking in DB
      await axios.post("/api/bookings", {
        tourId: bookingForm.tourId,
        tourTitle: bookingForm.location,
        ...bookingForm,
      });

      // Send Email
      const templateParams = {
        tour_location: bookingForm.location,
        tour_price: bookingForm.tourPrice,
        members: bookingForm.members,
        transport: bookingForm.vehicle,
        transport_price: bookingForm.transportPrice,
        total_price: bookingForm.total,
        user_name: bookingForm.name,
        user_email: bookingForm.email,
        user_phone: bookingForm.phone,
        pickup_location: bookingForm.pickupLocation,
        pickup_date: bookingForm.pickupDate,
        pickup_time: bookingForm.pickupTime,
      };

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      );

      alert("Booking sent and saved successfully!");

      setBookingForm(initialFormState);
      setSelectedTour(null);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save/send booking. Try again.");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: "fixed",
          bottom: "110px",
          right: "20px",
          background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
          color: "white",
          padding: "14px 20px",
          borderRadius: "50px",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          zIndex: 2000,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onClick={() => setShowModal(true)}
      >
        📅 <span>Book a Tour</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            padding: "15px",
          }}
          onClick={() => setShowModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              padding: "25px 30px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "420px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
              borderTop: "5px solid #2e7d32",
              maxHeight: "90vh", // 👈 limit modal height
              overflowY: "auto", // 👈 scroll inside modal
            }}
          >
            <h2 style={{ marginBottom: "15px", color: "#2e7d32" }}>
              Book Your Tour
            </h2>

            {/* Tour Select */}
            <label>Select Tour</label>
            <select
              value={bookingForm.tourId}
              onChange={handleTourSelect}
              required
              style={{ marginBottom: "12px", padding: "10px" }}
            >
              <option value="">-- Choose a Tour --</option>
              {tours.map((tour) => (
                <option key={tour._id} value={tour._id}>
                  {tour.title} ({tour.location})
                </option>
              ))}
            </select>

            {/* Transport Select */}
            {selectedTour && selectedTour.transport?.length > 0 && (
              <>
                <label>Select Transport</label>
                <select
                  value={bookingForm.vehicle}
                  onChange={handleTransportSelect}
                  required
                  style={{ marginBottom: "12px", padding: "10px" }}
                >
                  <option value="">-- Choose Transport --</option>
                  {selectedTour.transport.map((t) => (
                    <option key={t} value={t}>
                      {t} - LKR {selectedTour.transportPrices?.[t]}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label>Price per Person (LKR)</label>
            <input
              value={bookingForm.tourPrice}
              readOnly
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Transport Price (LKR)</label>
            <input
              value={bookingForm.transportPrice}
              readOnly
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Members</label>
            <input
              type="number"
              name="members"
              value={bookingForm.members}
              onChange={handleChange}
              min="1"
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Total (LKR)</label>
            <input
              value={bookingForm.total}
              readOnly
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={bookingForm.name}
              onChange={handleChange}
              required
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={bookingForm.email}
              onChange={handleChange}
              required
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={bookingForm.phone}
              onChange={handleChange}
              required
              style={{ marginBottom: "15px", padding: "10px" }}
            />

            <label>Pickup Location</label>
            <input
              type="text"
              name="pickupLocation"
              value={bookingForm.pickupLocation}
              onChange={handleChange}
              required
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Pickup Date</label>
            <input
              type="date"
              name="pickupDate"
              value={bookingForm.pickupDate}
              onChange={handleChange}
              required
              style={{ marginBottom: "12px", padding: "10px" }}
            />

            <label>Pickup Time</label>
            <input
              type="time"
              name="pickupTime"
              value={bookingForm.pickupTime}
              onChange={handleChange}
              required
              style={{ marginBottom: "15px", padding: "10px" }}
            />

            <button
              type="submit"
              style={{
                background: "#2e7d32",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                background: "#ccc",
                padding: "10px",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingBooking;

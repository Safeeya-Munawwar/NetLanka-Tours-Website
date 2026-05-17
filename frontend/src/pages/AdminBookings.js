import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("tours"); // tours | transport
  const [filterTours, setFilterTours] = useState("all");
  const [filterTransport, setFilterTransport] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/bookings/page/${source}`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [source]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/bookings/${id}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const currentFilter = source === "tours" ? filterTours : filterTransport;
  const filteredBookings =
    currentFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === currentFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="inline text-green-700 text-lg" />;
      case "pending":
        return <FaClock className="inline text-yellow-600 text-lg" />;
      case "canceled":
        return <FaTimesCircle className="inline text-red-600 text-lg" />;
      default:
        return <FaClock className="inline text-gray-500 text-lg" />;
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto m-6 p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-500 shadow-lg">
      <h3 className="text-center text-green-900 font-extrabold text-3xl sm:text-4xl mb-10">
        Admin Bookings Management
      </h3>

      {/* Source Filter */}
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        {[
          { key: "tours", label: "Tours / Floating Booking" },
          { key: "transport", label: "Transport Booking" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setSource(btn.key)}
            className={`min-w-[180px] py-2 px-4 rounded-md font-semibold transition-all duration-300 
              ${
                source === btn.key
                  ? "bg-orange-500 text-white"
                  : "bg-green-900 text-white hover:bg-green-700"
              }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() =>
              source === "tours" ? setFilterTours(f) : setFilterTransport(f)
            }
            className={`min-w-[130px] py-2 px-4 rounded-md font-semibold transition-all duration-300 
              ${
                currentFilter === f
                  ? "bg-orange-500 text-white"
                  : "bg-green-900 text-white hover:bg-green-700"
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-md">
        {loading ? (
          <p className="text-center text-gray-700 font-medium">
            Loading bookings...
          </p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center text-gray-700 font-medium">
            No bookings found.
          </p>
        ) : (
          <table className="w-full border border-green-900 border-collapse min-w-[900px]">
            <thead className="bg-green-900 text-white text-sm">
              <tr>
                {[
                  "Date",
                  "Name",
                  "Email",
                  "Phone",
                  source === "tours" ? "Tour" : "Vehicle",
                  "Location",
                  ...(source === "transport" ? ["Pickup", "Drop"] : []),
                  "Members",
                  "Pickup Date",
                  "Pickup Time",
                  "Total (LKR)",
                  "Status",
                  "Actions",
                ].map((th) => (
                  <th
                    key={th}
                    className="border border-green-800 p-3 font-semibold"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const status = b.status || "pending";
                const rowBg =
                  status === "completed"
                    ? "bg-green-100"
                    : status === "canceled"
                    ? "bg-red-100"
                    : "bg-yellow-100";

                return (
                  <tr
                    key={b._id}
                    className={`${rowBg} border border-green-800 text-sm`}
                  >
                    <td className="p-2 border">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 border">{b.name}</td>
                    <td className="p-2 border">{b.email}</td>
                    <td className="p-2 border">{b.phone}</td>
                    <td className="p-2 border">
                      {source === "tours" ? b.tourTitle : b.vehicle}
                    </td>
                    <td className="p-2 border">{b.location}</td>
                    {source === "transport" && (
                      <>
                        <td className="p-2 border">{b.pickupLocation}</td>
                        <td className="p-2 border">{b.dropLocation}</td>
                      </>
                    )}
                    <td className="p-2 border">{b.members}</td>
                    <td className="p-2 border">
                      {b.pickupDate
                        ? new Date(b.pickupDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="p-2 border">{b.pickupTime}</td>
                    <td className="p-2 border">{b.total}</td>
                    <td className="p-2 border font-semibold text-center">
                      {getStatusIcon(status)}{" "}
                      <span className="ml-1">{status.toUpperCase()}</span>
                    </td>
                    <td className="p-2 border text-center">
                      {status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(b._id, "completed")}
                            className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-md mr-2"
                          >
                            Complete
                          </button>
                          <button
                        onClick={() => deleteBooking(b._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                        </>
                      )}
                      {(status === "completed" || status === "canceled") && (
                        <button
                          onClick={() => updateStatus(b._id, "pending")}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md"
                        >
                          Reset
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

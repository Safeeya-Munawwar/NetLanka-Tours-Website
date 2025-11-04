import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaSuitcase, FaCarSide, FaClock, FaDollarSign, FaUsers, FaSnowflake } from "react-icons/fa";
import { GiGearStick } from "react-icons/gi";

export default function UserTransport() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("/api/transport");
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="font-serif bg-[#f8fdf8] text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Hero Section */}
      <div
        className="w-full h-[400px] md:h-[450px] lg:h-[500px] relative flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url(/images/transport.PNG)" }}
      >
<div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
        <h1 className="text-2xl sm:text-3xl md:text-5xl text-green-950 font-serif font-semibold drop-shadow-md mb-4 sm:mb-6">
             Sri Lanka - Personal Driver and Vehicle Hire
          </h1>
          <p className="text-black text-base md:text-lg leading-relaxed">
            Exploring Sri Lanka becomes effortless and enjoyable with the comfort
            of a private driver and vehicle at your service. From golden beaches
            and sacred temples to misty mountains and charming villages, every
            journey offers a chance to uncover the island’s unique beauty.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center bg-yellow-50 border-2 border-green-900 p-5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
            <FaUsers className="text-3xl text-green-700 mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Wide Range of Vehicles</h3>
            <p className="text-green-800 text-sm">
              From compact cars for solo travelers to spacious SUVs for larger groups, we have the perfect ride for everyone.
            </p>
          </div>
          <div className="flex flex-col items-center bg-yellow-50 border-2 border-green-900 p-5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
            <FaUser className="text-3xl text-green-700 mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Professional Drivers</h3>
            <p className="text-green-800 text-sm">
              Our drivers are highly trained, licensed, and committed to providing exceptional service.
            </p>
          </div>
          <div className="flex flex-col items-center bg-yellow-50 border-2 border-green-900 p-5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
            <FaDollarSign className="text-3xl text-green-700 mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Transparent Pricing</h3>
            <p className="text-green-800 text-sm">
              With our transparent pricing system, you'll know the exact fare before you book.
            </p>
          </div>
          <div className="flex flex-col items-center bg-yellow-50 border-2 border-green-900 p-5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
            <FaClock className="text-3xl text-green-700 mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">24/7 Availability</h3>
            <p className="text-green-800 text-sm">
              Our services are available round the clock, every day of the year. We're just a click away.
            </p>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {vehicles.map((v) => {
            const vehicle = v.vehicles?.[0];
            if (!vehicle) return null;

            return (
              <div
                key={v._id}
                className="bg-yellow-50 rounded-xl overflow-hidden shadow-md border-2 border-green-900 cursor-pointer transform transition hover:scale-105 hover:shadow-lg"
              >
                {v.image && (
                  <img
                    src={v.image}
                    alt={vehicle.type}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">{vehicle.type}</h3>

                  <div className="flex justify-between text-green-800 mb-2">
                    <div className="flex flex-col items-center">
                      <FaUser className="text-xl mb-1" />
                      <span>{vehicle.seats}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <GiGearStick className="text-xl mb-1" />
                      <span>Manual / Auto</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaSuitcase className="text-xl mb-1" />
                      <span>{vehicle.luggage}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaCarSide className="text-xl mb-1" />
                      <span>{vehicle.capacity}</span>
                    </div>
                    <div className="flex flex-col items-center">
  <FaSnowflake className="text-xl mb-1" />
  <span>{vehicle.ac === true || vehicle.ac?.toLowerCase() === "ac" ? "AC" : "Non-AC"}</span>
</div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

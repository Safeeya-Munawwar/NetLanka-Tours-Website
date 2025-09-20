// src/components/OurTours.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const OurTours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/tours`);
        // Show only first 10 tours
        setTours(res.data.slice(0, 9));
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="px-5 md:px-12 py-10 max-w-[1400px] mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
          Our Tours
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore some of our most loved tours. Discover breathtaking destinations with unforgettable experiences.
        </p>
      </div>

      {/* Images Grid inside one box */}
      <div className="mx-1200 overflow-hidden shadow-xl border-2">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3">
          {tours.map((tour, idx) => (
            <div
              key={idx}
              className="relative w-full h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56"
            >
              <img
                src={tour.imageUrl || tour.image}
                alt={tour.title || tour.name}
                className="w-full h-full object-cover"
              />
              {/* Title overlay at bottom-right (plain white text) */}
              <div className="absolute bottom-2 right-2 text-white text-xs sm:text-sm md:text-base font-semibold drop-shadow-lg">
                {tour.title || tour.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTours;

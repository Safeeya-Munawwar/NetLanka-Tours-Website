// src/components/OurTours.js
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

const OurTours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get("/api/tours");
        setTours(res.data.slice(0, 12)); // show first 12 tours
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="px-5 md:px-12 py-16 max-w-[1400px] mx-auto">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">
          Our Tours
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore some of our most loved tours. Discover breathtaking destinations with unforgettable experiences.
        </p>
      </div>

      {/* Masonry / Photo Collage Gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {tours.map((tour, idx) => (
          <div
            key={idx}
            className="relative break-inside-avoid rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={tour.imageUrl || tour.image}
              alt={tour.title || tour.name}
              className="w-full object-cover"
              style={{ aspectRatio: "4 / 3" }} // maintains consistent image ratio
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-3 text-sm sm:text-base font-semibold backdrop-blur-sm">
              {tour.title || tour.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTours;

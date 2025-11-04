// src/components/TourCard.js
import React from "react";
import { FaSuitcaseRolling } from "react-icons/fa";

const TourCard = ({ tour, showViewMore = false, popularTours = [] }) => {
  // ✅ Render Single Tour Card
  if (tour) {
    return (
      <div className="bg-gradient-to-br from-white to-green-50 p-4 rounded-2xl shadow-lg border-2 border-black h-[360px] flex flex-col justify-between transition-transform duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
        <img
          src={tour.imageUrl || tour.image || "/images/default-tour.jpg"}
          alt={tour.title || tour.name || "Tour Image"}
          className="w-full h-[180px] rounded-xl object-cover border-2 border-black transition-all duration-300"
        />
        <h3 className="text-green-900 font-bold text-xl mt-2">
          {tour.title || tour.name}
        </h3>
        <p className="text-gray-700 text-sm mt-1 h-[100px] overflow-hidden leading-5">
          {tour.shortDescription ||
            tour.description ||
            "Explore this amazing tour! 🌴"}
        </p>
      </div>
    );
  }

  // ✅ Render "View More" Button
  if (showViewMore) {
    return (
      <div className="flex justify-center mt-6 w-full">
        <button
          onClick={() => (window.location.href = "/Tours")}
          className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
  >
    <FaSuitcaseRolling />View More Tours & Details
        </button>
      </div>
    );
  }

  // ✅ Render Section with Background + Grid
  if (popularTours.length > 0) {
    return (
      <section className="relative overflow-hidden py-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/galle5.jpg')" }}
        ></div>

        {/* White Blur Overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900">
              Popular Tours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {popularTours.map((tour, idx) => (
              <TourCard key={idx} tour={tour} />
            ))}
          </div>

          <TourCard showViewMore />
        </div>
      </section>
    );
  }

  return null;
};

export default TourCard;

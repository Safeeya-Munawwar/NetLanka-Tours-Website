import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { FaGlobe, FaUserFriends, FaMapMarkedAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Slideshow = ({ title, images = [], stats = [] }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-[120vh] overflow-hidden font-serif">
      {/* Background slideshow */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.55)",
          }}
        />
      ))}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6 md:px-12 lg:px-20 -mt-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-xl animate-fadeDown tracking-wide mt-20 sm:mt-0">
          {title || "Net Lanka Tours & Holidays"}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl leading-relaxed animate-fadeUp">
          Experience breathtaking landscapes, ancient heritage, and tropical
          luxury - all in one island.
        </p>

        {/* CTA Buttons - Only 2 buttons */}
        <div className="flex flex-wrap justify-center gap-5 mb-10 animate-fadeUp">
          <button
            onClick={() => navigate("/tours")}
            className="bg-orange-500 hover:bg-orange-600 px-7 py-3 rounded-full font-medium text-white text-base transition-all duration-300 shadow-md"
          >
            Plan Your Trip
          </button>
          <button
            onClick={() => navigate("/destinations")}
            className="border border-white px-7 py-3 rounded-full font-medium text-white hover:bg-white hover:text-green-900 text-base transition-all duration-300 shadow-md"
          >
            Explore Destinations
          </button>
        </div>

        {/* Search Bar - hidden on mobile */}
        <div className="hidden sm:flex items-center w-full max-w-xl mx-auto mb-12 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center flex-1 bg-white px-5 sm:px-6 h-12 sm:h-14">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-base sm:text-lg mr-3 sm:mr-4"></i>
            <input
              type="text"
              placeholder="Search tours or destinations..."
              className="flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 pt-5"
            />
          </div>

          <button className="h-12 sm:h-14 px-6 sm:px-8 bg-green-700 text-white font-medium text-sm sm:text-base hover:bg-green-800 active:scale-95 transition-all duration-200">
            Search
          </button>
        </div>

        {/* Stats Section */}
        {stats.length > 0 && (
          <div className="w-full flex flex-wrap justify-center gap-4 mt-8 lg:mt-0 lg:absolute lg:bottom-10">
            <StatCard
              stats={stats.map((s, i) => ({
                ...s,
                icon:
                  s.icon ||
                  [<FaGlobe />, <FaUserFriends />, <FaMapMarkedAlt />][i % 3],
              }))}
            />
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 1.2s ease-out forwards; }
        .animate-fadeDown { animation: fadeDown 1.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Slideshow;

import React from "react";
import StatCard from "../components/StatCard";

const Slideshow = ({ title, images, navCards = [], stats = [] }) => {
  if (!images || images.length === 0) return null;

  const loopImages = [...images, ...images];

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      {/* Sliding Background */}
      <div className="absolute inset-0 flex h-full z-10">
        <div
          className="flex animate-slideLeft w-max"
          style={{ width: `${loopImages.length * 100}vw` }}
        >
          {loopImages.map((img, idx) => (
            <div
              key={idx}
              className="w-screen h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${img})`, filter: "brightness(0.6)" }}
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b3d2e]/80 via-[#1f513f]/50 to-transparent z-20"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-20 z-30">
        {/* Hero Title */}
        <h1 className="text-white text-4xl md:text-6xl font-serif font-semibold drop-shadow-lg mb-4">
          {title}
        </h1>
        <p className="text-white text-lg md:text-2xl mb-6 drop-shadow-md">
          Explore the beauty, adventure, and culture of Sri Lanka with us!
        </p>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-xl mx-auto mb-8 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center flex-1 bg-white px-5 sm:px-6 h-12 sm:h-14">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-base sm:text-lg mr-3 sm:mr-4"></i>
            <input
              type="text"
              placeholder="Search tours or destinations..."
              className="flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 pt-5"
            />
          </div>

          <button
            className="h-12 sm:h-14 px-6 sm:px-8 bg-green-700 text-white font-medium text-sm sm:text-base hover:bg-green-800 active:scale-95 transition-all duration-200"
          >
            Search
          </button>
        </div>

        {/* Navigation Cards */}
        {navCards.length > 0 && (
          <div className="mt-4 w-full gap-2 mb-8 hidden md:flex">
            {navCards.map((card, idx) => (
              <div
                key={idx}
                className="relative flex-1 h-14 bg-white bg-opacity-20 backdrop-blur-md rounded-lg cursor-pointer overflow-hidden group flex justify-center items-center"
                onClick={() => (window.location.href = card.link)}
              >
                <div className="relative z-10 text-white text-sm md:text-base font-medium flex flex-col items-center justify-center">
                  {card.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="w-full mt-10">
          <StatCard stats={stats} />
        </div>
      </div>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes slideLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-slideLeft {
            animation: slideLeft 20s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Slideshow;

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
              style={{ backgroundImage: `url(${img})`, filter: "blur(1.5px)" }}
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-20"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-20 z-30">
        {/* Hero Title */}
        <h1 className="text-white text-4xl md:text-6xl font-serif font-semibold drop-shadow-lg">
          {title}
        </h1>
        <p className="text-white text-lg md:text-2xl mt-4 mb-6 drop-shadow-md">
          Explore the beauty, adventure, and culture of Sri Lanka with us!
        </p>

        {/* Search Bar */}
        <div className="flex w-full max-w-3xl mb-6">
          <input
            type="text"
            placeholder="Search tours or destinations..."
            className="flex-1 p-3 rounded-l-lg border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          />
          <button className="bg-green-700 hover:bg-green-800 text-white px-6 rounded-r-lg font-semibold transition">
            Search
          </button>
        </div>

        {/* Navigation Cards */}
        {navCards.length > 0 && (
          <div className="mt-4 flex w-full gap-2 mb-8">
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

        {/* ✅ Stats Section inside slideshow */}
        <div>
          <section>
            <StatCard stats={stats} />
          </section>
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
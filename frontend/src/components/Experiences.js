import React, { useEffect, useState } from "react";
import axios from "axios";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/experiences")
      .then((res) => setExperiences(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (

    <div className="font-serif bg-[#f8fdf8] text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
    {/* Hero Section */}
    <div
      className="w-full h-[400px] md:h-[450px] lg:h-[500px] relative flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url(/images/experience.PNG)" }}
    >
<div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
        <h1 className="text-2xl sm:text-3xl md:text-5xl text-green-950 font-serif font-semibold drop-shadow-md mb-4 sm:mb-6">
             Discover Unique Experiences Across Sri Lanka
        </h1>
        <p className="text-black text-base md:text-lg leading-relaxed">
        Discover unforgettable adventures with our curated experiences across Sri Lanka - from cultural immersions and wildlife safaris to scenic hikes and local culinary tours. Each experience is designed to create lasting memories and unique stories.</p>
      
      </div>
    </div>

      {/* Experience Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 py-6">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="bg-[#eaeff7] p-3 shadow-lg rounded-md border-4 border-[#d4e6f3] hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white shadow-inner rounded-sm p-2">
              <img
                src={`http://localhost:5000${exp.imageUrl}`}
                alt={exp.title}
                className="w-full h-56 object-cover rounded-sm"
              />
            </div>
            <div className="text-center py-4">
              <h3 className="text-lg md:text-xl font-bold text-[#1a457a] font-serif">
                {exp.title}
              </h3>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;

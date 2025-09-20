// src/components/ChooseCard.js
import React from "react";
import { FaPlaneDeparture, FaMoneyBillWave, FaMapSigns, FaUserTie } from "react-icons/fa";

const ChooseCard = () => {
  const features = [
    {
      title: "Seamless Travel Planning",
      desc: "Enjoy a hassle-free journey with smooth booking and detailed itineraries crafted for your comfort.",
      icon: <FaPlaneDeparture className="text-4xl mb-4 text-white" />,
    },
    {
      title: "Affordable to Luxury Options",
      desc: "Choose from budget-friendly tours to premium luxury experiences that fit your style and budget.",
      icon: <FaMoneyBillWave className="text-4xl mb-4 text-white" />,
    },
    {
      title: "Tailor-Made Experience",
      desc: "Personalized trips designed around your preferences, ensuring every moment feels unique.",
      icon: <FaMapSigns className="text-4xl mb-4 text-white" />,
    },
    {
      title: "Expert Local Guides",
      desc: "Discover hidden gems and authentic stories with our knowledgeable local guides.",
      icon: <FaUserTie className="text-4xl mb-4 text-white" />,
    },
  ];

  return (
    <section className="py-12 px-6 md:px-16 bg-white">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We go beyond ordinary tours to bring you unforgettable experiences
          with exceptional service, flexibility, and expertise.
        </p>
      </div>

      {/* Features Grid (2x2 layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-green-900 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {feature.icon}
            <h3 className="text-xl text-lime-400 font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChooseCard;

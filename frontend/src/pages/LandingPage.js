import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaHotel, FaThumbsUp, FaCreditCard } from "react-icons/fa";
import axios from "axios";
import DestinationCard from "../components/DestinationCard";

export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const globeRef = useRef(null);
  const destinationsRef = useRef(null);
  const navigate = useNavigate();

  const [, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/destinations");
        setDestinations(res.data);
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div>
      {/* 🌄 Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[70vh] sm:h-[80vh] md:h-screen flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 md:px-12"
        style={{
          backgroundImage: "url('/12.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b3d2e]/80 via-[#1f513f]/50 to-transparent"></div>

        <div className="relative z-10 max-w-[90%] sm:max-w-[80%] lg:max-w-4xl">

          <p className="text-xs sm:text-sm tracking-widest mb-2 sm:mb-3 break-words font-serif">
            netlankatours.com
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-snug sm:leading-tight mb-4 sm:mb-6 break-words">
            <span className="block">SPIRIT</span>
            <span className="block text-xl sm:text-3xl md:text-4xl lg:text-5xl mt-1 sm:mt-2 text-[#a5e6a5] break-words">
              OF SRI LANKA
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate("/home")}
              className="bg-white text-[#14532d] px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-[#d6f5d6] transition"
              >
              Discover
            </button>

            <button
              onClick={() => navigate("/tours")}
              className="bg-white text-[#14532d] px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-[#d6f5d6] transition"
            >
              Plan your trip
            </button>
          </div>
        </div>
      </section>

      {/* 🛡️ Features Section */}
      <section
        ref={featuresRef}
        className="py-12 sm:py-20 bg-white text-center px-4 sm:px-6 md:px-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-[#14532d]">
          WHAT SETS US APART
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: (
                <FaShieldAlt className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />
              ),
              text: "Safety Travels",
            },
            {
              icon: (
                <FaHotel className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />
              ),
              text: "Luxury Feel",
            },
            {
              icon: (
                <FaThumbsUp className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />
              ),
              text: "Good Service",
            },
            {
              icon: (
                <FaCreditCard className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />
              ),
              text: "Secured Payment",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 sm:hover:-translate-y-2"
            >
              {item.icon}
              <h3 className="text-sm sm:text-base font-semibold text-[#090420]">
                {item.text}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 🌍 Globe Section */}
      <section
        ref={globeRef}
        className="relative py-40 sm:py-72 text-center text-white overflow-hidden"
        style={{
          backgroundImage: "url('/SriLanka1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#0b3d2e",
        }}
      ></section>

      {/* 🏝️ Destinations Section */}
      <section
        ref={destinationsRef}
        className="py-12 sm:py-20 text-center bg-white px-4 sm:px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          {/* Destinations */}
          <section>
            <DestinationCard />
          </section>
        </div>
      </section>
    </div>
  );
}

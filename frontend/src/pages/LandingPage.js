import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaHotel, FaThumbsUp, FaCreditCard } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const globeRef = useRef(null);
  const destinationsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000); // ⏱ redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  const scrollToSection = (ref) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const destinations = [
    { name: "ELLA", img: "/images/ella.PNG" },
    { name: "KANDY", img: "/images/Kandy1.PNG" },
    { name: "GALLE", img: "/images/galle.PNG" },
  ];

  return (
    <div className="font-sans">
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
    <p className="text-xs sm:text-sm tracking-widest mb-2 sm:mb-3 break-words  font-serif ">
      netlankatours.com
    </p>
    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-snug sm:leading-tight mb-4 sm:mb-6 break-words">
      <span className="block">SPIRIT</span>
      <span className="block text-xl sm:text-3xl md:text-4xl lg:text-5xl mt-1 sm:mt-2 text-[#a5e6a5] break-words">
        OF SRI LANKA
      </span>
    </h1>
    <button
      onClick={() => navigate("/tours")}
      className="bg-white text-[#0f0a34] px-5 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-[#d6f5d6] transition"
    >
      Plan your trip
    </button>
  </div>
</section>

{/* 🛡️ Features Section */}
<section ref={featuresRef} className="py-12 sm:py-20 bg-white text-center px-4 sm:px-6 md:px-12">
  <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-[#14532d]">
    WHAT SETS US APART
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
    {[
      { icon: <FaShieldAlt className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />, text: "Safety Travels" },
      { icon: <FaHotel className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />, text: "Luxury Feel" },
      { icon: <FaThumbsUp className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />, text: "Good Service" },
      { icon: <FaCreditCard className="text-4xl sm:text-5xl text-[#1f513f] mx-auto mb-4" />, text: "Secured Payment" },
    ].map((item, index) => (
      <div
        key={index}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 sm:hover:-translate-y-2"
      >
        {item.icon}
        <h3 className="text-sm sm:text-base font-semibold text-[#090420]">{item.text}</h3>
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
      <section ref={destinationsRef} className="py-12 sm:py-20 text-center bg-white px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-10 gap-4 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#14532d]">
              Explore Our Exclusive Destinations
            </h2>
            <button
              onClick={() => navigate("/destinations")}
              className="text-white bg-[#09061f] font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md hover:bg-[#144d35] transition"
            >
              View all
            </button>
          </div>

          <p className="text-[#090b2e] text-base sm:text-lg mb-8 sm:mb-12">
            Enjoy a stress-free vacation with all your needs covered.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {destinations.map((dest, index) => (
              <motion.div
                key={index}
                className="relative bg-white shadow-xl rounded-2xl overflow-hidden border-2 border-[#1f513f] hover:border-[#14532d] transition-all duration-300 p-2 sm:p-3"
                initial={{ rotateX: 90, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
              >
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-40 sm:h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="py-2 sm:py-4 flex flex-col items-center">
                  <h3 className="text-base sm:text-lg md:text-xl text-[#070823] font-semibold mb-2 sm:mb-3 tracking-wide">
                    {dest.name}
                  </h3>
                  <button
                    onClick={() => navigate("/destinations")}
                    className="bg-[#14532d] text-[#e8f5e9] px-4 sm:px-6 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-[#0b3d2e] transition"
                  >
                    Explore More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

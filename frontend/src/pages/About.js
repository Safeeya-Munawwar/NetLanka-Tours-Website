import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LOCALSTORAGE_KEY = "mahaweli_about_data";

function About() {
  const [aboutTexts, setAboutTexts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAboutTexts(parsed.aboutTexts || []);
      setTestimonials(parsed.testimonials || []);
    } else {
      setAboutTexts([
        "Net Lanka Tours & Holidays started in 2009 in Kandy. Our goal is to provide exceptional travel experiences across Sri Lanka with customized packages.",
        "We provide luxury vehicles and experienced guides for sightseeing, adventure tours, cultural visits, and wildlife safaris. We ensure every guest leaves with unforgettable memories.",
      ]);
      setTestimonials([
        {
          id: 1,
          name: "John Smith",
          message: "Excellent service! The trip was smooth and unforgettable!",
          date: "2025-06-15",
        },
        {
          id: 2,
          name: "Maria Gomez",
          message:
            "Our family loved the tour! Everything was perfectly arranged.",
          date: "2025-07-10",
        },
        {
          id: 3,
          name: "Liam Wong",
          message: "One of the best holidays we’ve ever had. Highly recommend!",
          date: "2025-08-01",
        },
        {
          id: 4,
          name: "Emma Lee",
          message: "Fantastic guide and perfect planning for our trip.",
          date: "2025-08-20",
        },
      ]);
    }
    setLoading(false);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div
      className="flex flex-col items-center font-serif"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Hero Section */}
      <div
        className="w-full h-[350px] sm:h-[400px] md:h-[450px] flex flex-col justify-center items-center text-center bg-cover bg-center relative"
        style={{ backgroundImage: "url(/images/about.PNG)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
          <h1 className="text-2xl sm:text-3xl md:text-5xl text-green-950 font-serif font-semibold drop-shadow-md mb-4 sm:mb-6">
            The Best Travel Agency
          </h1>
          <p className="text-black text-base sm:text-lg md:text-xl max-w-md sm:max-w-3xl mx-auto leading-relaxed mb-4">
            At Net Lanka Tours, we are dedicated to creating unforgettable
            travel experiences across Sri Lanka. Our mission is to provide
            personalized, safe, and immersive tours that showcase the island’s
            natural beauty, rich heritage, and warm hospitality. With years of
            experience and a passion for adventure, we ensure every journey is
            unique and memorable.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1500px] w-full mt-10 p-6 sm:p-8 bg-green-100 shadow-lg flex flex-col gap-8">
        <section className="max-w-[1500px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Left: Text */}
            <div className="flex-1 px-2 md:px-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-green-900 font-semibold mb-4 text-center md:text-center">
                Net Lanka Tours – Explore Sri Lanka with Comfort & Style
              </h2>
              {aboutTexts.map((text, i) => (
                <p
                  key={i}
                  className="text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed mb-3 text-center md:text-justify"
                >
                  {text}
                </p>
              ))}
              <p className="text-gray-800 font-bold text-base sm:text-lg md:text-xl leading-relaxed mb-3 text-center md:text-center">
                Start your Adventure Today!
              </p>
            </div>
            {/* Right: Image */}
            <div className="flex-1 px-2 md:px-6">
              <img
                src="/images/sri.jpg"
                alt="About Us"
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Mission / Vision / Standards Section */}
      <section
        className="w-full bg-cover bg-center relative mt-12 overflow-hidden"
        style={{ backgroundImage: "url(/images/yala7.jpg)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-[1500px] mx-auto py-16 px-4 sm:px-6 md:px-20">
          <h2 className="text-3xl sm:text-3xl md:text-4xl text-green-900 font-semibold text-center mb-10">
            Our Mission, Vision & Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Mission */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">
                Mission
              </h3>
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                To provide safe, reliable, and enjoyable travel experiences
                across Sri Lanka, ensuring every journey is memorable.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">
                Vision
              </h3>
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                To be the most trusted and preferred tour operator in Sri Lanka
                for both local and international travelers.
              </p>
            </div>
            {/* Standards */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">
                Standards
              </h3>
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                Maintaining high-quality vehicles, professional service, and
                personalized travel experiences for every guest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book With Us Section */}
      <div className="max-w-[1500px] w-full mt-10 p-6 sm:p-8 bg-green-100 shadow-lg flex flex-col gap-8">
        <section className="max-w-[1500px] mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-green-900 font-semibold text-center mb-10">
            Why Book With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Tailor-Made Tours",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c.667 0 1.333.333 2 1l4 4-1.414 1.414L12 10l-4.586 4.414L6 13l4-4c.667-.667 1.333-1 2-1z"
                    />
                  </svg>
                ),
                text: "Custom itineraries designed to match your interests, preferences, and schedule.",
              },
              {
                title: "Unbeatable Value for Money",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                text: "High-quality experiences at competitive prices to make every trip worth it.",
              },
              {
                title: "Expert Personal Service",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ),
                text: "Professional guidance and assistance for a smooth and enjoyable journey.",
              },
              {
                title: "Experienced Guides",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M9 16h6M4 6h16"
                    />
                  </svg>
                ),
                text: "Knowledgeable local guides to enrich your experience with insights and stories.",
              },
              {
                title: "Choice of Accommodation",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.333 0-4 2-4 2s2.667 2 4 2 4-2 4-2-2.667-2-4-2z"
                    />
                  </svg>
                ),
                text: "A wide range of stays to suit all budgets and preferences.",
              },
              {
                title: "Enticing Range of Activities",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                  </svg>
                ),
                text: "From adventure to culture, there’s something for every traveler to enjoy.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-green-800 p-6 rounded-2xl shadow-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex justify-center mb-4 text-lime-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold text-lime-400 mb-4">
                  {item.title}
                </h3>
                <p className="text-white text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Testimonials Section */}
      <section
        className="w-full bg-cover bg-center relative mt-12 overflow-hidden"
        style={{ backgroundImage: "url(/images/yala7.jpg)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-[1500px] mx-auto py-16 px-4 sm:px-6 md:px-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-center text-green-900 font-semibold mb-12">
            Hear from Our Guests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 justify-center">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-black p-4 sm:p-6 rounded-2xl text-center transform transition duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.17 6A5.992 5.992 0 0 0 2 11.83v1.67h5v-5H4.5V9c0-1.38 1.12-2.5 2.5-2.5h.17V6zm10 0A5.992 5.992 0 0 0 12 11.83v1.67h5v-5h-1.67V9c0-1.38 1.12-2.5 2.5-2.5h.17V6z" />
                  </svg>
                </div>
                <p className="italic text-base sm:text-lg md:text-xl text-gray-700 mb-2 sm:mb-4 leading-relaxed">
                  “{t.message}”
                </p>
                <h4 className="text-green-900 font-semibold text-base sm:text-lg md:text-xl">
                  {t.name}
                </h4>
                <small className="text-gray-500 block mt-1">{t.date}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;

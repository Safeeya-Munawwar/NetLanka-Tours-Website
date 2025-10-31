import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BACKEND_URL = "http://localhost:5000";

function UserDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [showToursModal, setShowToursModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch destinations
  const fetchDestinations = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/destinations`);
      setDestinations(res.data);

      const uniqueCategories = [
        "All",
        ...Array.from(new Set(res.data.map((d) => d.category).filter(Boolean))),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDestinations();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch tours by destination
  const handleViewTours = async (destination) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/tours/by-destination/${destination._id}`
      );
      setTours(res.data);
      setSelectedDestination(destination);
      setShowToursModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tours for this destination.");
    }
  };

  // Filter logic
  const filteredDestinations = destinations
    .filter((d) => activeCategory === "All" || d.category === activeCategory)
    .filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div
      className="flex flex-col items-center font-serif"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Hero Section */}
      <div
        className="w-full relative flex flex-col justify-center items-center text-center h-[400px] md:h-[450px] lg:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/ella1.jpg)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
          <h1 className="text-3xl md:text-5xl font-semibold text-green-900 mb-6 text-center drop-shadow-sm">
            Travel to Your Dream Destination
          </h1>
          <p className="text-black text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Discover Sri Lanka’s breathtaking beauty — from lush mountains and
            tea estates to golden beaches and ancient cities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-[80%] sm:w-[70%] max-w-md mx-auto mt-4 sm:mt-5 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 z-10">
          <div className="flex items-center flex-1 bg-white px-5 sm:px-6 h-12 sm:h-14">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-base sm:text-lg mr-3 sm:mr-4"></i>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-400 
              bg-transparent border-none focus:outline-none focus:ring-0 pt-5"
            />
          </div>
          <button
            className="h-12 sm:h-14 px-6 sm:px-8 bg-green-700 text-white 
            font-medium text-sm sm:text-base 
            hover:bg-green-800 active:scale-95 
            transition-all duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap gap-4 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium ${
              activeCategory === cat
                ? "bg-green-700 text-white shadow-md"
                : "bg-green-100 text-green-900 hover:bg-green-200"
            } transition-colors duration-200`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Destinations Section */}
      <div className="bg-green-50 w-full max-w-[1500px] p-6 sm:p-8 rounded-xl mt-4 shadow-lg">
        {filteredDestinations.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No destinations found.
          </p>
        ) : isMobile ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {filteredDestinations.map((dest) => (
              <SwiperSlide key={dest._id}>
                <div
                  className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-green-700 cursor-pointer transform transition hover:scale-105 hover:shadow-lg"
                  onClick={() => handleViewTours(dest)}
                >
                  {dest.imageUrl && (
                    <img
                      src={`${BACKEND_URL}${dest.imageUrl}`}
                      alt={dest.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 text-center">
                    <h3 className="text-green-900 text-lg font-medium">
                      {dest.name}
                    </h3>
                    <p className="text-gray-700 text-sm mt-1 line-clamp-3">
                      {dest.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-green-700 hover:scale-105 transition-transform duration-300"
              >
                {dest.imageUrl && (
                  <img
                    src={`${BACKEND_URL}${dest.imageUrl}`}
                    alt={dest.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {dest.description}
                  </p>
                  <button
                    onClick={() => handleViewTours(dest)}
                    className="w-full py-2 bg-green-700 text-white font-medium rounded hover:bg-green-800 transition-colors"
                  >
                    View Tours
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tours Modal */}
      {showToursModal && selectedDestination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg p-6 relative overflow-y-auto max-h-[80vh] shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 text-center">
              Tours in {selectedDestination.name}
            </h2>

            <button
              onClick={() => setShowToursModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            {tours.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">
                No tours available for this destination.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tours.map((tour) => (
                  <div
                    key={tour._id}
                    className="border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col"
                  >
                    {tour.imageUrl && (
                      <img
                        src={`${BACKEND_URL}${tour.imageUrl}`}
                        alt={tour.name}
                        className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-1">
                      {tour.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                      {tour.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-gray-600 text-sm">⏱ {tour.duration}</p>
                      <p className="text-green-700 font-semibold text-sm md:text-base">
                        💰 LKR {tour.price}
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < tour.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } text-sm md:text-base`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDestinations;

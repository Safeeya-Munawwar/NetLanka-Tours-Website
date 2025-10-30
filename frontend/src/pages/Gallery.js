import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BACKEND_URL = "http://localhost:5000";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/gallery`);
        setPhotos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPhotos();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col items-center font-serif"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Hero Section */}
      <div
        className="w-full relative flex flex-col justify-center items-center text-center h-[400px] md:h-[450px] lg:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/galle4.jpg)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
          <h1 className="text-3xl md:text-5xl font-semibold text-green-900 mb-6 text-center drop-shadow-sm">
            A Glimpse into Unforgettable Journeys
          </h1>
          <p className="text-black text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Step into the world of breathtaking landscapes, vibrant cultures,
            and unforgettable adventures. Our gallery showcases stunning
            photographs and videos from our tours, highlighting Sri Lanka’s
            beauty - from emerald tea plantations and golden beaches to wildlife
            encounters and traditional festivals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-[80%] sm:w-[70%] max-w-md mx-auto mt-4 sm:mt-5 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 z-10">
          <div className="flex items-center flex-1 bg-white px-5 sm:px-6 h-12 sm:h-14">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-base sm:text-lg mr-3 sm:mr-4"></i>
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-400 
            bg-transparent border-none focus:outline-none focus:ring-0 pt-5"
            />
          </div>
          <button
            onClick={() => console.log("Searching for:", searchTerm)}
            className="h-12 sm:h-14 px-6 sm:px-8 bg-green-700 text-white 
            font-medium text-sm sm:text-base 
            hover:bg-green-800 active:scale-95 
            transition-all duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-green-50 w-full max-w-[1500px] p-6 sm:p-8 rounded-xl mt-10 shadow-lg">
        {filteredPhotos.length === 0 ? (
          <p className="text-center text-gray-500">
            {photos.length === 0
              ? "No photos found."
              : "No photos match your search."}
          </p>
        ) : isMobile ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {filteredPhotos.map((photo) => (
              <SwiperSlide key={photo._id}>
                <div
                  className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-green-900 cursor-pointer transform transition hover:scale-105 hover:shadow-lg"
                  onClick={() =>
                    setSelectedImage(`${BACKEND_URL}${photo.imageUrl}`)
                  }
                >
                  <img
                    src={`${BACKEND_URL}${photo.imageUrl}`}
                    alt={photo.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-green-900 text-lg font-medium">
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo._id}
                className="bg-yellow-50 rounded-xl overflow-hidden shadow-md border-2 border-green-900 cursor-pointer transform transition hover:scale-105 hover:shadow-lg"
                onClick={() =>
                  setSelectedImage(`${BACKEND_URL}${photo.imageUrl}`)
                }
              >
                <img
                  src={`${BACKEND_URL}${photo.imageUrl}`}
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-green-900 text-lg font-medium">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          >
            <img
              src={selectedImage}
              alt="Large View"
              className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-10 text-white text-4xl font-bold"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;

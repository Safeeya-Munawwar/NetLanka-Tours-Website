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

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

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

  const openModal = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      <div
        className="w-full h-[400px] md:h-[450px] lg:h-[500px] relative flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url(/images/galle4.jpg)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

        <div className="relative z-10 px-6 md:px-20">
          <h1 style={{
  fontFamily: "'Times New Roman', Times, serif", 
  fontWeight: 600,                               
  fontSize: "3rem",                            
  color: "#064420",                          
  textAlign: "center",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",    
  marginBottom: "1.5rem",                       
  marginTop: "0", 
            }}
          >
            A Glimpse into Unforgettable Journeys
          </h1>
          <p className="text-black text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Step into the world of breathtaking landscapes, vibrant cultures, and unforgettable adventures. Our gallery showcases stunning photographs and videos from our tours, highlighting Sri Lanka’s beauty - from emerald tea plantations and golden beaches to wildlife encounters and traditional festivals.
          </p>
        </div>

        <div className="relative mt-8 flex w-full max-w-md">
          <input
            type="text"
            placeholder="Search photos by title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 p-3 pl-4 border border-gray-300 rounded-l-lg shadow-sm outline-none text-base font-serif"
          />
          <button
            onClick={handleSearch}
            className="bg-green-700 hover:bg-green-800 text-white font-serif px-5 rounded-r-lg"
          >
            Search
          </button>
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Times New Roman', Times, serif", background: "#dcfce7", width: "100%", maxWidth: 1500, padding: "30px", borderRadius: "16px", boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)"
        }}
      >
        {filteredPhotos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            {photos.length === 0 ? "No photos found." : "No photos match your search."}
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
                  className="gallery-card"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif", backgroundColor: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.06)", transition: "0.3s", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "2px solid #064420"
                  }}
                  onClick={() => openModal(`${BACKEND_URL}${photo.imageUrl}`)}
                >
                  <img
                    src={`${BACKEND_URL}${photo.imageUrl}`}
                    alt={photo.title}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "12px 15px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        color: "#064420",
                        textAlign: "center",
                      }}
                    >
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {filteredPhotos.map((photo) => (
              <div
                key={photo._id}
                className="gallery-card"
                style={{
                  backgroundColor: "#f9fbe7",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
                  transition: "transform 0.25s ease",
                  cursor: "pointer",
                  border: "2px solid #064420",
                }}
                onClick={() => openModal(`${BACKEND_URL}${photo.imageUrl}`)}
              >
                <img
                  src={`${BACKEND_URL}${photo.imageUrl}`}
                  alt={photo.title}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "12px 15px" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      color: "#064420",
                      textAlign: "center",
                    }}
                  >
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <img
              src={selectedImage}
              alt="Large View"
              style={{
                maxHeight: "90%",
                maxWidth: "90%",
                borderRadius: 8,
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 30,
                right: 40,
                fontSize: 30,
                color: "white",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        )}

        <style>{`
        .gallery-card:hover {
          box-shadow: 0 8px 20px rgba(6, 94, 70, 0.3);
          transform: scale(1.02);
          transition: all 0.3s ease;
        }
      `}</style>
      </div>
    </div>
  );
}

export default Gallery;

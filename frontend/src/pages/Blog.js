import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  useEffect(() => {
    axios.get(`/api/blogs`).then((res) => setBlogs(res.data));

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col items-center font-serif"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div
  className="w-full relative flex flex-col justify-center items-center text-center h-[500px] md:h-[550px] lg:h-[600px] bg-cover bg-center"
  style={{ backgroundImage: "url(/images/blog.PNG)" }}
>
<div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
        <h1 className="text-2xl sm:text-3xl md:text-5xl text-green-950 font-serif font-semibold drop-shadow-md mb-4 sm:mb-6">
             Travel Wisdom from Sri Lanka
            </h1>
            <p className="text-black text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Stay inspired with our travel blog! Discover insider tips, destination guides, adventure stories, and cultural insights from our team of passionate explorers. Learn how to make the most of your trip, find hidden gems, and get inspired for your next journey in Sri Lanka.
           </p>
        </div>

        <div className="flex items-center w-[80%] sm:w-[70%] max-w-md mx-auto mt-6 sm:mt-8 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 z-10">
    <div className="flex items-center flex-1 bg-white px-5 sm:px-6 h-12 sm:h-14">
      <i className="fa-solid fa-magnifying-glass text-gray-400 text-base sm:text-lg mr-3 sm:mr-4"></i>
      
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-400 
          bg-transparent border-none focus:outline-none focus:ring-0 pt-5"
      />
          </div>
          <button
            onClick={handleSearch}
            className="h-12 sm:h-14 px-6 sm:px-8 bg-green-700 text-white 
        font-medium text-sm sm:text-base 
        hover:bg-green-800 active:scale-95 
        transition-all duration-200"
    >
            Search
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#dcfce7", width: "100%", maxWidth: 1500, padding: "30px", borderRadius: "16px", boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)"
        }}
      >

        {filteredBlogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No blogs found.</p>
        ) : isMobile ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {filteredBlogs.map((b) => (
              <SwiperSlide key={b._id}>
                <div className="blog-card" style={blogCardStyle}>
                  {renderBlogContent(b)}
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
            {filteredBlogs.map((b) => (
              <div key={b._id} className="blog-card" style={blogCardStyle}>
                {renderBlogContent(b)}
              </div>
            ))}
          </div>
        )}

        <style>{`
        .blog-card:hover {
          box-shadow: 0 8px 20px rgba(6, 94, 70, 0.3);
          transform: scale(1.02);
          transition: all 0.3s ease;
        }
      `}</style>
      </div>
    </div>
  );
};

const blogCardStyle = {
  borderRadius: 12,
  padding: 20,
  backgroundColor: "#f1f8e9",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column",
  gap: 15,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  border: "2px solid #064420", // dark green border
};

const renderBlogContent = (b) => (
  <>
    <h3
      style={{
        fontSize: "1.3rem",
        margin: 0,
        color: "#064420",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {b.title}
    </h3>

    {b.imageUrl && (
      <img
        src={b.imageUrl}
        alt={b.title}
        style={{
          width: "100%",
          borderRadius: 10,
          maxHeight: 180,
          objectFit: "cover",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease",
        }}
      />
    )}

    <p
      style={{
        flexGrow: 1,
        color: "#333",
        fontSize: "0.95rem",
        lineHeight: 1.6,
      }}
    >
      {b.content.length > 150 ? b.content.substring(0, 150) + "..." : b.content}
    </p>

    <Link to={`/blog/${b._id}`} style={readMoreBtnStyle}>
      Read More
    </Link>
  </>
);

const readMoreBtnStyle = {
  display: "inline-block",
  padding: "10px 18px",
  width: "260px",
  backgroundColor: "#064420",
  color: "white",
  textDecoration: "none",
  borderRadius: 6,
  fontWeight: "600",
  fontSize: 14,
  textAlign: "center",
  cursor: "pointer",
  alignSelf: "flex-center",
  transition: "background-color 0.3s ease",
};

export default Blog;

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

const InfoCard = ({ intro = "", content = "", images = [], loading = false, error = null }) => {
  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);

  useEffect(() => {
    if (leftRef.current) setLeftHeight(leftRef.current.offsetHeight);
    const handleResize = () => {
      if (leftRef.current) setLeftHeight(leftRef.current.offsetHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [intro, content, loading, error]);

  const paragraphs = content.split(/\n\s*\n/);
  const img = images.length > 0 ? images : [
    "/images/info1.jpg",
    "/images/info2.jpg",
    "/images/info3.jpg",
    "/images/info4.jpg",
    "/images/info5.jpeg",
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 lg:gap-10">
        {/* Left Content */}
        <div
          ref={leftRef}
          className="
            flex-1 
            min-w-[220px] sm:min-w-[300px] md:min-w-[400px] 
            lg:min-w-[500px] xl:min-w-[600px] 
            max-w-full
            flex flex-col
          "
        >
          {loading ? (
            <p className="text-center text-gray-600 text-base sm:text-lg">Loading content...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-bold">{error}</p>
          ) : (
            <div className="flex-1 border-2 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-white shadow-md">
              <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-900 mb-4 sm:mb-6 text-center">
                {intro}
              </p>

              {paragraphs.map((para, idx) => (
                <p key={idx} className="text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-justify">
                  {para}
                </p>
              ))}

              {/* Footer: Location & Stars */}
              <div className="flex justify-between items-center mt-4 sm:mt-6 text-sm sm:text-base">
                <div className="flex items-center gap-1 sm:gap-2 text-gray-700">
                  <FaMapMarkerAlt className="text-red-500 text-sm sm:text-base" />
                  <span>Net Lanka Tours</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar className="text-sm sm:text-base" />
                  <span className="font-bold">5.0</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Swiper Slider */}
        <div
          className="
            flex-1 
            min-w-[220px] sm:min-w-[300px] md:min-w-[400px] 
            lg:min-w-[500px] xl:min-w-[600px] 
            max-w-full 
            flex flex-col
          "
        >
          <div
            className="flex-1 border-2 border-black rounded-xl sm:rounded-2xl overflow-hidden shadow-md"
            style={{ height: leftHeight || "auto" }}
          >
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full h-full"
            >
              {img.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={src}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;

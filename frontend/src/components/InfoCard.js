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
    // Set height initially
    if (leftRef.current) setLeftHeight(leftRef.current.offsetHeight);

    const handleResize = () => {
      if (leftRef.current) setLeftHeight(leftRef.current.offsetHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [intro, content, loading, error]);

  const paragraphs = content.split(/\n\s*\n/);

  const img = images.length > 0 ? images : [
    "/images/sigiriya1.jpg",
    "/images/yala1.jpg",
    "/images/galle5.jpg",
    "/images/yala4.jpg",
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-12">
      <div className="flex flex-wrap md:flex-nowrap gap-5">
        {/* Left Content */}
        <div ref={leftRef} className="flex-1 min-w-[300px] flex flex-col">
          {loading ? (
            <p className="text-center text-gray-600 text-lg">Loading content...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-bold">{error}</p>
          ) : (
            <div className="flex-1 border-2 border-black rounded-2xl p-6 md:p-8 bg-white shadow-md">
              <p className="text-3xl md:text-4xl font-semibold text-green-900 mb-6 text-center">{intro}</p>
              {paragraphs.map((para, idx) => (
                <p key={idx} className="text-gray-800 text-base md:text-lg mb-4 text-justify">
                  {para}
                </p>
              ))}

              {/* Footer: Location & Stars */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>Net Lanka Tours</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar />
                  <span className="font-bold">5.0</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Swiper Slider */}
        <div className="flex-1 min-w-[300px] flex flex-col">
          <div
            className="flex-1 border-2 border-black rounded-2xl overflow-hidden shadow-md"
            style={{ height: leftHeight || "auto" }} // Equal height
          >
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
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

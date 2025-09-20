import React, { useState, useEffect, useCallback } from "react";
import { useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import {
  FaUser,
  FaComment,
  FaHome,
  FaImages,
  FaBlog,
  FaSuitcaseRolling,
  FaCommentDots,
  FaPenFancy,
  FaInfoCircle,
  FaEnvelope,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaChartBar,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


const categoryImages = {
  Beaches: '/images/beach.PNG',
  Wildlife: '/images/yala3.jpg',
  Gastronomy: '/images/culture.PNG',
  History: '/images/history.PNG',
  Adventure: '/images/adventure1.PNG',
  'Lesser Travelled': '/images/lessure.PNG',
};

const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Fix default icon issues with Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
});

// Sample data for places by category
const placesData = {
  Beaches: [
    { name: 'Unawatuna Beach', lat: 6.0171, lng: 80.2498 },
    { name: 'Mirissa Beach', lat: 5.9481, lng: 80.4547 },
    { name: 'Nilaveli Beach', lat: 8.395, lng: 81.221 },
    { name: 'Bentota Beach', lat: 6.4205, lng: 79.9939 },
    { name: 'Arugam Bay', lat: 6.8417, lng: 81.8723 },
    { name: 'Hikkaduwa Beach', lat: 6.1432, lng: 80.1035 },
    { name: 'Tangalle Beach', lat: 6.0326, lng: 80.7882 },
    { name: 'Pasikudah Beach', lat: 8.8097, lng: 81.2727 },
  ],
  Wildlife: [
    { name: 'Yala National Park', lat: 6.3619, lng: 81.5088 },
    { name: 'Udawalawe National Park', lat: 6.423, lng: 80.927 },
    { name: 'Wilpattu National Park', lat: 8.0647, lng: 79.9191 },
    { name: 'Bundala National Park', lat: 5.9933, lng: 80.6363 },
    { name: 'Sinharaja Forest Reserve', lat: 6.4212, lng: 80.4571 },
    { name: 'Minneriya National Park', lat: 7.5956, lng: 81.0198 },
  ],
  Adventure: [
    { name: 'Adam\'s Peak', lat: 6.8003, lng: 80.4912 },
    { name: 'Knuckles Mountain Range', lat: 7.333, lng: 80.825 },
    { name: 'Kitulgala', lat: 7.198, lng: 80.5 },
    { name: 'Horton Plains National Park', lat: 6.8027, lng: 80.8128 },
    { name: 'Ella Rock', lat: 6.865, lng: 81.044 },
    { name: 'Pidurutalagala (Mount Pedro)', lat: 7.0034, lng: 80.7659 },
    { name: 'Diyaluma Falls', lat: 6.8157, lng: 81.0706 },
  ],
  History: [
    { name: 'Sigiriya Rock Fortress', lat: 7.9577, lng: 80.7606 },
    { name: 'Anuradhapura', lat: 8.3114, lng: 80.4037 },
    { name: 'Polonnaruwa', lat: 7.9393, lng: 81.0009 },
    { name: 'Dambulla Cave Temple', lat: 7.8589, lng: 80.6521 },
    { name: 'Temple of the Tooth (Kandy)', lat: 7.2930, lng: 80.6413 },
    { name: 'Galle Fort', lat: 6.0328, lng: 80.2170 },
    { name: 'Ruwanwelisaya Stupa', lat: 8.3517, lng: 80.3946 },
  ],
  Gastronomy: [
    { name: 'Colombo Food Street', lat: 6.9271, lng: 79.8612 },
    { name: 'Kandy Market', lat: 7.2906, lng: 80.6337 },
    { name: 'Galle Fort Food Market', lat: 6.0317, lng: 80.2170 },
    { name: 'Pettah Market (Colombo)', lat: 6.9277, lng: 79.8577 },
    { name: 'Negombo Fish Market', lat: 7.2096, lng: 79.8353 },
  ],
  'Lesser Travelled': [
    { name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
    { name: 'Haputale', lat: 6.8657, lng: 80.9936 },
    { name: 'Mannar', lat: 8.9913, lng: 79.8996 },
    { name: 'Kalpitiya', lat: 8.0261, lng: 79.7935 },
    { name: 'Trincomalee', lat: 8.5679, lng: 81.2330 },
    { name: 'Ella', lat: 6.8408, lng: 81.0455 },
  ],
};

const navCards = [
  {
    text: <><FaHome style={{ marginRight: '8px' }} /> Home</>,
    label: 'Welcome Home',
    link: '/'
  },
  {
    text: <><FaSuitcaseRolling style={{ marginRight: '8px' }} /> Tour Packages</>,
    label: 'Explore Tours',
    link: '/Tours'
  },
  {
    text: <><FaMapMarkedAlt style={{ marginRight: '8px' }} /> Destinations</>,
    label: 'Travel Spots',
    link: '/Destinations'
  },
  {
    text: <><FaImages style={{ marginRight: '8px' }} /> Gallery</>,
    label: 'Our Memories',
    link: '/Gallery'
  },
  {
    text: <><FaPenFancy style={{ marginRight: '8px' }} /> Blog</>,
    label: 'Travel Stories',
    link: '/Blog'
  },
  {
    text: <><FaInfoCircle style={{ marginRight: '8px' }} /> About</>,
    label: 'Our Journey',
    link: '/About'
  },
  {
    text: <><FaEnvelope style={{ marginRight: '8px' }} /> Contact</>,
    label: 'Get Connected',
    link: '/Contact'
  },
];

// Slideshow images
const images = [
  '/images/sigiriya1.jpg',
  '/images/yala7.jpg',
  '/images/ella1.jpg',
  '/images/galle5.jpg',
  '/images/adam.PNG',
  '/images/sigiriya2.jpg',
  '/images/yala1.jpg',
  '/images/ella2.jpg',
  '/images/yala3.jpg'
];

const API_BASE = 'http://localhost:5000';

function Home() {
  // State variables for content
  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [stats, setStats] = useState([]);

  // UI state variables
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [, setComments] = useState([]);
  const [, setStatusMessage] = useState("");
  const [, setStatusType] = useState("success"); // success or error
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Data state variables
  const [popularTours, setPopularTours] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);

  // Loading & error states
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [errorContent, setErrorContent] = useState(null);
  const [errorTours, setErrorTours] = useState(null);
  const [errorBlogs, setErrorBlogs] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [category, setCategory] = useState('Beaches');

  // Map center Sri Lanka
  const center = [7.8731, 80.7718];
  const zoom = 7;

  // Current places to show
  const places = placesData[category] || [];

  // Split categories into two halves
  const categories = Object.keys(placesData);
  const leftCats = categories.slice(0, 3);
  const rightCats = categories.slice(3, 6);

  useEffect(() => {
    // Fetch homepage content
    axios
      .get('http://localhost:5000/api/home-content')
      .then((res) => {
        const data = res.data || {};
        setTitle(data.title || 'Mahaweli Tours & Holidays');
        setIntro(data.intro || '');
        setContent(data.description || '');
        setContact(data.contact || '');
        setStats(Array.isArray(data.stats) ? data.stats : []);
        setLoadingContent(false);
      })
      .catch((err) => {
        console.error('Failed to load home content:', err);
        setErrorContent('Failed to load home content');
        setLoadingContent(false);
      });

    // Fetch tours
    axios
      .get('http://localhost:5000/api/tours')
      .then((res) => {
        const toursData = res.data || [];
        const popular = toursData.filter((t) => t.isSpecial).slice(0, 3);
        setPopularTours(popular);
        setLoadingTours(false);
      })
      .catch((err) => {
        console.error('Failed to fetch tours:', err);
        setErrorTours('Failed to fetch tours');
        setLoadingTours(false);
      });

    // Fetch blogs
    axios
      .get('http://localhost:5000/api/blogs')
      .then((res) => {
        const blogsData = res.data || [];
        const latest = blogsData.slice(0, 3);
        setLatestBlogs(latest);
        setLoadingBlogs(false);
      })
      .catch((err) => {
        console.error('Failed to fetch blogs:', err);
        setErrorBlogs('Failed to fetch blogs');
        setLoadingBlogs(false);
      });
  }, []);

  // Slideshow timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((idx) => (idx + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  
  // Comment submit handler
    // -----------------------------
  // Fetch comments
  // -----------------------------
  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/comments`);
      setComments(res.data.filter(c => c.page === "home"));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // ✅ useCallback avoids warning

  // -----------------------------
  // Submit comment
  // -----------------------------
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
  
    // Validate
    if (!commentName || !commentEmail || !commentText) {
      setStatusMessage("Please fill all fields");
      setStatusType("error");
      return;
    }
  
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(commentEmail)) {
      setStatusMessage("Please enter a valid email");
      setStatusType("error");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await axios.post(`${API_BASE}/api/comments`, {
        page: "home",
        name: commentName,
        email: commentEmail,
        message: commentText,
      });
  
      // Check backend response status
      if (res.status === 200 || res.status === 201) {
        // Clear form
        setCommentName("");
        setCommentEmail("");
        setCommentText("");
        setStatusMessage("Comment posted successfully!");
        setStatusType("success");
      
        // Show floating popup
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // auto-hide after 3s
      
        // Refresh comments
        fetchComments();
      
      } else {
        setStatusMessage("Failed to post comment");
        setStatusType("error");
      }
    } catch (err) {
      console.error("Axios POST error:", err); // log full error
      setStatusMessage("Failed to post comment");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };
  

  // Inside Home component
  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);

  useEffect(() => {
    if (leftRef.current) setLeftHeight(leftRef.current.offsetHeight);

    const handleResize = () => {
      if (leftRef.current) setLeftHeight(leftRef.current.offsetHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadingContent, content, errorContent]);

  const img = [
    "/images/sigiriya1.jpg", "/images/yala1.jpg", "/images/galle5.jpg", "/images/yala4.jpg", "/images/galle4.jpg",
    "/images/ella1.jpg", "/images/galle3.jpg", "/images/sigiriya3.jpeg",
    "/images/ella2.jpg", "/images/yala3.jpg", "/images/yala6.jpg", "/images/yala7.jpg",
     "/images/adam.PNG", "/images/galle4.jpg", 
  ];

  return (
    <div
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        minHeight: "100vh",
        overflowX: "hidden",
        background: "linear-gradient(135deg, #f9f9f9 0%, #e6f7ff 100%)",
        color: "#333",
        transition: "all 0.4s ease-in-out",

      }}
    >
      {/* Slideshow */}
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '400px',
          overflow: 'hidden',
          marginBottom: '40px',
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: index === currentImageIndex ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: index === currentImageIndex ? 2 : 1,
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 3,
          }}
        />

        <h1
          style={{
            position: 'relative',
            zIndex: 4,
            color: 'white',
            fontSize: '4rem',
            fontWeight: '600',
            fontFamily: "'Times New Roman', Times, serif",
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            padding: '0 20px',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {title}
        </h1>

        {typeof window !== 'undefined' && window.innerWidth > 768 && (
          <div
            style={{
              position: 'absolute',
              bottom: 1,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              zIndex: 5,
              padding: '0 10px',
              maxWidth: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {navCards.map((card, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: '260px',
                    height: '130px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    userSelect: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}

                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => (window.location.href = card.link)}
                  title={card.text}
                >
                  {/* Icon */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '30%',
                      left: '20px',
                      fontSize: '2rem',
                      color: 'white',
                      zIndex: 10,
                    }}
                  >
                    {card.icon}
                  </div>

                  {/* Text label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: '#013220',
                      padding: '10px',
                      border: '1px solid rgba(144, 238, 144, 0.6)',

                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      pointerEvents: 'none',
                      borderRadius: '12px 12px 0 0',
                      boxSizing: 'border-box',
                    }}
                  >
                    {card.text}
                  </div>

                  {/* Hover overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(1, 50, 32, 0.1)',
                      backdropFilter: 'blur(20px)',
                      overflow: 'hidden',
                      width: '100%',
                      height: isHovered ? '100%' : '0',
                      transition: 'height 0.7s ease',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      pointerEvents: isHovered ? 'auto' : 'none',
                      padding: '0 10px',
                      zIndex: 11,
                      borderRadius: '12px 12px 0 0',
                      boxSizing: 'border-box',
                    }}
                  >
                    {card.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main content container */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: '30px',
          background: 'linear-gradient(135deg, #ffffff, #f0fff4)',
          borderRadius: '20px',
          margin: '50px',
          maxWidth: '1200px',
          boxShadow: '0 8px 24px rgba(0, 100, 34, 0.15)',
          transition: 'all 0.4s ease',
          gap: '20px',
          
          
        }}
      >
        {/* Left content */}
        <div ref={leftRef} style={{ flex: '1 1 500px', minWidth: 300 }}>
          {loadingContent ? (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>Loading content...</p>
          ) : errorContent ? (
            <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{errorContent}</p>
          ) : (
            <div
              style={{
                padding: '20px 30px',
                background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
                borderRadius: '16px',
                boxShadow: '0 6px 16px rgba(0, 100, 34, 0.15)',
                transition: 'all 0.3s ease',
              }}
            >
              <p
                style={{
                  fontSize: '2.4rem',
                  textAlign: 'center',
                  color: '#0d3b2e',
                  marginBottom: '30px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                }}
              >
                {intro}
              </p>
              {content.split(/\n\s*\n/).map((para, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: '1.15rem',
                    lineHeight: '1.8',
                    color: '#333',
                    marginBottom: '1.2em',
                    textAlign: 'justify',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#1b5e20')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#333')}
                >
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right slider */}
        <div style={{ flex: '1 1 400px', minWidth: 300 }}>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            loop={true}
            style={{ width: '100%', height: leftHeight }}
          >
            {img.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`Step ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0,100,34,0.3)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,100,34,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,100,34,0.3)';
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Mobile media query styles */}
        <style>
{`
@media (max-width: 768px) {
  /* Main container */
  div[style*="display: flex"][style*="flex-wrap"] {
    flex-direction: column;
    align-items: stretch;   /* ensures horizontal centering */
    padding: 15px;
    margin: 20px auto;
    border-radius: 12px;
  }

  /* Left & Right blocks take full width */
  div[style*="flex: 1 1 500px"],
  div[style*="flex: 1 1 400px"] {
    width: 100% !important;
    max-width: 100% !important;
    min-width: unset !important;
  }

  /* Left text block inner styles */
  div[style*="padding: 20px 30px"][style*="linear-gradient"] {
    padding: 15px;
  }

  div[style*="padding: 20px 30px"][style*="linear-gradient"] p {
    font-size: 1.1rem !important;
    line-height: 1.6 !important;
    text-align: left !important;
  }

  div[style*="padding: 20px 30px"][style*="linear-gradient"] p:first-child {
    font-size: 1.6rem !important;
    margin-bottom: 20px !important;
  }

  /* Right slider */
  div[style*="flex: 1 1 400px"] {
    margin-top: 20px;
  }

  .swiper {
    height: 220px !important; /* shorter slider for small screens */
  }

  .swiper-slide img {
    border-radius: 10px !important;
    height: 100% !important;
    object-fit: cover;
  }
}

@media (max-width: 480px) {
  div[style*="padding: 20px 30px"][style*="linear-gradient"] p {
    font-size: 1rem !important;
  }

  .swiper {
    height: 180px !important;
  }
}
@media (min-width: 769px) {
  /* Main container: allow equal height */
  div[style*="display: flex"][style*="flex-wrap"] {
    align-items: stretch !important;  /* makes children same height */
  }

  /* Left and right blocks grow equally */
  div[style*="flex: 1 1 500px"],
  div[style*="flex: 1 1 400px"] {
    display: flex;
    flex-direction: column;
  }

  /* Swiper should fill its parent’s height */
  .swiper {
    height: 100% !important;
  }

  .swiper-slide img {
    height: 100% !important;
    object-fit: cover;
  }
}

`}
</style>

{/* 🌍 Explore Sri Lanka Section */}
<div
  style={{
    margin: "50px auto",
    maxWidth: "1500px",
    padding: "20px 30px",
    background: "linear-gradient(135deg, #c8f5d9, #4caf50)",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)",
    transition: "all 0.3s ease",
    fontFamily: "'Times New Roman', Times, serif",
  }}
>
  
  {/* Heading */}
  <h2
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "15px",
      fontSize: "2.5rem",
      marginBottom: "35px",
      color: "#0d3b2e",
      letterSpacing: "1px",
      textShadow: "2px 2px 5px rgba(0,0,0,0.15)",
      animation: "textFloat 2s ease-in-out infinite",
      textAlign: "center",
      flexWrap: "wrap",
    }}
  >
    <img
      src="/images/srilanka.png"
      alt="Sri Lanka Map Icon"
      style={{
        width: "60px",
        height: "60px",
        objectFit: "contain",
        animation: "iconBounce 1.5s infinite",
        border: "3px solid #2e7d32",
        borderRadius: "50%",
        padding: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    />
    Explore Sri Lanka
    <style>
      {`
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes textFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}
    </style>
  </h2>

  {/* Map Container */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexGrow: 1,
        maxWidth: "700px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        overflow: "hidden",
        width: "100%",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow =
          "0 15px 35px rgba(0,0,0,0.35)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.3)";
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          border: "3px solid #81c784",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place, idx) => (
          <Marker key={idx} position={[place.lat, place.lng]} icon={redIcon}>
            <Popup>📍 {place.name}</Popup>
            <Tooltip
              permanent
              direction={idx % 2 === 0 ? "left" : "right"}
              offset={[10, 0]}
              className="custom-tooltip"
            >
              📍 {place.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </div>

  {/* Mobile Swipeable Category Buttons */}
  <div
    className="mobile-only"
    style={{
      display: "flex",
      overflowX: "auto",
      gap: "16px",
      padding: "15px 0",
      marginTop: "25px",
      scrollSnapType: "x mandatory",
      WebkitOverflowScrolling: "touch",
      justifyContent: "flex-start",
    }}
  >
    {[...leftCats, ...rightCats].map((cat) => (
      <button
        key={cat}
        onClick={() => setCategory(cat)}
        style={{
          minWidth: "140px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          padding: "12px",
          cursor: "pointer",
          backgroundColor: cat === category ? "#1b5e20" : "white",
          color: cat === category ? "white" : "#064420",
          border:
            cat === category
              ? "2.5px solid #1b5e20"
              : "1.5px solid #a5d6a7",
          borderRadius: "22px",
          fontWeight: 600,
          flexShrink: 0,
          scrollSnapAlign: "start",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow =
            "0 6px 15px rgba(0,0,0,0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor:
              cat === category ? "#4caf50" : "#a5d6a7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px dotted #388e3c",
            transition: "all 0.3s ease",
          }}
        >
          <img
            src={categoryImages[cat]}
            alt={cat}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
        <span>{cat}</span>
      </button>
    ))}
  </div>

  {/* Responsive CSS */}
  <style>
    {`
      .desktop-only { display: block; }
      .mobile-only { display: none; }

      @media (max-width: 768px) {
        .desktop-only { display: none; }
        .mobile-only { display: flex; }
        
        /* Map smaller for mobile */
        .leaflet-container {
          height: 280px !important;
        }
      }

      @media (max-width: 480px) {
        .leaflet-container {
          height: 220px !important;
        }
      }

      /* Custom tooltip */
      .custom-tooltip {
        background-color: #1b5e20 !important;
        color: white !important;
        font-weight: 600;
        border-radius: 6px !important;
        padding: 6px 10px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-size: 0.9rem;
      }
    `}
  </style>
</div>


        {/* Popular Tours Section */}
{/* Popular Tours Section */}
<div
  style={{
    padding: '30px 35px',
    background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
    borderRadius: '18px',
    boxShadow: '0 8px 22px rgba(0, 100, 34, 0.18)',
    maxWidth: '1120px',
    transition: 'all 0.4s ease',
    margin: '8px auto',
    gap: '20px',
  }}
>
  <h2
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      fontSize: '2.6rem',
      marginBottom: '30px',
      color: '#0d3b2e',
      fontFamily: "'Times New Roman', Times, serif",
      letterSpacing: '1px',
      textShadow: '3px 3px 6px rgba(0,0,0,0.25)',
      animation: 'textBounce 1.5s infinite',
    }}
  >
    <FaMapMarkedAlt
      style={{
        color: '#03a9f4',
        width: '60px',
        height: '60px',
        objectFit: 'contain',
        animation: 'iconBounce 1.5s infinite',
        fontSize: '2.5rem',
        border: '3px solid #2e7d32',
        borderRadius: '50%',
        padding: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      }}
    />
    Popular Tours
    <style>
      {`
        @keyframes textBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}
    </style>
  </h2>

  {loadingTours ? (
    <p style={{ textAlign: 'center', color: '#1b5e20', fontWeight: '500' }}>Loading tours...</p>
  ) : errorTours ? (
    <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{errorTours}</p>
  ) : popularTours.length === 0 ? (
    <p style={{ textAlign: 'center', color: '#1b5e20', fontWeight: '500' }}>No popular tours found.</p>
  ) : (
    <>
      {/* Desktop Grid */}
      <div className="desktop-tour-grid">
        {popularTours.map((tour, idx) => (
          <div
            key={tour._id || idx}
            style={{
              background: 'linear-gradient(135deg, #ffffff, #e8f5e9)',
              padding: '15px',
              borderRadius: '18px',
              boxShadow: '0 6px 18px rgba(0, 100, 34, 0.25)',
              border: '2px solid #81c784',
              height: 360,
              transition: 'all 0.4s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 100, 34, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 100, 34, 0.25)';
            }}
          >
            <img
              src={tour.imageUrl || tour.image || '/images/default-tour.jpg'}
              alt={tour.title || tour.name || 'Tour Image'}
              style={{
                width: '100%',
                height: '180px',
                borderRadius: '14px',
                objectFit: 'cover',
                border: '2px solid #4caf50',
                transition: 'all 0.3s ease',
              }}
            />
            <h3
              style={{
                fontSize: '1.35rem',
                color: '#1b5e20',
                margin: '5px 0',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {tour.title || tour.name}
            </h3>
            <p
              style={{
                color: '#333',
                fontSize: '0.95rem',
                height: '100px',
                margin: '2px 0',
                lineHeight: '1.3rem',
              }}
            >
              {tour.shortDescription || tour.description || 'Explore this amazing tour! 🌴'}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 25 }}>
        <button
          onClick={() => (window.location.href = `/Tours`)}
          style={{
            backgroundColor: '#1b5e20',
            color: 'white',
            border: 'none',
            padding: '14px 22px',
            borderRadius: '14px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#4caf50';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#1b5e20';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🚀 View More Tours & Details
        </button>
      </div>
    </>
  )}

  {/* CSS for desktop grid and hiding swiper */}
  <style>
    {`
      @media(min-width: 1024px) {
        .desktop-tour-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .swiper-container {
          display: none;
        }
      }

      @media(max-width: 1023px) {
        .desktop-tour-grid {
          display: none;
        }
      }
    `}
  </style>
</div>


    {/* Latest Blog Section */}
<div
  style={{
    position: 'relative',
    padding: '30px 35px',
    background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
    borderRadius: '20px',
    boxShadow: '0 10px 28px rgba(0, 100, 34, 0.2)',
    maxWidth: '1120px',
    transition: 'all 0.4s ease',
    margin: '20px auto',
    gap: '20px',
  }}
>
  {/* Section Title */}
  <h2
    style={{
      textAlign: 'center',
      fontSize: '2.3rem',
      marginBottom: '30px',
      color: '#0d3b2e',
      fontFamily: "'Times New Roman', Times, serif",
      letterSpacing: '1px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      textShadow: '2px 2px 6px rgba(0,0,0,0.2)',
      animation: 'textBounce 1.5s infinite',
    }}
  >
    <FaBlog
      style={{
        color: '#ff5722',
        width: '60px',
        height: '60px',
        objectFit: 'contain',
        animation: 'iconBounce 1.5s infinite',
        fontSize: '2.5rem',
        border: '3px solid #2e7d32',
        borderRadius: '50%',
        padding: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      }}
    />
    Latest from Our Blogs
  </h2>

  {loadingBlogs ? (
    <p style={{ textAlign: 'center', color: '#1b5e20', fontWeight: '500', fontSize: '1.1rem' }}>
      ⌛ Loading blogs...
    </p>
  ) : errorBlogs ? (
    <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
      ⚠️ {errorBlogs}
    </p>
  ) : latestBlogs.length === 0 ? (
    <p style={{ textAlign: 'center', color: '#1b5e20', fontWeight: '500', fontSize: '1.1rem' }}>
      📝 No blogs available yet!
    </p>
  ) : (
    <>
      {/* Desktop Grid */}
      <div className="desktop-blog-grid">
        {latestBlogs.map((blog, idx) => (
          <div
            key={blog._id || idx}
            style={{
              background: 'linear-gradient(145deg, #ffffff, #e0f7fa)',
              padding: '15px',
              borderRadius: '18px',
              boxShadow: '0 6px 18px rgba(0, 100, 34, 0.25)',
              border: '2px solid #64b168',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '340px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 100, 34, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 100, 34, 0.25)';
            }}
          >
            {blog.imageUrl && (
              <img
                src={blog.imageUrl.startsWith('http') ? blog.imageUrl : `http://localhost:5000${blog.imageUrl}`}
                alt={blog.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  border: '2px solid #4caf50',
                  transition: 'transform 0.3s ease, filter 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.07)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              />
            )}
            <h3
              style={{
                fontSize: '1.35rem',
                color: '#1b5e20',
                margin: '5px 0',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {blog.title}
            </h3>
            <p
              style={{
                color: '#333',
                fontSize: '0.95rem',
                overflow: 'hidden',
                height: '60px',
                margin: '2px 0',
                lineHeight: '1.3rem',
              }}
            >
              {blog.snippet || blog.summary || 'Dive into this exciting story! ✨'}
            </p>
            <button
              onClick={() => (window.location.href = `/Blog/${blog._id}`)}
              style={{
                backgroundColor: '#1b5e20',
                color: 'white',
                border: 'none',
                padding: '10px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4caf50';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1b5e20';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              📖 Read More
            </button>
          </div>
        ))}
      </div>

      {/* View More Blogs Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 25 }}>
        <button
          onClick={() => (window.location.href = `/blog`)}
          style={{
            backgroundColor: '#1b5e20',
            color: 'white',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '14px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#4caf50';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#1b5e20';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🔎 View More Blogs
        </button>
      </div>

      {/* Media Queries to hide Swiper on desktop */}
      <style>
        {`
          @media(min-width: 1024px) {
            .desktop-blog-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            .swiper-container {
              display: none;
            }
          }

          @media(max-width: 1023px) {
            .desktop-blog-grid {
              display: none;
            }
          }
        `}
      </style>
    </>
  )}
</div>


        {/* Contact Info */}
        <div
          style={{
            position: 'relative',
            padding: '40px 50px',
            background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
            borderRadius: '20px',
            boxShadow: '0 10px 28px rgba(0, 100, 34, 0.2)',
            maxWidth: '1400px',
            width: '90%',
            transition: 'all 0.4s ease',
            margin: '30px auto',
            gap: '20px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 14px 32px rgba(0, 100, 34, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 100, 34, 0.2)';
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontSize: '2rem',
              marginBottom: '25px',
              color: '#0d3b2e',
              fontFamily: "'Times New Roman', Times, serif",
              letterSpacing: '1px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FaPhoneAlt
              style={{
                color: '#03a9f4',
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                animation: 'iconBounce 1.5s infinite',
                fontSize: '2.5rem',
                border: '3px solid #2e7d32',
                borderRadius: '50%',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}
            />
            Contact Info
          </h2>

          <style>
            {`
    @keyframes iconBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
  `}
          </style>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#064420',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'color 0.3s ease',
              cursor: 'default',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#4caf50')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#064420')}
          >
            <FaPhoneAlt style={{ color: '#ff5722', fontSize: '1.4rem', transition: 'transform 0.3s ease' }} />
            <strong>Contact:</strong> {contact || 'Not available'}
          </p>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#064420',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'color 0.3s ease',
              cursor: 'default',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#4caf50')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#064420')}
          >
            <FaEnvelope style={{ color: '#2196f3', fontSize: '1.4rem', transition: 'transform 0.3s ease' }} />
            <strong>Email:</strong> info@mahaweli.lk
          </p>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#064420',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'color 0.3s ease',
              cursor: 'default',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#4caf50')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#064420')}
          >
            <FaMapMarkerAlt style={{ color: '#4caf50', fontSize: '1.4rem', transition: 'transform 0.3s ease' }} />
            <strong>Address:</strong> No 15/7, Bernadett Mawatha, Kandana, Sri Lanka
          </p>
        </div>

        {/* Stats Section */}
        <div
          style={{
            position: 'relative',
            padding: '30px 35px',
            background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
            borderRadius: '20px',
            boxShadow: '0 10px 28px rgba(0, 100, 34, 0.2)',
            maxWidth: '1120px',
            transition: 'all 0.4s ease',
            margin: '20px auto',
            gap: '20px',
          }}
        >
          <h2
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              fontSize: '2rem',
              marginBottom: '25px',
              color: '#0d3b2e',
              fontFamily: "'Times New Roman', Times, serif",
              letterSpacing: '1px',
              textShadow: '2px 2px 6px rgba(0,0,0,0.2)',
              animation: 'headerBounce 1.8s infinite',
            }}
          >
            <FaChartBar
              style={{
                color: '#0d3b2e',
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                animation: 'iconBounce 1.5s infinite',
                fontSize: '2.5rem',
                border: '3px solid #2e7d32',
                borderRadius: '50%',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}
            />
            Our Stats

            <style>
              {`
      @keyframes headerBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }

      @keyframes iconBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
    `}
            </style>
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {stats.length > 0 ? (
              stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: '1 1 200px',
                    background: 'linear-gradient(135deg, #ffffff, #a5d6a7)',
                    padding: '25px 20px',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 100, 34, 0.2)',
                    textAlign: 'center',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 100, 34, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 100, 34, 0.2)';
                  }}
                >
                  <div style={{ fontSize: '2.5rem', color: '#2e7d32', fontWeight: '700', marginBottom: '10px' }}>
                    {stat.icon ? stat.icon : '⭐'} {stat.number}
                  </div>
                  <p
                    style={{
                      fontSize: '1.15rem',
                      color: '#064420',
                      fontWeight: '600',
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#1b5e20' }}>No stats available</p>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div
          style={{
            position: 'relative',
            padding: '30px 35px',
            background: 'linear-gradient(135deg, #c8f5d9, #4caf50)',
            borderRadius: '20px',
            boxShadow: '0 10px 28px rgba(0, 100, 34, 0.2)',
            maxWidth: '1120px',
            transition: 'all 0.4s ease',
            margin: '20px auto',
            gap: '20px',
          }}
        >
          <h2
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              fontSize: '2rem',
              marginBottom: '25px',
              color: '#0d3b2e',
              fontFamily: "'Times New Roman', Times, serif",
              letterSpacing: '1px',
              textShadow: '2px 2px 6px rgba(0,0,0,0.2)',
              animation: 'headerBounce 1.8s infinite',
            }}
          >
            <FaCommentDots
              style={{
                color: 'green',
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                animation: 'iconBounce 1.5s infinite',
                fontSize: '2.5rem',
                border: '3px solid #2e7d32',
                borderRadius: '50%',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}
            />
            Leave a Comment

            <style>
              {`
      @keyframes headerBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }

      @keyframes iconBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
    `}
            </style>
          </h2>

          <form onSubmit={handleCommentSubmit}>
        {/* Name Input */}
        <div style={inputContainerStyle}>
          <FaUser style={iconStyle} />
          <input
            type="text"
            placeholder="Your Name"
            value={commentName}
            onChange={(e) => setCommentName(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Email Input */}
        <div style={inputContainerStyle}>
          <FaEnvelope style={iconStyle} />
          <input
            type="email"
            placeholder="Your Email"
            value={commentEmail}
            onChange={(e) => setCommentEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Comment Textarea */}
        <div style={inputContainerStyle}>
          <FaComment style={{ ...iconStyle, marginTop: "8px" }} />
          <textarea
            placeholder="Write your comment..."
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={textareaStyle}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={submitButtonStyle} disabled={loading}>
          📝 {loading ? "Posting..." : "Submit Comment"}
        </button>

        {/* Status Message */}
        {showPopup && (
  <div
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: "#81c784", // light green
      color: "#fff",
      padding: "14px 20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      fontWeight: "600",
      fontFamily: "'Times New Roman', Times, serif",
      zIndex: 2000,
      animation: "popupFade 0.5s ease-in-out",
    }}
  >
    ✅ Comment posted successfully!
  </div>
)}

<style>
{`
  @keyframes popupFade {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`}
</style>

      </form>

        </div>
      </div>

      <style>{`


  /* Tooltip */
  .custom-tooltip {
    background-color: #2e7d32;
    color: white;
    font-weight: bold;
    padding: 6px 10px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
`}</style>

    </div>

  );
}
// Styles
const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
  backgroundColor: "#ffffff",
  padding: "8px 12px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
};
const iconStyle = { marginRight: "10px", color: "#4caf50", fontSize: "1.5rem" };
const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #a5d6a7",
  fontSize: "1rem",
  fontFamily: "'Times New Roman', Times, serif",
  outline: "none",
};
const textareaStyle = { ...inputStyle, resize: "vertical" };
const submitButtonStyle = {
  backgroundColor: "#1b5e20",
  color: "white",
  padding: "12px 25px",
  border: "none",
  borderRadius: "12px",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: "600",
  display: "block",
  margin: "0 auto",
};
export default Home;

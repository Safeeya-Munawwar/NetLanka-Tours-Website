import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { CSSTransition } from "react-transition-group";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaCar, FaShuttleVan, FaBus } from "react-icons/fa";

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [mainFilter, setMainFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [itineraryVisibility, setItineraryVisibility] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const [bookingForm, setBookingForm] = useState({
    page: "tours",
    location: "",
    tourPrice: 0,
    transportPrice: 0,
    members: 1,
    total: 0,
    name: "",
    email: "",
    phone: "",
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    vehicle: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/tours").then((res) => setTours(res.data));
  }, []);

  useEffect(() => {
    document.body.style.overflow = bookingId ? "hidden" : "";
  }, [bookingId]);

  const toggleItinerary = (id) => {
    setItineraryVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleReadMore = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredTours = tours
    .filter((tour) => {
      if (mainFilter !== "all" && tour.type !== mainFilter) return false;
      if (subFilter === "special" && !tour.isSpecial) return false;
      if (subFilter === "regular" && tour.isSpecial) return false;
      if (searchTerm && !tour.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

  const transportIcons = {
    Car: "🚗",
    Van: "🚐",
    Bus: "🚌",
    Boat: "⛴️",
    Train: "🚆",
  };

  const openBookingForm = (tour) => {
    const price = Number(tour.price) || 0;
    setBookingId(tour._id);
    setBookingForm({
      page: "tours",
      location: tour.location || "",
      tourPrice: price,
      transportPrice: 0,
      members: 1,
      total: price,
      name: "",
      email: "",
      phone: "",
      pickupLocation: "",
      pickupDate: "",
      pickupTime: "",
      vehicle: "",
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...bookingForm, [name]: value };

    if (name === "members") {
      const membersNum = parseInt(value, 10) || 1;
      newForm.members = membersNum;

      const tourPrice = Number(newForm.tourPrice) || 0;
      const transportPrice = Number(newForm.transportPrice) || 0;

      newForm.total = tourPrice * membersNum + transportPrice;
    }

    setBookingForm(newForm);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const templateParams = {
      tour_location: bookingForm.location,
      tour_price: bookingForm.tourPrice,
      members: bookingForm.members,
      transport: bookingForm.vehicle,
      transport_price: bookingForm.transportPrice,
      total_price: bookingForm.total,
      user_name: bookingForm.name,
      user_email: bookingForm.email,
      user_phone: bookingForm.phone,
      pickup_location: bookingForm.pickupLocation,
      pickup_date: bookingForm.pickupDate,
      pickup_time: bookingForm.pickupTime,
    };

    try {
            await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      );

      await axios.post("http://localhost:5000/api/bookings", {
        tourId: bookingId,
        tourTitle: bookingForm.location,
        ...bookingForm,
      });

      showPopup("Booking sent and saved successfully!", "success");
      generateItineraryPDF(tours.find((t) => t._id === bookingId), bookingForm);
      setBookingId(null);

    } catch (error) {
      console.error("Booking error:", error.response || error.message || error);
      showPopup("Failed to send booking.", "error");
    }

  };

  const [customizeId, setCustomizeId] = useState(null);
  const [customForm, setCustomForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferences: "",
    duration: "",
    budget: "",
  });

  const openCustomizeForm = (tour) => {
    setCustomizeId(tour._id);
    setCustomForm({
      name: tour.name || "",
      email: tour.email || "",
      phone: tour.phone || "",
      preferences: tour.preferences || tour.title || "",
      duration: tour.duration || "",
      budget: tour.price || "",
    });
  };

  const closeCustomizeModal = () => setCustomizeId(null);

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    setCustomForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!customizeId) throw new Error("No tour selected.");

      const tour = tours.find((t) => t._id === customizeId);
      if (!tour) throw new Error("Tour not found.");

      await axios.post("http://localhost:5000/api/customTours", {
        tourId: tour._id,
        tourTitle: tour.title,
        tourLocation: tour.location,
        ...customForm,
      });

      await generateItineraryPDF(tour, customForm);

      showPopup("Your customization request was sent successfully!", "success");
      setCustomizeId(null);

    } catch (err) {
      console.error(err);
      showPopup("Failed to send customization request.", "error");

    }
  };

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  const closeModal = () => setBookingId(null);

  const generateItineraryPDF = async (tour, booking = null) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const greenColor = [6, 94, 70];

    const loadImageAsDataUrl = (url, format = "PNG") =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL(`image/${format.toLowerCase()}`));
        };
        img.onerror = () => resolve(null);
      });

    const addNewPageIfNeeded = (currentY, extraSpace = 0) => {
      if (currentY + extraSpace > pageHeight - 20) {
        doc.addPage();
        return 20;
      }
      return currentY;
    };

    const logoDataUrl = await loadImageAsDataUrl("/images/logo.PNG");
    if (logoDataUrl) doc.addImage(logoDataUrl, "PNG", (pageWidth - 30) / 2, 10, 30, 30);

    let y = 50;

    doc.setFont("Times", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...greenColor);
    doc.text("Net Lanka Tours", pageWidth / 2, y, { align: "center" });

    y += 10;
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Tailored journeys across Sri Lanka with comfort and care.", pageWidth / 2, y, { align: "center" });

    y += 10;
    doc.setDrawColor(...greenColor);
    doc.setLineWidth(0.7);
    doc.line(margin, y, pageWidth - margin, y);

    y += 15;
    doc.setFont("Times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...greenColor);
    doc.text(tour.title || "Tour Title", margin, y);

    const tourImageUrl = `http://localhost:5000${tour.imageUrl}`;
    const tourImageDataUrl = await loadImageAsDataUrl(tourImageUrl, "JPEG");
    if (tourImageDataUrl) {
      y += 10;
      y = addNewPageIfNeeded(y, 60);
      doc.addImage(tourImageDataUrl, "JPEG", margin, y, pageWidth - 2 * margin, 60);
      y += 65;
    }

    y += 5;
    y = addNewPageIfNeeded(y, 30);
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...greenColor);
    doc.text("Tour Overview", margin, y);
    y += 7;

    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(30);

    const overviewLines = [
      `Title: ${tour.title || "N/A"}`,
      `Location: ${tour.location || "N/A"}`,
      `Duration: ${tour.duration || "N/A"}`,
      `Price per Person: LKR ${Number(tour.price || 0).toLocaleString()}`,
    ];

    if (booking) {
      overviewLines.push(`Transport: ${booking.vehicle || "N/A"}`);
      overviewLines.push(`Transport Price: LKR ${Number(booking.transportPrice || 0).toLocaleString()}`);
      overviewLines.push(`Total Amount: LKR ${Number(booking.total || 0).toLocaleString()}`);
    }

    overviewLines.forEach((line) => {
      y = addNewPageIfNeeded(y, 10);
      doc.text(line, margin, y);
      y += 6;
    });

    y += 5;
    y = addNewPageIfNeeded(y, 30);
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...greenColor);
    doc.text("Description", margin, y);
    y += 7;

    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(30);
    const descLines = doc.splitTextToSize(tour.description || "No description", pageWidth - 2 * margin);
    descLines.forEach((line) => {
      y = addNewPageIfNeeded(y, 10);
      doc.text(line, margin, y);
      y += 6;
    });

    if (tour.itinerary && tour.itinerary.length > 0) {
      y += 5;
      y = addNewPageIfNeeded(y, 30);
      doc.setFont("Times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...greenColor);
      doc.text("Itinerary", margin, y);
      y += 7;

      doc.setFont("Times", "normal");
      doc.setFontSize(12);
      doc.setTextColor(30);

      const cellHeight = 8;
      const colDayWidth = 25;
      const colDescWidth = pageWidth - 2 * margin - colDayWidth;

      doc.setFillColor(200, 230, 200);
      doc.rect(margin, y, colDayWidth, cellHeight, "F");
      doc.rect(margin + colDayWidth, y, colDescWidth, cellHeight, "F");
      doc.setTextColor(...greenColor);
      doc.text("Day", margin + 3, y + 6);
      doc.text("Description", margin + colDayWidth + 3, y + 6);
      y += cellHeight;

      doc.setTextColor(30);
      tour.itinerary.forEach((item) => {
        const lines = doc.splitTextToSize(item.description, colDescWidth - 4);
        const requiredHeight = cellHeight * lines.length;
        y = addNewPageIfNeeded(y, requiredHeight);

        doc.rect(margin, y, colDayWidth, requiredHeight);
        doc.rect(margin + colDayWidth, y, colDescWidth, requiredHeight);
        doc.text(`${item.day}`, margin + 3, y + 6);
        doc.text(lines, margin + colDayWidth + 3, y + 6);
        y += requiredHeight;
      });
    }

    if (booking) {
      y += 10;
      y = addNewPageIfNeeded(y, 60);
      doc.setFont("Times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...greenColor);
      doc.text("Booking Details", margin, y);
      y += 7;

      const tableColWidth = (pageWidth - 2 * margin) / 2;
      const tableRowHeight = 8;
      const bookingKeys = [
        "Name", "Email", "Phone", "Members", "Price per Person",
        "Transport", "Transport Price", "Total Amount", "Location"
      ];
      const bookingValues = [
        booking.name, booking.email, booking.phone, booking.members,
        `LKR ${Number(booking.tourPrice).toLocaleString()}`,
        booking.vehicle || "N/A",
        `LKR ${Number(booking.transportPrice).toLocaleString()}`,
        `LKR ${Number(booking.total).toLocaleString()}`,
        booking.location
      ];

      for (let i = 0; i < bookingKeys.length; i++) {
        y = addNewPageIfNeeded(y, tableRowHeight);
        doc.setFillColor(220, 245, 220);
        doc.rect(margin, y, tableColWidth, tableRowHeight, "F");
        doc.rect(margin + tableColWidth, y, tableColWidth, tableRowHeight, "F");

        doc.setFont("Times", "bold");
        doc.setTextColor(...greenColor);
        doc.text(bookingKeys[i], margin + 2, y + 6);

        doc.setFont("Times", "normal");
        doc.setTextColor(30);
        doc.text(`${bookingValues[i]}`, margin + tableColWidth + 2, y + 6);

        y += tableRowHeight;
      }
      y += 15;
    }

    if (booking && booking.preferences) {
      y += 10;
      y = addNewPageIfNeeded(y, 60);
      doc.setFont("Times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...greenColor);
      doc.text("Customization Details", margin, y);
      y += 7;

      const tableColWidth = (pageWidth - 2 * margin) / 2;
      const tableRowHeight = 8;
      const customKeys = ["Name", "Email", "Phone", "Preferences", "Duration", "Budget"];
      const customValues = [
        booking.name, booking.email, booking.phone,
        booking.preferences, booking.duration, booking.budget
      ];

      for (let i = 0; i < customKeys.length; i++) {
        y = addNewPageIfNeeded(y, tableRowHeight);
        doc.setFillColor(220, 245, 220);
        doc.rect(margin, y, tableColWidth, tableRowHeight, "F");
        doc.rect(margin + tableColWidth, y, tableColWidth, tableRowHeight, "F");

        doc.setFont("Times", "bold");
        doc.setTextColor(...greenColor);
        doc.text(customKeys[i], margin + 2, y + 6);

        doc.setFont("Times", "normal");
        doc.setTextColor(30);
        doc.text(`${customValues[i]}`, margin + tableColWidth + 2, y + 6);

        y += tableRowHeight;
      }

      y += 15;
    }

    const qrDataUrl = await QRCode.toDataURL("https://mahawelitours.com");
    y = addNewPageIfNeeded(y, 40);
    doc.setFont("Times", "normal");
    doc.setTextColor(30);
    doc.text("Scan for more info:", margin, y);
    y += 8;
    doc.addImage(qrDataUrl, "PNG", margin, y, 30, 30);

    y += 40;
    y = addNewPageIfNeeded(y, 20);
    doc.setFont("Times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...greenColor);
    doc.text("Thank you for choosing Mahaweli Tours and Holiday!", pageWidth / 2, y, { align: "center" });

    const fileName = `${(tour.title || "Itinerary").replace(/\s+/g, "_")}_Itinerary.pdf`;
    doc.save(fileName);
  };

  const renderTourCard = (tour, styleOverrides = {}) => (
    <div key={tour._id} style={{ ...cardStyle, ...styleOverrides }}>
      <div style={{ position: "relative" }}>
        {tour.isSpecial && <div style={specialBadgeStyle}>⭐ Special</div>}
        <img
          src={`http://localhost:5000${tour.imageUrl}`}
          alt={tour.title}
          style={{
            ...imageStyle,
            transform: hoveredId === tour._id ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.3s ease",
            cursor: "pointer",
            boxShadow: hoveredId === tour._id ? "0 8px 15px rgba(6, 94, 70, 0.3)" : "none",
            position: hoveredId === tour._id ? "relative" : "static",
            zIndex: hoveredId === tour._id ? 2 : 1,
          }}
          onMouseEnter={() => setHoveredId(tour._id)}
          onMouseLeave={() => setHoveredId(null)}
        />
      </div>

      <h3 style={{ margin: "10px 0 5px", color: "#2c5d30", fontSize: "1.8rem" }}>{tour.title}</h3>
      <p style={infoStyle}>📍 <strong>Location:</strong> {tour.location}</p>
      <p style={infoStyle}>⏱ <strong>Duration:</strong> {tour.duration}</p>
      <p style={infoStyle}>💰 <strong>Price per Person:</strong> LKR {tour.price}</p>

      {tour.transport && tour.transport.length > 0 && (
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          <strong>🛣️ Transport Options:</strong>
          <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
            {tour.transport.map((t, idx) => {
              const transportPrice = Number(tour.transportPrices?.[t] || 0);
              return (
                <li key={idx} style={{ marginBottom: 4 }}>
                  {transportIcons[t] || "❓"} {t} - LKR {transportPrice}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p style={infoStyle}>
        ⭐ <strong>Rating:</strong>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < tour.rating ? "#ffc107" : "#ddd", fontSize: "1.1rem" }}>★</span>
        ))}
      </p>

      <p style={descriptionStyle}>
        {expandedId === tour._id
          ? tour.description
          : tour.description?.slice(0, 100) + (tour.description?.length > 100 ? "..." : "")}
        {tour.description?.length > 100 && (
          <button onClick={() => toggleReadMore(tour._id)} style={readMoreButton}>
            {expandedId === tour._id ? "Show Less" : "Read More"}
          </button>
        )}
      </p>

      <div style={{ marginTop: 10 }}>
        <span onClick={() => toggleItinerary(tour._id)} style={itineraryLinkStyle}>
          {itineraryVisibility[tour._id] ? "Hide Itinerary" : "View Itinerary"}
          <span style={arrowStyle(itineraryVisibility[tour._id])}>▶</span>
        </span>

        <CSSTransition in={itineraryVisibility[tour._id]} timeout={300} classNames="slide" unmountOnExit>
          <div style={{ background: "#d4f4dd", marginTop: 10, padding: 10, borderRadius: 6 }}>
            {tour.itinerary && tour.itinerary.length > 0 ? (
              <ol>
                {tour.itinerary.map((item, idx) => (
                  <li key={idx}><strong>Day {item.day}:</strong> {item.description}</li>
                ))}
              </ol>
            ) : <p>No itinerary available.</p>}

          </div>
        </CSSTransition>
      </div>

      {tour.transport && (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {tour.transport.includes("car") && <FaCar size={22} style={{ color: "#1e90ff" }} />}
          {tour.transport.includes("van") && <FaShuttleVan size={22} style={{ color: "#28a745" }} />}
          {tour.transport.includes("bus") && <FaBus size={22} style={{ color: "#ff9800" }} />}
        </div>
      )}

      <button onClick={() => openBookingForm(tour)} style={bookButton}>Book Now</button>
      <button onClick={() => openCustomizeForm(tour)} style={customizeButton}>Customize Tour</button>
      <button onClick={() => generateItineraryPDF(tour)} style={itineraryButton}>Download PDF</button>
    </div>
  );

  const containerStyle = { background: "#dcfce7", width: "100%", maxWidth: 1500, padding: "30px", borderRadius: "16px", boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)" };
  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", };
  const cardStyle = { fontFamily: "'Times New Roman', Times, serif", backgroundColor: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.06)", transition: "0.3s", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "2px solid #064420" };
  const imageStyle = { fontFamily: "'Times New Roman', Times, serif", width: "100%", height: 180, objectFit: "cover", borderRadius: 8 };
  const infoStyle = { fontFamily: "'Times New Roman', Times, serif", fontSize: "1rem", color: "black", marginBottom: 4, margin: "3px 0", lineHeight: "1.2" };
  const descriptionStyle = { fontFamily: "'Times New Roman', Times, serif", fontSize: "1rem", color: "#444", marginBottom: 12, lineHeight: "1.3", marginTop: "6px" };
  const readMoreButton = { fontFamily: "'Times New Roman', Times, serif", background: "none", border: "none", color: "#0077cc", cursor: "pointer", fontSize: "0.9rem" };
  const bookButton = { fontFamily: "'Times New Roman', Times, serif", backgroundColor: "#065f46", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", width: "100%", marginTop: 8 };
  const itineraryButton = { fontFamily: "'Times New Roman', Times, serif", backgroundColor: "#1a73e8", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", width: "100%", marginTop: 8 };
  const customizeButton = { background: "linear-gradient(135deg, #6f42c1, #9b59b6)", fontFamily: "'Times New Roman', Times, serif", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", width: "100%", marginTop: 8 };
  const specialBadgeStyle = { fontFamily: "'Times New Roman', Times, serif", position: "absolute", top: 10, left: 10, backgroundColor: "#FFA500", color: "white", padding: "5px 10px", borderRadius: 5, fontWeight: "bold", fontSize: "0.9rem", zIndex: 1 };
  const modalOverlay = { fontFamily: "'Times New Roman', Times, serif", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
  const modalForm = { fontFamily: "'Times New Roman', Times, serif", backgroundColor: "#fff", padding: 20, borderRadius: 12, width: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" };
  const inputStyle = { fontFamily: "'Times New Roman', Times, serif", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc" };
  const submitButton = { fontFamily: "'Times New Roman', Times, serif", padding: 10, backgroundColor: "#065f46", color: "white", border: "none", borderRadius: 6, cursor: "pointer" };
  const labelStyle = { fontFamily: "'Times New Roman', Times, serif", fontWeight: "bold", marginBottom: 4 };
  const cancelButton = { fontFamily: "'Times New Roman', Times, serif", padding: 10, marginTop: 8, backgroundColor: "#ccc", border: "none", borderRadius: 6, cursor: "pointer" };
  const itineraryLinkStyle = { fontFamily: "'Times New Roman', Times, serif", color: "#2e7d32", cursor: "pointer", fontWeight: "bold", display: "inline-flex", alignItems: "center" };
  const arrowStyle = (open) => ({ fontFamily: "'Times New Roman', Times, serif", marginLeft: 6, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "0.3s" });
  const popupStyle = { position: "fixed", top: 20, right: 20, padding: "12px 20px", borderRadius: 10, zIndex: 2000, color: "#fff", fontWeight: 600, fontFamily: "'Times New Roman', Times, serif", boxShadow: "0 4px 12px rgba(0,0,0,0.25)", backgroundColor: popup.type === "success" ? "#66bb6a" : "#e53935", transition: "all 0.3s ease" };

  return (
    <div
    className="flex flex-col items-center font-serif"
    style={{ fontFamily: "'Times New Roman', Times, serif" }}
  >
    {/* Hero Section */}
    <div
  className="w-full relative flex flex-col justify-center items-center text-center 
             h-[620px] sm:h-[520px] md:h-[550px] lg:h-[600px] bg-cover bg-center 
             pt-8 sm:pt-4" // ✅ slightly reduced top padding on mobile
  style={{ backgroundImage: "url(/images/tour.png)" }}
>
<div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
        <h1 className="text-2xl sm:text-3xl md:text-5xl text-green-950 font-serif font-semibold drop-shadow-md mb-4 sm:mb-6">
             Handpicked Tours across Sri Lanka
    </h1>
    <p className="text-black text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
      Discover the best of Sri Lanka with our curated day and round tours. From serene beaches to lush forests, cultural landmarks, and thrilling adventures, we offer experiences that cater to every traveler. Choose from guided tours, adventure packages, or custom itineraries and create memories that last a lifetime.
    </p>
  </div>

{/* Search bar */}
<div className="flex items-center w-[80%] sm:w-[70%] max-w-md mx-auto mt-4 sm:mt-5 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 z-10">
  <div className="flex items-center flex-1 bg-white px-5 sm:px-6 h-12 sm:h-14">
    <i className="fa-solid fa-magnifying-glass text-gray-400 text-base sm:text-lg mr-3 sm:mr-4"></i>
    <input
      type="text"
      placeholder="Search tours..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
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


  {/* Main filter buttons */}
  <div className="flex flex-wrap justify-center mt-2 sm:mt-6 z-10">
    {["all", "day", "round"].map((f) => (
      <button
        key={f}
        onClick={() => {
          setMainFilter(f);
          setSubFilter("all");
        }}
        className={`w-56 sm:w-72 py-2 rounded mr-2 mb-2 font-serif text-white text-sm sm:text-lg transition-colors ${
          mainFilter === f ? "bg-orange-500" : "bg-green-900"
        }`}
      >
        {f === "all" ? "All Tours" : f === "day" ? "Day Tours" : "Round Tours"}
      </button>
    ))}
  </div>

  {/* Sub-filter buttons */}
  {(mainFilter === "day" || mainFilter === "round") && (
    <div className="flex flex-wrap justify-center mt-2 z-10">
      {["all", "special", "regular"].map((f) => (
        <button
          key={f}
          onClick={() => setSubFilter(f)}
          className={`w-48 sm:w-60 px-4 py-2 rounded mr-2 mb-2 font-serif text-white text-sm sm:text-md transition-colors ${
            subFilter === f ? "bg-orange-500" : "bg-green-900"
          }`}
        >
          {f === "all" ? "All" : f === "special" ? "Special" : "Regular"}
        </button>
      ))}
    </div>
  )}
</div>


      <div style={containerStyle}>
        <div style={{ padding: "20px" }}>
          {!isMobile && (
            <div className="tours-grid" style={gridStyle}>
              {filteredTours.map((tour) => renderTourCard(tour))}
            </div>
          )}
          {isMobile && (
            <div className="tours-swiper">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1.1}
                centeredSlides={true}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  480: { slidesPerView: 1.2 },
                  640: { slidesPerView: 1.5 },
                }}
              >
                {filteredTours.map((tour) => (
                  <SwiperSlide key={tour._id}>
                    {renderTourCard(tour, { margin: "10px auto", maxWidth: 320 })}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {bookingId && (
          <div
            style={{
              ...modalOverlay,
              padding: "10px",
              overflowY: "auto",
            }}
            onClick={closeModal}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleBookingSubmit}
              style={{
                ...modalForm,
                width: "100%",
                maxWidth: 480,
                maxHeight: "90vh",
                overflowY: "auto",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ marginBottom: 10 }}>Book Your Tour</h3>

              <label style={labelStyle}>Location</label>
              <input value={bookingForm.location} readOnly style={inputStyle} />

              <label style={labelStyle}>Price per Person (LKR)</label>
              <input value={bookingForm.tourPrice} readOnly style={inputStyle} />

              <label style={labelStyle}>Number of Members</label>
              <input
                type="number"
                name="members"
                value={bookingForm.members}
                onChange={handleBookingChange}
                min="1"
                required
                style={inputStyle}
              />

              <label>Choose Transport:</label>
              <select
                name="vehicle"
                value={bookingForm.vehicle}
                onChange={(e) => {
                  const vehicle = e.target.value;

                  const transportPrice =
                    Number(tours.find(t => t._id === bookingId)?.transportPrices?.[vehicle]) || 0;

                  setBookingForm((prev) => {
                    const tourPrice = Number(prev.tourPrice) || 0;
                    const members = Number(prev.members) || 1;
                    const total = tourPrice * members + transportPrice;

                    return {
                      ...prev,
                      vehicle,
                      transportPrice,
                      total,
                    };
                  });
                }}
                style={inputStyle}
              >
                <option value="">-- Select Transport --</option>
                {Object.keys(tours.find(t => t._id === bookingId)?.transportPrices || {}).map((t) => (
                  <option key={t} value={t}>
                    {t} {transportIcons[t] || ""} - LKR {tours.find(x => x._id === bookingId)?.transportPrices?.[t]}
                  </option>
                ))}
              </select>

              <label style={labelStyle}>Transport Price (LKR)</label>
              <input value={bookingForm.transportPrice} readOnly style={inputStyle} />

              <label style={labelStyle}>Total Amount (LKR)</label>
              <input value={bookingForm.total} readOnly style={inputStyle} />

              <label style={labelStyle}>Your Name</label>
              <input
                type="text"
                name="name"
                value={bookingForm.name}
                onChange={handleBookingChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Your Email</label>
              <input
                type="email"
                name="email"
                value={bookingForm.email}
                onChange={handleBookingChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Your Phone</label>
              <input
                type="tel"
                name="phone"
                value={bookingForm.phone}
                onChange={handleBookingChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Pickup Location</label>
              <input
                name="pickupLocation"
                value={bookingForm.pickupLocation}
                onChange={handleBookingChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Pickup Date</label>
              <input
                type="date"
                name="pickupDate"
                value={bookingForm.pickupDate}
                onChange={handleBookingChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Pickup Time</label>
              <input
                type="time"
                name="pickupTime"
                value={bookingForm.pickupTime}
                onChange={handleBookingChange}
                required
                style={inputStyle}
              />

              <button type="submit" style={{ ...submitButton, width: "100%" }}>
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={closeModal}
                style={{ ...cancelButton, width: "100%", marginTop: 8 }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {customizeId && (
          <div
            style={{
              ...modalOverlay,
              padding: "10px",
              overflowY: "auto",
            }}
            onClick={closeCustomizeModal}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCustomSubmit}
              style={{
                ...modalForm,
                width: "100%",
                maxWidth: 480,
                maxHeight: "90vh",
                overflowY: "auto",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ marginBottom: 10 }}>Customize Your Tour</h3>

              <label style={labelStyle}>Your Name</label>
              <input
                type="text"
                name="name"
                value={customForm.name}
                onChange={handleCustomChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Your Email</label>
              <input
                type="email"
                name="email"
                value={customForm.email}
                onChange={handleCustomChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Your Phone</label>
              <input
                type="tel"
                name="phone"
                value={customForm.phone}
                onChange={handleCustomChange}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Preferred Destinations / Preferences</label>
              <textarea
                name="preferences"
                value={customForm.preferences}
                onChange={handleCustomChange}
                style={{ ...inputStyle, height: 80 }}
              />

              <label style={labelStyle}>Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={customForm.duration}
                onChange={handleCustomChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Budget (LKR)</label>
              <input
                type="number"
                name="budget"
                value={customForm.budget}
                onChange={handleCustomChange}
                style={inputStyle}
              />

              <button type="submit" style={{ ...submitButton, width: "100%" }}>
                Submit Customization
              </button>
              <button
                type="button"
                onClick={closeCustomizeModal}
                style={{ ...cancelButton, width: "100%", marginTop: 8 }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {popup.message && <div style={popupStyle}>{popup.message}</div>}
      </div>
    </div>
  );
};

export default Tours;

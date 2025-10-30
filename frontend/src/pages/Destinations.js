import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import jsPDF from "jspdf";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [mainFilter, setMainFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [customizeId, setCustomizeId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [itineraryVisibility, setItineraryVisibility] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [popup] = useState({ message: "", type: "" });

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const [bookingForm, setBookingForm] = useState({
    location: "",
    price: 0,
    members: 1,
    total: 0,
    name: "",
    email: "",
    phone: "",
  });

  const [customForm, setCustomForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferences: "",
    duration: "",
    budget: "",
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/destinations");
        setDestinations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchTours = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tours");
        setTours(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDestinations();
    fetchTours();
  }, []);

  useEffect(() => {
    document.body.style.overflow = bookingId || customizeId ? "hidden" : "";
  }, [bookingId, customizeId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTours = tours
    .filter(
      (t) =>
        (!selectedDestination ||
          t.location
            .toLowerCase()
            .includes(selectedDestination.name.toLowerCase())) &&
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((t) => mainFilter === "all" || t.type === mainFilter)
    .filter(
      (t) =>
        subFilter === "all" ||
        (subFilter === "special" ? t.isSpecial : !t.isSpecial)
    );

  const toggleItinerary = (id) =>
    setItineraryVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleReadMore = (id) => setExpandedId(expandedId === id ? null : id);

  const openBookingForm = (tour) => {
    setBookingId(tour._id);
    setBookingForm({
      location: tour.title,
      price: tour.price,
      members: 1,
      total: tour.price,
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...bookingForm, [name]: value };
    if (name === "members")
      updated.total = Number(value) * Number(bookingForm.price || 0);
    setBookingForm(updated);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        "service_4738ygi",
        "template_1t1ssv1",
        bookingForm,
        "V6ZMioOe9GnndO1Y-"
      );
      await axios.post("http://localhost:5000/api/bookings", {
        tourId: bookingId,
        ...bookingForm,
      });
      alert("Booking successful!");
      setBookingId(null);
    } catch (err) {
      console.error(err);
      alert("Booking failed.");
    }
  };

  const openCustomizeForm = (tour) => {
    setCustomizeId(tour._id);
    setCustomForm({
      name: "",
      email: "",
      phone: "",
      preferences: "",
      duration: "",
      budget: "",
    });
  };

  const handleCustomChange = (e) =>
    setCustomForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        "service_4738ygi",
        "template_customize123",
        customForm,
        "V6ZMioOe9GnndO1Y-"
      );
      await axios.post("http://localhost:5000/api/customTours", {
        tourId: customizeId,
        ...customForm,
      });
      alert("Request sent!");
      setCustomizeId(null);
    } catch (err) {
      console.error(err);
      alert("Request failed.");
    }
  };

  const generateItineraryPDF = (tour) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(tour.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Location: ${tour.location}`, 20, 30);
    doc.text(`Duration: ${tour.duration}`, 20, 38);
    if (tour.itinerary && tour.itinerary.length > 0) {
      tour.itinerary.forEach((item, idx) => {
        doc.text(`Day ${item.day}: ${item.description}`, 20, 50 + idx * 10);
      });
    }
    doc.save(`${tour.title}_Itinerary.pdf`);
  };

  const containerStyle = {
    background: "#dcfce7",
    width: "100%",
    maxWidth: 1500,
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 100, 34, 0.15)",
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  };
  const cardStyle = {
    fontFamily: "'Times New Roman', Times, serif",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    transition: "0.3s",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "2px solid #064420",
  };
  const imageStyle = {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 8,
  };
  const specialBadgeStyle = {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FFA500",
    color: "white",
    padding: "5px 10px",
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: "0.9rem",
    zIndex: 1,
  };
  const infoStyle = {
    fontSize: "1rem",
    color: "#555",
    marginBottom: 4,
    margin: "3px 0",
    lineHeight: "1.2",
  };
  const descriptionStyle = {
    fontSize: "1rem",
    color: "#444",
    marginBottom: 12,
    lineHeight: "1.3",
    marginTop: "6px",
  };
  const readMoreButton = {
    background: "none",
    border: "none",
    color: "#0077cc",
    cursor: "pointer",
    fontSize: "0.9rem",
  };
  const bookButton = {
    backgroundColor: "#065f46",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
  };
  const itineraryButton = {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
  };
  const customizeButton = { ...bookButton, backgroundColor: "#6f42c1" };
  const itineraryLinkStyle = {
    color: "#2e7d32",
    cursor: "pointer",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
  };
  const arrowStyle = (open) => ({
    marginLeft: 6,
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
    transition: "0.3s",
  });
  const modalOverlay = {
    fontFamily: "'Times New Roman', Times, serif",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };
  const modalForm = {
    fontFamily: "'Times New Roman', Times, serif",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  };
  const inputStyle = {
    fontFamily: "'Times New Roman', Times, serif",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  };
  const submitButton = {
    fontFamily: "'Times New Roman', Times, serif",
    padding: 10,
    backgroundColor: "#065f46",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  };
  const labelStyle = {
    fontFamily: "'Times New Roman', Times, serif",
    fontWeight: "bold",
    marginBottom: 4,
  };
  const cancelButton = {
    fontFamily: "'Times New Roman', Times, serif",
    padding: 10,
    marginTop: 8,
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  };
  const popupStyle = {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "12px 20px",
    borderRadius: 10,
    zIndex: 2000,
    color: "#fff",
    fontWeight: 600,
    fontFamily: "'Times New Roman', Times, serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    backgroundColor: popup.type === "success" ? "#66bb6a" : "#e53935",
    transition: "all 0.3s ease",
  };

  const closeModal = () => setBookingId(null);
  const closeCustomizeModal = () => setCustomizeId(null);

  return (
    <div
      className="flex flex-col items-center font-serif"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div
  className="w-full relative flex flex-col justify-center items-center text-center h-[500px] md:h-[550px] lg:h-[600px] bg-cover bg-center"
  style={{ backgroundImage: "url(/images/ella1.jpg)" }}
>
  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
  <div className="relative z-10 px-6 md:px-20">
    <h1 className="text-3xl md:text-5xl font-semibold text-green-900 mb-6 text-center drop-shadow-sm">
      Travel to Your Dream Destination
    </h1>
    <p className="text-black text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
      Sri Lanka is a treasure trove of natural beauty and cultural
      heritage. Explore iconic locations such as the ancient city of
      Sigiriya, the misty hills of Nuwara Eliya, the vibrant streets of
      Colombo, and the pristine beaches of Yala. Each destination offers
      unique experiences, from wildlife safaris and waterfall hikes to
      cultural tours and culinary adventures.
    </p>
  </div>

  <div className="flex items-center w-[80%] sm:w-[70%] max-w-md mx-auto mt-6 sm:mt-8 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 z-10">
    <div className="flex items-center flex-1 bg-white px-5 sm:px-6 h-12 sm:h-14">
      <i className="fa-solid fa-magnifying-glass text-gray-400 text-base sm:text-lg mr-3 sm:mr-4"></i>
      <input
        type="text"
        placeholder="Search tours & destinations..."
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
</div>


      <div style={containerStyle}>
        {!selectedDestination ? (
          isMobile ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1.1}
              centeredSlides
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                480: { slidesPerView: 1.2 },
                640: { slidesPerView: 1.5 },
              }}
            >
              {filteredDestinations.map((dest) => (
                <SwiperSlide key={dest._id}>
                  <div
                    style={cardStyle}
                    onClick={() => {
                      setSelectedDestination(dest);
                      setMainFilter("all");
                      setSubFilter("all");
                    }}
                  >
                    {dest.imageUrl && (
                      <img
                        src={`http://localhost:5000${dest.imageUrl}`}
                        alt={dest.name}
                        style={imageStyle}
                      />
                    )}
                    <h3 style={{ margin: "10px 0 5px", color: "#2c5d30" }}>
                      {dest.name}
                    </h3>
                    <p style={descriptionStyle}>
                      {expandedId === dest._id
                        ? dest.description
                        : dest.description?.slice(0, 100) +
                          (dest.description?.length > 100 ? "..." : "")}
                      {dest.description?.length > 100 && (
                        <button
                          onClick={() => toggleReadMore(dest._id)}
                          style={readMoreButton}
                        >
                          {expandedId === dest._id ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedDestination(dest);
                        setMainFilter("all");
                        setSubFilter("all");
                      }}
                      style={bookButton}
                    >
                      View Tours
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={gridStyle}>
              {filteredDestinations.map((dest) => (
                <div
                  key={dest._id}
                  style={cardStyle}
                  onClick={() => {
                    setSelectedDestination(dest);
                    setMainFilter("all");
                    setSubFilter("all");
                  }}
                >
                  {dest.imageUrl && (
                    <img
                      src={`http://localhost:5000${dest.imageUrl}`}
                      alt={dest.name}
                      style={imageStyle}
                    />
                  )}
                  <h3 style={{ margin: "10px 0 5px", color: "#2c5d30" }}>
                    {dest.name}
                  </h3>
                  <p style={descriptionStyle}>
                    {expandedId === dest._id
                      ? dest.description
                      : dest.description?.slice(0, 100) +
                        (dest.description?.length > 100 ? "..." : "")}
                    {dest.description?.length > 100 && (
                      <button
                        onClick={() => toggleReadMore(dest._id)}
                        style={readMoreButton}
                      >
                        {expandedId === dest._id ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDestination(dest);
                      setMainFilter("all");
                      setSubFilter("all");
                    }}
                    style={bookButton}
                  >
                    View Tours
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            <button
              onClick={() => setSelectedDestination(null)}
              style={{ ...bookButton, width: 80 }}
            >
              ← Back
            </button>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              {["all", "day", "round"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setMainFilter(f);
                    setSubFilter("all");
                  }}
                  style={{
                    ...bookButton,
                    backgroundColor: mainFilter === f ? "#ffa500" : "#065f46",
                    width: 120,
                    marginRight: 10,
                  }}
                >
                  {f === "all"
                    ? "All Tours"
                    : f === "day"
                    ? "Day Tours"
                    : "Round Tours"}
                </button>
              ))}
            </div>
            {(mainFilter === "day" || mainFilter === "round") && (
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                {["all", "special", "regular"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSubFilter(f)}
                    style={{
                      ...bookButton,
                      backgroundColor: subFilter === f ? "#ffa500" : "#065f46",
                      width: 100,
                      marginRight: 10,
                    }}
                  >
                    {f === "all"
                      ? "All"
                      : f === "special"
                      ? "Special"
                      : "Regular"}
                  </button>
                ))}
              </div>
            )}

            {isMobile ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1.1}
                centeredSlides
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  480: { slidesPerView: 1.2 },
                  640: { slidesPerView: 1.5 },
                }}
              >
                {filteredTours.map((tour) => (
                  <SwiperSlide key={tour._id}>
                    <div style={cardStyle}>
                      {tour.isSpecial && (
                        <div style={specialBadgeStyle}>⭐ Special</div>
                      )}
                      <img
                        src={`http://localhost:5000${tour.imageUrl}`}
                        alt={tour.title}
                        style={imageStyle}
                      />
                      <h3
                        style={{
                          margin: "10px 0 5px",
                          color: "#2c5d30",
                          fontSize: "1.8rem",
                        }}
                      >
                        {tour.title}
                      </h3>
                      <p style={infoStyle}>📍 {tour.location}</p>
                      <p style={infoStyle}>⏱ {tour.duration}</p>
                      <p style={infoStyle}>
                        ⭐{" "}
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < tour.rating ? "#ffc107" : "#ccc",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </p>
                      <p style={infoStyle}>💲 {tour.price}</p>
                      <button
                        onClick={() => openBookingForm(tour)}
                        style={bookButton}
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => openCustomizeForm(tour)}
                        style={customizeButton}
                      >
                        Customize Tour
                      </button>
                      {tour.itinerary?.length > 0 && (
                        <p
                          onClick={() => toggleItinerary(tour._id)}
                          style={itineraryLinkStyle}
                        >
                          Itinerary{" "}
                          <span
                            style={arrowStyle(itineraryVisibility[tour._id])}
                          >
                            ▶
                          </span>
                        </p>
                      )}
                      {itineraryVisibility[tour._id] &&
                        tour.itinerary.map((i) => (
                          <p key={i.day} style={descriptionStyle}>
                            Day {i.day}: {i.description}
                          </p>
                        ))}
                      <button
                        onClick={() => generateItineraryPDF(tour)}
                        style={itineraryButton}
                      >
                        Download PDF
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div style={gridStyle}>
                {filteredTours.map((tour) => (
                  <div key={tour._id} style={cardStyle}>
                    {tour.isSpecial && (
                      <div style={specialBadgeStyle}>⭐ Special</div>
                    )}
                    <img
                      src={`http://localhost:5000${tour.imageUrl}`}
                      alt={tour.title}
                      style={imageStyle}
                    />
                    <h3
                      style={{
                        margin: "10px 0 5px",
                        color: "#2c5d30",
                        fontSize: "1.8rem",
                      }}
                    >
                      {tour.title}
                    </h3>
                    <p style={infoStyle}>📍 {tour.location}</p>
                    <p style={infoStyle}>⏱ {tour.duration}</p>
                    <p style={infoStyle}>
                      ⭐{" "}
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          style={{
                            color: i < tour.rating ? "#ffc107" : "#ccc",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </p>
                    <p style={infoStyle}>💲 {tour.price}</p>
                    <button
                      onClick={() => openBookingForm(tour)}
                      style={bookButton}
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => openCustomizeForm(tour)}
                      style={customizeButton}
                    >
                      Customize Tour
                    </button>
                    {tour.itinerary?.length > 0 && (
                      <p
                        onClick={() => toggleItinerary(tour._id)}
                        style={itineraryLinkStyle}
                      >
                        Itinerary{" "}
                        <span style={arrowStyle(itineraryVisibility[tour._id])}>
                          ▶
                        </span>
                      </p>
                    )}
                    {itineraryVisibility[tour._id] &&
                      tour.itinerary.map((i) => (
                        <p key={i.day} style={descriptionStyle}>
                          Day {i.day}: {i.description}
                        </p>
                      ))}
                    <button
                      onClick={() => generateItineraryPDF(tour)}
                      style={itineraryButton}
                    >
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

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
              <input value={bookingForm.price} readOnly style={inputStyle} />

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

              <label style={labelStyle}>
                Preferred Destinations / Preferences
              </label>
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

export default DestinationsPage;

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    youtube: "",
  });

  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const fontStyle = { fontFamily: "'Times New Roman', Times, serif" };

  // ✅ Fetch contact details from backend
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contact");
        setContact(res.data);
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };
    fetchContact();
  }, []);

  // Close mobile menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${
        isLandingPage
          ? "absolute top-0 left-0 bg-transparent text-white"
          : "bg-white text-black shadow-md"
      }`}
    >
      {/* ---------- TOP BAR ---------- */}
      <div
        className={`w-full flex flex-col sm:flex-row justify-between items-center px-6 md:px-20 py-2 text-[15px] gap-1 ${
          isLandingPage ? "bg-transparent" : "bg-gray-100"
        }`}
        style={fontStyle}
      >
        {/* LEFT - CONTACT INFO */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 font-medium text-center sm:text-left">
          {contact.phone && <span>📞 {contact.phone}</span>}
          {contact.email && <span>✉️ {contact.email}</span>}
        </div>

        {/* RIGHT - SOCIALS + BUTTONS */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 mt-1 sm:mt-0">
          {contact.facebook && (
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaFacebookF size={18} />
            </a>
          )}
          {contact.instagram && (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
            >
              <FaInstagram size={18} />
            </a>
          )}
          {contact.youtube && (
            <a
              href={contact.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-600"
            >
              <FaYoutube size={18} />
            </a>
          )}

          <Link
            to="/contact"
            className="px-3 py-1.5 rounded font-semibold bg-orange-500 text-white hover:bg-orange-600 text-[14px]"
          >
            Inquiry
          </Link>

          <Link
            to="/admin-login"
            className={`px-3 py-1.5 border rounded font-semibold transition text-[14px] ${
              isLandingPage
                ? "text-white hover:bg-orange-500 hover:text-white border-white"
                : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
            }`}
          >
            Admin
          </Link>
        </div>
      </div>

      {/* ---------- MAIN NAV ---------- */}
      <div
        className={`flex justify-between items-center px-6 md:px-20 py-3 ${
          isLandingPage ? "text-white" : "text-black"
        }`}
        style={fontStyle}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src={isLandingPage ? "/images/logo.png" : "/images/logo.png"}
            alt="Logo"
            className="w-24 md:w-32 object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 font-semibold text-[17px]">
          {[
            "home",
            "tours",
            "destinations",
            "experiences",
            "gallery",
            "transport",
            "blog",
            "about",
            "contact",
            "support",
          ].map((item) => (
            <Link
              key={item}
              to={`/${item}`}
              className={`hover:text-orange-500 ${
                isLandingPage ? "hover:text-orange-400" : ""
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden text-2xl ${
            isLandingPage ? "text-white" : "text-black"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* ---------- MOBILE MENU ---------- */}
      {menuOpen && (
        <div
          className={`md:hidden flex flex-col items-center space-y-3 py-4 font-semibold text-[17px] transition-all ${
            isLandingPage ? "bg-black/70 text-white" : "bg-white text-black"
          }`}
        >
          {[
            "home",
            "tours",
            "destinations",
            "experiences",
            "gallery",
            "transport",
            "blog",
            "about",
            "contact",
            "support",
          ].map((item) => (
            <Link
              key={item}
              to={`/${item}`}
              onClick={closeMenu}
              className="hover:text-orange-500"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

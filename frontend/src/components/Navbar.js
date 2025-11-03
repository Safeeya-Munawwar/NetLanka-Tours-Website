import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/tours", label: "Tour Packages" },
    { to: "/destinations", label: "Destinations" },
    { to: "/experiences", label: "Experiences" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/support", label: "Support" },
    { to: "/transport", label: "Transport" },
  ];

  const isActive = (to) => location.pathname === to;
  const fontStyle = { fontFamily: "'Times New Roman', Times, serif" };

  return (
    <nav className="sticky top-0 z-50 bg-[#064420] border-b-4 border-[#81c784] shadow-md">
      <div className="flex items-center justify-between px-5 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#e8f5e9] font-bold text-xl"
          style={fontStyle}
        >
          <img
            src="/images/logo.PNG"
            alt="Net Lanka Logo"
            className="h-9 w-auto"
          />
          <span>Net Lanka Tours</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          {navLinks.map(({ to, label }, index) => (
            <React.Fragment key={to}>
              <Link
                to={to}
                className={`relative font-serif font-semibold text-[16px] transition-colors duration-300 ${
                  isActive(to)
                    ? "text-[#81c784]"
                    : "text-[#e8f5e9] hover:text-[#81c784]"
                }`}
              >
                {label}
              </Link>
              {index !== navLinks.length - 1 && (
                <span className="h-5 w-[1px] bg-gradient-to-b from-[#81c784] to-[#1b5e20]" />
              )}
            </React.Fragment>
          ))}
          <Link
            to="/admin-login"
            className="ml-3 bg-[#1b5e20] text-white px-4 py-2 rounded-md font-bold text-[16px] font-serif hover:bg-[#2e7d32] transition-all"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex flex-col gap-[5px] md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-[3px] bg-[#e8f5e9] rounded transition-all duration-300" />
          <span className="w-6 h-[3px] bg-[#e8f5e9] rounded transition-all duration-300" />
          <span className="w-6 h-[3px] bg-[#e8f5e9] rounded transition-all duration-300" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#f4f9f9] flex flex-col gap-3 px-5 py-4 shadow-lg rounded-b-lg">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={fontStyle}
              className="text-[#064420] text-[16px] font-semibold font-serif hover:text-[#1b5e20] transition"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/admin-login"
            onClick={() => setMenuOpen(false)}
            style={fontStyle}
            className="bg-[#1b5e20] text-white text-center font-bold px-4 py-2 rounded-md mt-2 hover:bg-[#2e7d32] transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

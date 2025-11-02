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
  ];

  const isActive = (to) => location.pathname === to;
  const fontStyle = { fontFamily: "'Times New Roman', Times, serif" };

  return (
    <nav className="sticky top-0 z-50 bg-[#064420] shadow-md border-b-4 border-[#81c784]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#e8f5e9] font-bold text-xl"
          style={fontStyle}
        >
          <img src="/images/logo.PNG" alt="Mahaweli Logo" className="h-9 w-auto" />
          <span>Net Lanka Tours</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ to, label }, idx) => (
            <React.Fragment key={to}>
              <Link
                to={to}
                style={fontStyle}
                className={`relative px-1 py-1.5 font-semibold text-base transition-colors ${
                  isActive(to) ? "text-[#81c784]" : "text-[#e8f5e9]"
                } hover:text-[#81c784]`}
              >
                {label}
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#81c784] transition-all group-hover:w-full"></span>
              </Link>
              {idx !== navLinks.length - 1 && (
                <span className="w-px h-5 bg-gradient-to-b from-[#81c784] to-[#1b5e20] mx-1"></span>
              )}
            </React.Fragment>
          ))}

          {/* Admin Button */}
          <Link
            to="/admin-login"
            style={fontStyle}
            className="ml-3 bg-[#1b5e20] text-white px-4 py-2 rounded-md font-bold text-base hover:bg-[#2e7d32] transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Hamburger */}
        <div
          className="md:hidden flex flex-col gap-1 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-[#e8f5e9] rounded"></span>
          <span className="w-6 h-0.5 bg-[#e8f5e9] rounded"></span>
          <span className="w-6 h-0.5 bg-[#e8f5e9] rounded"></span>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute right-4 top-16 bg-[#f4f9f9] shadow-lg rounded-lg flex flex-col gap-1 p-3 w-52">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={fontStyle}
              className="text-[#064420] font-semibold hover:text-[#1b5e20] text-base"
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
      )}
    </nav>
  );
}

export default Navbar;

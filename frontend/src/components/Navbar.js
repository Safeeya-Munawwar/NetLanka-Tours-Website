import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const location = useLocation();

  const fontStyle = { fontFamily: "'Times New Roman', Times, serif" };

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About" },
    {
      to: "/tours",
      label: "Tours & Destinations",
      dropdown: [
        { to: "/tours", label: "Tour Packages" },
        { to: "/destinations", label: "Destinations" },
        { to: "/experiences", label: "Experiences" },
        { to: "/transport", label: "Transport" },
      ],
    },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    {
      to: "/contact",
      label: "Contact",
      dropdown: [
        { to: "/contact", label: "Contact" },
        { to: "/support", label: "Support" },
      ],
    },
  ];

  const isActive = (to) => location.pathname === to;

  const toggleDropdown = (label) => {
    setDropdownOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#064420] shadow-md">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#e8f5e9] font-bold text-sm"
          style={fontStyle}
        >
          <img src="/images/logo.PNG" alt="Net Lanka Logo" className="h-10 w-auto" />
          <span>Net Lanka Tours</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          {navLinks.map(({ to, label, dropdown }, index) => (
            <React.Fragment key={to}>
              <div className="relative group">
                {dropdown ? (
                  <>
                    <button
                      className={`text-[#e8f5e9] font-semibold px-3 py-2 transition-colors hover:text-[#81c784]`}
                      style={fontStyle}
                    >
                      {label}
                    </button>
                    {/* Desktop Dropdown with fade + slide */}
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-300 z-50">
                      {dropdown.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block px-4 py-2 text-gray-800 hover:bg-[#e0f2f1] font-serif"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={to}
                    className={`text-[#e8f5e9] font-semibold px-3 py-2 transition-colors ${
                      isActive(to) ? "text-[#81c784]" : "hover:text-[#81c784]"
                    }`}
                    style={fontStyle}
                  >
                    {label}
                  </Link>
                )}
              </div>
              {/* Divider */}
              {index !== navLinks.length - 1 && (
                <span className="h-6 w-[1px] bg-[#81c784] mx-1" />
              )}
            </React.Fragment>
          ))}
          <Link
            to="/admin-login"
            className="ml-4 bg-[#1b5e20] text-white px-4 py-2 rounded-md font-bold hover:bg-[#2e7d32] transition"
            style={fontStyle}
          >
            Admin
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
          <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
          <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#f4f9f9] overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-5 py-4 gap-3">
          {navLinks.map(({ to, label, dropdown }) => (
            <div key={to} className="flex flex-col">
              {dropdown ? (
                <>
                  <button
                    className="text-[#064420] font-semibold font-serif text-left px-2 py-2 w-full flex justify-between items-center"
                    onClick={() => toggleDropdown(label)}
                  >
                    {label}
                    <span className="ml-2">{dropdownOpen[label] ? "▲" : "▼"}</span>
                  </button>
                  <div
                    className={`flex flex-col ml-4 mt-1 gap-1 overflow-hidden transition-all duration-300 ${
                      dropdownOpen[label] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {dropdown.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="text-[#064420] hover:text-[#1b5e20] font-serif px-2 py-1"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#064420] hover:text-[#1b5e20] font-serif font-semibold px-2 py-2"
                >
                  {label}
                </Link>
              )}
              {/* Divider for mobile */}
              <div className="h-[1px] w-full bg-[#064420] my-1" />
            </div>
          ))}
          <Link
            to="/admin-login"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-[#1b5e20] text-white text-center font-bold px-4 py-2 rounded-md hover:bg-[#2e7d32] transition"
          >
            Admin
          </Link>
        </div> 
      </div>
    </nav>
  );
}

export default Navbar;

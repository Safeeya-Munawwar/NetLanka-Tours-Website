import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tours", label: "Tour Packages" },
    { to: "/destinations", label: "Destinations" }, // <-- new link
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];  

  const linkStyle = (to) => ({
    position: "relative",
    textDecoration: "none",
    color: location.pathname === to ? "#81c784" : "#e8f5e9",
    padding: "8px 12px",
    fontWeight: 600,
    fontSize: "16px",
    fontFamily: "'Times New Roman', Times, serif",
    transition: "color 0.3s ease",
  });

  const adminButtonStyle = {
    backgroundColor: "#1b5e20",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    textDecoration: "none",
    border: "none",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    fontFamily: "'Times New Roman', Times, serif",
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src="/images/logo.PNG" alt="Mahaweli Logo" />
        <span>Net Lanka Tours</span>
      </Link>

      {/* Desktop Nav */}
      <div className="desktop-nav">
        {navLinks.map(({ to, label }, index) => (
          <React.Fragment key={to}>
            <Link to={to} style={linkStyle(to)} className="nav-link">
              {label}
              <span className="underline"></span>
            </Link>
            {index !== navLinks.length - 1 && <span className="nav-divider"></span>}
          </React.Fragment>
        ))}
        <span className="nav-divider"></span>
        <Link to="/admin-login" style={adminButtonStyle}>Admin</Link>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{ color: "#064420", fontWeight: "600", fontFamily: "'Times New Roman', Times, serif" }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/admin-login"
            onClick={() => setMenuOpen(false)}
            style={{
              ...adminButtonStyle,
              display: "block",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Admin
          </Link>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: #064420;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
          flex-wrap: wrap;
          border-bottom: 4px solid #81c784;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #e8f5e9;
          font-size: 20px;
          font-weight: bold;
          gap: 8px;
        }

        .logo img {
          height: 40px;
          width: auto;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: auto;
        }

        .nav-divider {
          width: 1px;
          height: 20px;
          background: linear-gradient(to bottom, #81c784, #1b5e20);
          margin: 0 8px;
          transition: all 0.3s ease;
        }

        .nav-link {
          position: relative;
          display: inline-block;
        }

        .nav-link .underline {
          position: absolute;
          bottom: -2px;
          left: 0;
          height: 2px;
          width: 0%;
          background-color: #81c784;
          transition: width 0.3s ease;
        }

        .nav-link:hover .underline {
          width: 100%;
        }

        .nav-link:hover + .nav-divider {
          box-shadow: 0 0 8px #81c784;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 4px;
          margin-left: auto;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background-color: #e8f5e9;
          border-radius: 2px;
        }

        .mobile-menu {
          position: absolute;
          top: 64px;
          right: 20px;
          background-color: #f4f9f9;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 200px;
        }

        .mobile-menu a {
          color: #064420;
          text-decoration: none;
          font-size: 16px;
        }

        .mobile-menu a:hover {
          color: #1b5e20;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;

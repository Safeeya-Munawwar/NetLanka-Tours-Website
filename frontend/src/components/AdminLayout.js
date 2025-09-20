import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { label: "Home", to: "/admin-home" },
    { label: "Tour Packages", to: "/admin-tours" },
    { label: "Destinations", to: "/admin-destination" },
    { label: "Gallery", to: "/admin-gallery" },
    { label: "Blog", to: "/admin-blog" },
    { label: "Bookings", to: "/admin-bookings" },
    { label: "Customize Tour", to: "/admin-customiseTour" },
    { label: "Comments", to: "/admin-comments" },
    { label: "About", to: "/admin-about" },
    { label: "Contact", to: "/admin-contact" },
    { label: "Logout", to: "/admin-login" },
  ];


  return (
    <>
      <nav className="admin-navbar">
        <Link to="/admin-dashboard" className="logo">
          <img src="/images/logo.PNG" alt="NetLanka Logo" />
        </Link>

        {!isMobile && (
          <div className="desktop-links">
            {links.map(({ label, to }, idx) => (
              <React.Fragment key={to}>
                <Link
                  to={to}
                  className={`nav-link ${location.pathname === to ? "active" : ""}`}
                >
                  {label}
                  <span className="underline"></span>
                </Link>
                {idx !== links.length - 1 && <span className="nav-divider"></span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {isMobile && (
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div className="mobile-menu">
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={location.pathname === to ? "mobile-link active" : "mobile-link"}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      <main className="admin-content">{children}</main>

      <style>{`
        .admin-navbar {
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
          height: 60px;
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

        .desktop-links {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .nav-link {
          position: relative;
          color: #c5e1a5;
          text-decoration: none;
          padding: 6px 10px;
          font-weight: 500;
          font-family: 'Times New Roman', Times, serif;
          transition: color 0.3s ease;
        }

        .nav-link.active {
          color: #fff;
          font-weight: 700;
          border-bottom: 2px solid #aed581;
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

        .nav-divider {
          width: 1px;
          height: 20px;
          background: linear-gradient(to bottom, #81c784, #1b5e20);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 4px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background-color: #e8f5e9;
          border-radius: 2px;
        }

        .mobile-menu {
          position: absolute;
          top: 60px;
          right: 20px;
          background-color: #f4f9f9;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 200px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }

        .mobile-link {
          color: #064420;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Times New Roman', Times, serif;
          padding: 6px 0;
        }

        .mobile-link.active {
          color: #1b5e20;
        }

        .admin-content {
          padding-top: 10px;
          background-color: #f6f6f6;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .desktop-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default AdminLayout;

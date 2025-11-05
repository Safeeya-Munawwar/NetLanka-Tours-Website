import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHome,
  FaCar,
  FaImages,
  FaBlog,
  FaBook,
  FaUserAlt,
  FaCommentDots,
  FaPhoneAlt,
  FaCogs,
  FaSignOutAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { MdTour } from "react-icons/md";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null); // For collapsible groups

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { label: "Dashboard", to: "/admin-dashboard", icon: <FaTachometerAlt /> },
    { label: "Home", to: "/admin-home", icon: <FaHome /> },
    { label: "Transports", to: "/admin-transport", icon: <FaCar /> },
    { label: "Tour Packages", to: "/admin-tours", icon: <MdTour /> },
    { label: "Destinations", to: "/admin-destination", icon: <FaMapMarkedAlt /> },
    { label: "Gallery", to: "/admin-gallery", icon: <FaImages /> },
    { label: "Blog", to: "/admin-blog", icon: <FaBlog /> },
    { label: "Bookings", to: "/admin-bookings", icon: <FaBook /> },
    { label: "Customize Tour", to: "/admin-customiseTour", icon: <FaCogs /> },
    { label: "Comments", to: "/admin-comments", icon: <FaCommentDots /> },
    { label: "About", to: "/admin-about", icon: <FaUserAlt /> },
    { label: "Contact", to: "/admin-contact", icon: <FaPhoneAlt /> },
    { label: "Experiences", to: "/admin-experiences", icon: <FaPhoneAlt /> },

    { label: "Logout", to: "/admin-login", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-green-900 text-white flex flex-col transition-all duration-300 shadow-lg fixed h-screen z-50 overflow-y-auto`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-green-700">
          <div className="flex items-center gap-2">
            <img src="/images/logo.PNG" alt="NetLanka" className="h-10" />
            {!isCollapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-green-300 transition"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Grouped Nav Links */}
        <nav className="flex-1 mt-4">
          {groupedLinks.map(({ group, icon, links }) => (
            <div key={group}>
              <button
                onClick={() => toggleGroup(group)}
                className={`flex items-center justify-between w-full px-5 py-3 text-sm font-semibold hover:bg-green-800 transition-all ${
                  openGroup === group ? "bg-green-800" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  {!isCollapsed && <span>{group}</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-xs">{openGroup === group ? "▲" : "▼"}</span>
                )}
              </button>

              {openGroup === group && (
                <div className="ml-10 border-l border-green-700">
                  {links.map(({ label, to, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium hover:text-green-200 transition-all ${
                        location.pathname === to ? "text-green-300 font-semibold" : "text-green-100"
                      }`}
                    >
                      <span className="text-base">{icon}</span>
                      {!isCollapsed && <span>{label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        } p-6`}
      >
        {children}
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <>
          <button
            className="fixed top-4 left-4 z-50 bg-green-800 text-white p-2 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {menuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setMenuOpen(false)}
            ></div>
          )}

          <aside
            className={`fixed top-0 left-0 bg-green-900 text-white h-full w-64 transition-transform duration-300 z-50 overflow-y-auto ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-green-700">
              <div className="flex items-center gap-2">
                <img src="/images/logo.PNG" alt="NetLanka" className="h-10" />
                <h2 className="text-lg font-semibold">Admin</h2>
              </div>
              <button
                className="text-white hover:text-green-300"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Mobile Menu Links */}
            <nav className="mt-4">
              {groupedLinks.map(({ group, icon, links }) => (
                <div key={group}>
                  <button
                    onClick={() => toggleGroup(group)}
                    className={`flex items-center justify-between w-full px-5 py-3 text-sm font-semibold hover:bg-green-800 transition-all ${
                      openGroup === group ? "bg-green-800" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <span>{group}</span>
                    </div>
                    <span className="text-xs">{openGroup === group ? "▲" : "▼"}</span>
                  </button>

                  {openGroup === group && (
                    <div className="ml-10 border-l border-green-700">
                      {links.map(({ label, to, icon }) => (
                        <Link
                          key={to}
                          to={to}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium hover:text-green-200 transition-all ${
                            location.pathname === to
                              ? "text-green-300 font-semibold"
                              : "text-green-100"
                          }`}
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="text-base">{icon}</span>
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminLayout;

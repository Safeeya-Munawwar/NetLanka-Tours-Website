import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import './i18n';
import 'leaflet/dist/leaflet.css';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingBooking from "./components/FloatingBooking";
import FloatingCustomize from "./components/FloatingCustomize";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Tours from "./pages/Tours";
import Destinations from "./pages/Destinations";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminCommentsPage from "./pages/AdminCommentPage";

// Admin pages
import AdminLayout from "./components/AdminLayout";
import AdminHome from "./pages/AdminHome";
import AdminTours from "./pages/AdminTours";
import AdminGallery from "./pages/AdminGallery";
import AdminBlog from "./pages/AdminBlog";
import AdminBookings from "./pages/AdminBookings";
import AdminAbout from "./pages/AdminAbout";
import AdminContact from "./pages/AdminContact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDestination from "./pages/AdminDestination";
import AdminCustomTour from "./pages/AdminCustomTour";
import LandingPage from "./pages/LandingPage";
import Experiences from "./components/Experiences";

function App() {
  const location = useLocation();

  // Detect admin routes
  const isAdminRoute = location.pathname.startsWith("/admin") && location.pathname !== "/admin-login";

  // Hide floating buttons on specific pages
  const hideFloatingButtons = 
    isAdminRoute || 
    location.pathname === "/" ||  // Landing page
    location.pathname === "/admin-login"; // Admin login

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {isAdminRoute ? (
        <AdminLayout>
          <Routes>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/admin-tours" element={<AdminTours />} />
            <Route path="/admin-destination" element={<AdminDestination />} />
            <Route path="/admin-gallery" element={<AdminGallery />} />
            <Route path="/admin-blog" element={<AdminBlog />} />
            <Route path="/admin-bookings" element={<AdminBookings />} />
            <Route path="/admin-customiseTour" element={<AdminCustomTour />} />
            <Route path="/admin-about" element={<AdminAbout />} />
            <Route path="/admin-contact" element={<AdminContact />} />
            <Route path="/admin-comments" element={<AdminCommentsPage />} />
          </Routes>
        </AdminLayout>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/experiences" element={<Experiences/>} />

          <Route path="/destinations" element={<Destinations />} /> 
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
         
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      )}

      {!isAdminRoute && <Footer />}

      {/* ✅ Hide floating buttons when needed */}
      {!hideFloatingButtons && (
        <>
          <FloatingWhatsApp />
          <FloatingBooking />
          <FloatingCustomize />
        </>
      )}
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import {
  FaYoutubeSquare,
  FaTripadvisor,
  FaPinterestSquare,
  FaInstagramSquare,
  FaGooglePlusSquare,
  FaFacebookSquare,
  FaMapMarkerAlt,
  FaPhoneSquare,
  FaEnvelopeSquare,
} from "react-icons/fa";
import axios from "axios";

const iconBoxStyle = {
  width: 42,
  height: 42,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#1b5e20",
  borderRadius: "50%",
  flexShrink: 0,
};

const Footer = () => {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get("/api/contact");
        setContactInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch contact info:", err);
      }
    };

    fetchContactInfo();
  }, []);

  if (!contactInfo) return <p className="text-center mt-10 text-white">Loading Footer...</p>;

  const socialMediaMap = {
    Facebook: { url: contactInfo.socialMedia.Facebook, icon: <FaFacebookSquare size={38} /> },
    Youtube: { url: contactInfo.socialMedia.Youtube, icon: <FaYoutubeSquare size={38} /> },
    Tripadvisor: { url: contactInfo.socialMedia.Tripadvisor, icon: <FaTripadvisor size={38} /> },
    Pinterest: { url: contactInfo.socialMedia.Pinterest, icon: <FaPinterestSquare size={38} /> },
    Instagram: { url: contactInfo.socialMedia.Instagram, icon: <FaInstagramSquare size={38} /> },
    Google: { url: contactInfo.socialMedia.Google, icon: <FaGooglePlusSquare size={38} /> },
  };

  const Divider = () => (
    <div
      style={{
        width: "2px",
        background: "linear-gradient(to bottom, #4caf50, #81c784)",
        borderRadius: 2,
        margin: "0 20px",
        alignSelf: "stretch",
      }}
    />
  );

  return (
    <footer
      style={{
        padding: "40px 20px 30px",
        backgroundColor: "#064420",
        color: "#e8f5e9",
        fontFamily: "'Times New Roman', Times, serif",
        borderTop: "5px solid transparent",
        borderImage: "linear-gradient(to right, #4caf50, #81c784)",
        borderImageSlice: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo & Description */}
        <div style={{ flex: "1 1 250px", minWidth: 220 }}>
          <img
            src="/images/logo.PNG"
            alt="Logo"
            style={{ width: 120, margin: "0 auto 12px", display: "block" }}
          />
          <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 250, margin: "0 auto" }}>
            Explore the best tours and holidays with Net Lanka Tours. Creating memorable journeys
            across Sri Lanka.
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:flex">
          <Divider />
        </div>

        {/* Quick Links */}
        <div style={{ flex: "1 1 180px", minWidth: 150 }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Quick Links</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.8 }}>
            {["Home", "Tour Packages", "Destinations", "Gallery", "Blog", "About", "Contact"].map(
              (page) => (
                <li key={page}>
                  <a
                    href={`/${page === "Home" ? "" : page.toLowerCase().replace(" ", "")}`}
                    style={{ color: "#e8f5e9", textDecoration: "none", fontSize: 15 }}
                  >
                    {page}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="hidden md:flex">
          <Divider />
        </div>

{/* Contact Info */}
<div style={{ flex: "1 1 250px", minWidth: 200 }}>
  <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e8f5e9", textAlign: "center" }}>Contact Us</h3>

  <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
    {/* Phone */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{ ...iconBoxStyle, backgroundColor: "#2e7d32" }}>
        <FaPhoneSquare style={{ fontSize: 20, color: "#fff" }} />
      </span>
      <span style={{ fontSize: 15, color: "#e8f5e9", textAlign: "center" }}>{contactInfo.phone}</span>
    </div>

    {/* Email */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{ ...iconBoxStyle, backgroundColor: "#2e7d32" }}>
        <FaEnvelopeSquare style={{ fontSize: 20, color: "#fff" }} />
      </span>
      <span style={{ fontSize: 15, color: "#e8f5e9", textAlign: "center" }}>{contactInfo.email}</span>
    </div>

    {/* Address */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{ ...iconBoxStyle, backgroundColor: "#2e7d32" }}>
        <FaMapMarkerAlt style={{ fontSize: 20, color: "#fff" }} />
      </span>
      <span style={{ fontSize: 15, color: "#e8f5e9", textAlign: "center", lineHeight: 1.5 }}>
        {contactInfo.corporateOffice}
      </span>
    </div>
  </div>
</div>

        {/* Social Media */}
        <div style={{ flex: "1 1 250px", minWidth: 200 }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Follow Us</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {Object.entries(socialMediaMap).map(([platform, { url, icon }]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={platform}
                style={{
                  transition: "transform 0.3s, opacity 0.3s",
                  color: "#e8f5e9",
                  opacity: 0.85,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "0.85";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <p style={{ marginTop: 40, fontSize: 13, textAlign: "center", userSelect: "none" }}>
        ©2025 Net Lanka Tours. All rights reserved | Developed By: NetIT Technology
      </p>
    </footer>
  );
};

export default Footer;

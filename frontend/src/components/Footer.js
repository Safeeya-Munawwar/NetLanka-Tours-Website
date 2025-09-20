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
        alignSelf: "stretch",   // ✅ makes divider fill full column height
      }}
    />
  );
  

  return (
    <footer
      style={{
        padding: "60px 20px 40px",
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
    textAlign: "left",
    alignItems: "stretch",  // ✅ ensures divider stretches with items
  }}
>
        {/* Logo & Description */}
        <div style={{ flex: "1 1 200px", minWidth: 200 }}>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",   // ✅ centers content horizontally
      textAlign: "center",    // ✅ centers paragraph text
    }}
  >
    <img
      src="/images/logo.PNG"
      alt="Logo"
      style={{ width: 120, marginBottom: 8 }}
    />
    <p style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 220 }}>
      Explore the best tours and holidays with Net Lanka Tours. Creating
      memorable journeys across Sri Lanka.
    </p>
  </div>
</div>


        <Divider />

        {/* Quick Links */}
        <div style={{ flex: "1 1 150px", minWidth: 150 }}>
          <div style={{ display: "flex",
      flexDirection: "column",
      alignItems: "center",   // ✅ centers content horizontally
      textAlign: "center",    // ✅ centers paragraph text
}}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Quick Links</h3>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.7 }}>
              {["Home", "Tour Packages", "Destinations", "Gallery", "Blog", "About", "Contact"].map((page) => (
                <li key={page}>
                  <a
                    href={`/${page === "Home" ? "" : page.toLowerCase().replace(" ", "")}`}
                    style={{ color: "#e8f5e9", textDecoration: "none", fontSize: 16 }}
                  >
                    {page}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Divider />

        {/* Contact Info */}
        <div style={{ flex: "1 1 250px", minWidth: 150 }}>
          <div style={{display: "flex",
      flexDirection: "column",
}}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Contact Us</h3>

            <p style={{ fontSize: 17, margin: "10px 0", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={iconBoxStyle}>
                <FaPhoneSquare style={{ fontSize: 22, color: "#fff" }} />
              </span>
              {contactInfo.phone}
            </p>

            <p style={{ fontSize: 17, margin: "10px 0", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={iconBoxStyle}>
                <FaEnvelopeSquare style={{ fontSize: 22, color: "#fff" }} />
              </span>
              {contactInfo.email}
            </p>

            <p style={{ fontSize: 17, margin: "10px 0", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={iconBoxStyle}>
                <FaMapMarkerAlt style={{ fontSize: 22, color: "#fff" }} />
              </span>
              {contactInfo.corporateOffice}
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div style={{ flex: "1 1 520px", minWidth: 150, textAlign: "center" }}>
          <h3 style={{ fontSize: 20, marginBottom: 20 }}>Follow Us</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
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

      <p style={{ marginTop: 50, fontSize: 14, textAlign: "center", userSelect: "none" }}>
        ©2025 Net Lanka Tours. All rights reserved | Developed By: Safeeya Munawwar
      </p>
    </footer>
  );
};

export default Footer;

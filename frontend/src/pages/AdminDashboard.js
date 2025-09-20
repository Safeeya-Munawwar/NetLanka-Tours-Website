import React from "react";

const AdminDashboard = () => {
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <img
          src="/images/logo.PNG"
          alt="Mahaweli Logo"
          style={logoStyle}
        />

        <h1 style={titleStyle}>Net Lanka Tours</h1>

        <h3 style={subtitleStyle}>Admin Dashboard</h3>
      </header>

      <main style={mainStyle}>
        <p style={welcomeStyle}>
          Welcome to the Admin Dashboard, your centralized control panel to
          efficiently manage all aspects of the website. From creating and
          updating tour packages to overseeing bookings and monitoring user
          interactions, this dashboard provides all the tools you need to keep
          the site running smoothly and deliver an excellent experience to your
          visitors. Stay organized, update content quickly, and maintain full
          control of your operations in one convenient place.
        </p>
      </main>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 992px) {
            h1 {
              font-size: 2.8rem !important;
            }
            h3 {
              font-size: 2rem !important;
            }
            p {
              font-size: 1.2rem !important;
              padding: 0 15px;
            }
            img {
              height: 100px !important;
            }
            div[style*="padding: 30px"] {
              padding: 20px !important;
            }
          }

          @media (max-width: 576px) {
            h1 {
              font-size: 2.2rem !important;
            }
            h3 {
              font-size: 1.6rem !important;
            }
            p {
              font-size: 1rem !important;
            }
            img {
              height: 80px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "30px",
  boxSizing: "border-box",
  textAlign: "center",
};

const headerStyle = {
  borderBottom: "2px solid #064420",
  paddingBottom: 15,
  marginBottom: 30,
};

const logoStyle = {
  height: 120,
  width: "auto",
  marginBottom: 20,
};

const titleStyle = {
  fontFamily: "'Times New Roman', Times, serif",
  fontSize: "3.6rem",
  color: "#064420",
  marginBottom: 12,
  userSelect: "none",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const subtitleStyle = {
  fontSize: "2.6rem",
  fontWeight: "700",
  letterSpacing: "0.04em",
  color: "#2c5d30",
  marginBottom: 40,
};

const mainStyle = {
  maxWidth: 900,
};

const welcomeStyle = {
  fontSize: "1.3rem",
  color: "#2c5d30",
};

export default AdminDashboard;

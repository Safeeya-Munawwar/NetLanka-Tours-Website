import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ADMIN_USERNAME = "netlanka";
const ADMIN_PASSWORD = "netlanka2025";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      setPopup("Login Successful!");
      setTimeout(() => {
        setPopup("");
        navigate("/admin-dashboard");
      }, 1500);
    } else {
      setError("Invalid username or password");
      setPopup("Login Failed!");
      setTimeout(() => setPopup(""), 1500);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Admin Login</h2>
      <p style={subtitleStyle}>
        Please enter your admin credentials below to access the dashboard and manage site content.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username" style={labelStyle}>Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError("");
          }}
          required
          style={inputStyle}
        />

        <label htmlFor="password" style={{ ...labelStyle, marginTop: 20 }}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            style={toggleButtonStyle}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        {error && (
          <p style={{ color: "#d32f2f", marginTop: 12, fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      {/* Popup */}
      {popup && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          backgroundColor: popup === "Login Successful!" ? "#4CAF50" : "#d32f2f",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 6,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999,
          fontWeight: "bold",
          fontSize: "14px"
        }}>
          {popup}
        </div>
      )}

      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="max-width: 600px"] {
              margin: 40px 15px !important;
              padding: 20px !important;
            }
            input {
              font-size: 15px !important;
              padding: 10px !important;
            }
            button[type="submit"] {
              font-size: 15px !important;
              padding: 10px 0 !important;
            }
          }
          @media (max-width: 480px) {
            h2 { font-size: 1.6rem !important; }
            p { font-size: 14px !important; line-height: 1.3; }
            input { font-size: 14px !important; padding: 8px !important; }
            button[type="submit"] { font-size: 14px !important; padding: 10px 0 !important; }
          }
        `}
      </style>
    </div>
  );
}

// Styles
const containerStyle = {
  marginTop: 50,
  maxWidth: 600,
  margin: "80px auto",
  padding: 30,
  backgroundColor: "#e6f4ea",
  border: "2px solid #4CAF50",
  borderRadius: 8,
  fontFamily: "'Times New Roman', Times, serif",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const titleStyle = {
  color: "#2e7d32",
  marginBottom: 8,
  textAlign: "center",
  fontSize: 35,
};

const subtitleStyle = {
  fontSize: 18,
  color: "#2e7d32",
  marginBottom: 24,
  textAlign: "center",
  lineHeight: 1.4,
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: "bold",
  color: "#2e7d32",
};

const inputStyle = {
  lineHeight: 1.4,
  width: "100%",
  padding: 12,
  borderRadius: 4,
  border: "1px solid #4CAF50",
  fontSize: 16,
  outline: "none",
  transition: "border-color 0.3s",
  boxSizing: "border-box",
};

const toggleButtonStyle = {
  position: "absolute",
  top: "50%",
  right: 12,
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  color: "#4CAF50",
  cursor: "pointer",
  padding: 0,
};

const buttonStyle = {
  width: "100%",
  padding: 12,
  marginTop: 24,
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 16,
  transition: "background-color 0.3s ease",
};

export default AdminLogin;

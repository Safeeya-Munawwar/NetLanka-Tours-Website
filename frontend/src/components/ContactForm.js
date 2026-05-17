import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUser, FaComment } from "react-icons/fa";
import axios from "../axiosConfig";

const ContactForm = () => {
  const [contactData, setContactData] = useState({
    contact: "",
    email: "",
    address: "",
  });

  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch contact info from backend
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get("/api/home-content");
        const data = res.data;
        setContactData({
          contact: data.contact || "Not available",
          email: data.email || "info@mahaweli.lk",
          address: data.address || "No address available",
        });
      } catch (err) {
        console.error("Failed to fetch contact info:", err);
      }
    };
    fetchContact();
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend posting
    setTimeout(() => {
      setLoading(false);
      setShowPopup(true);
      setCommentName("");
      setCommentEmail("");
      setCommentText("");
      setTimeout(() => setShowPopup(false), 2500);
    }, 1500);
  };

  return (
    <div className="mx-auto my-10 max-w-[1400px] bg-green-100 shadow-lg overflow-hidden flex flex-col md:flex-row rounded-xl">
      {/* Left Side - Info */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center items-center text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-4">Make an Inquiry</h2>
        <p className="text-green-800 mb-6 text-justify">
          We’d love to hear from you! Please fill in your details and your message, and our team will get back to you as soon as possible.
        </p>
        <div className="flex flex-col gap-4 text-green-900">
          <p className="flex items-center gap-3">
            <FaPhoneAlt className="text-orange-500" />
            <strong>Contact:</strong> {contactData.contact}
          </p>
          <p className="flex items-center gap-3">
            <FaEnvelope className="text-blue-500" />
            <strong>Email:</strong> {contactData.email}
          </p>
          <p className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-green-700" />
            <strong>Address:</strong> {contactData.address}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center text-center">
        <form className="flex flex-col gap-4" onSubmit={handleCommentSubmit}>
          <div className="flex items-center gap-3">
            <FaUser className="text-green-600 text-xl" />
            <input
              type="text"
              placeholder="Your Name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-green-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-green-600 text-xl" />
            <input
              type="email"
              placeholder="Your Email"
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-green-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-start gap-3">
            <FaComment className="text-green-600 text-xl mt-2" />
            <textarea
              placeholder="Write your comment..."
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-green-600 focus:outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-800 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:bg-green-700 transition disabled:opacity-50 self-center"
          >
            📝 {loading ? "Posting..." : "Submit Comment"}
          </button>

          {showPopup && (
            <div className="fixed top-5 right-5 bg-green-400 text-black p-4 rounded-lg shadow-lg font-semibold z-[9999]">
              ✅ Comment posted successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
  FaWhatsappSquare,
  FaPhoneSquare,
  FaEnvelopeSquare,
} from "react-icons/fa";

const Footer = () => {
  const [dayTours, setDayTours] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, contactRes] = await Promise.all([
          axios.get("http://localhost:5000/api/tours"),
          axios.get("http://localhost:5000/api/contact"),
        ]);

        const tours = toursRes.data || [];
        setDayTours(tours.filter((t) => t.type?.toLowerCase() === "day").slice(0, 5));
        setItineraries(tours.filter((t) => t.itinerary?.length > 0).slice(0, 5));
        setContactInfo(contactRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Newsletter submission
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_m1nq6ia",
        "template_4ktdqfu",
        formRef.current,
        "T3hp3B0HtjL9hMquH"
      )
      .then(() => alert("Subscribed successfully!"))
      .catch(() => alert("Subscription failed. Please try again."));
    e.target.reset();
  };

  return (
    <footer className="bg-white text-gray-800">
      {/* Upper section */}
      <div className="border-b border-gray-300 py-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-16">
          
          {/* Left: Logo + socials */}
          <div className="flex flex-col items-center">
            <img src="/images/logo.png" alt="Company Logo" className="w-52 mb-4" />
            {contactInfo && (
              <div className="flex space-x-4 text-2xl text-gray-700">
                <a
                  href={contactInfo.socialMedia?.Facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  <FaFacebookSquare />
                </a>
                <a
                  href={contactInfo.socialMedia?.Instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500"
                >
                  <FaInstagramSquare />
                </a>
                <a
                  href={contactInfo.socialMedia?.Youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600"
                >
                  <FaYoutubeSquare />
                </a>
              </div>
            )}
          </div>

          {/* Right: Newsletter */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 uppercase tracking-wide">
              Receive Travel Inspirations
            </h3>
            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="flex items-center border-b border-gray-500 pb-2"
            >
              <input
                type="email"
                name="user_email"
                placeholder="Your email address *"
                required
                className="w-64 md:w-80 text-sm outline-none border-none placeholder-gray-500 text-center md:text-left"
              />
              <button
                type="submit"
                className="ml-3 text-xl font-bold text-[#1b5e20] hover:text-lime-600"
              >
                ➤
              </button>
            </form>
          </div>
        </div>

        {/* Contact Row */}
        {contactInfo && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10 text-sm">
            <div className="flex items-center gap-2 text-[#25D366]">
              <FaWhatsappSquare className="text-2xl" />
              <span>{contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[#2196F3]">
              <FaPhoneSquare className="text-2xl" />
              <span>{contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[#E53935]">
              <FaEnvelopeSquare className="text-2xl" />
              <span>{contactInfo.email}</span>
            </div>
          </div>
        )}

        {/* Awards */}
        <div className="flex justify-center items-center gap-6 mt-8 flex-wrap">
          <img src="/45.png" alt="award" className="h-20" />
          <img src="/48.png" alt="award" className="h-20" />
          <img src="/46.png" alt="award" className="h-20" />
          <img src="/47.png" alt="award" className="h-20" />
          <img src="/44.png" alt="award" className="h-20" />
        </div>
      </div>

      {/* Lower section */}
      <div className="border-b border-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Explore */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Explore The Site</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/home" className="hover:text-[#1b5e20]">Home</a></li>
              <li><a href="/tours" className="hover:text-[#1b5e20]">Tours</a></li>
              <li><a href="/destinations" className="hover:text-[#1b5e20]">Destinations</a></li>
              <li><a href="/about" className="hover:text-[#1b5e20]">About Us</a></li>
              <li><a href="/contact" className="hover:text-[#1b5e20]">Contact</a></li>
            </ul>
          </div>

          {/* Day Tours */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Day Tours</h4>
            <ul className="space-y-2 text-sm">
              {dayTours.map((tour) => (
                <li key={tour._id}>
                  <a href={`/tours/${tour._id}`} className="hover:text-[#1b5e20]">
                    {tour.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Itineraries */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Itineraries</h4>
            <ul className="space-y-2 text-sm">
              {itineraries.map((tour) => (
                <li key={tour._id}>
                  <a href={`/tours/${tour._id}`} className="hover:text-[#1b5e20]">
                    {tour.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          {contactInfo && (
            <div>
              <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
              <div className="flex space-x-4 text-2xl text-gray-700">
                <a
                  href={contactInfo.socialMedia?.Facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  <FaFacebookSquare />
                </a>
                <a
                  href={contactInfo.socialMedia?.Instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500"
                >
                  <FaInstagramSquare />
                </a>
                <a
                  href={contactInfo.socialMedia?.Youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600"
                >
                  <FaYoutubeSquare />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} YourTravel. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

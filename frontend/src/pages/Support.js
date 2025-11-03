import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaYoutube,
  FaPinterest,
  FaInstagram,
  FaGoogle,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Support = () => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contact")
      .then((res) => setContact(res.data))
      .catch((err) => console.error("Error fetching contact:", err));
  }, []);

  if (!contact)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        Loading support info...
      </div>
    );

  const socialIcons = {
    Facebook: <FaFacebookF />,
    Youtube: <FaYoutube />,
    Pinterest: <FaPinterest />,
    Instagram: <FaInstagram />,
    Google: <FaGoogle />,
  };

  const emergencyNumbers = [
    { label: "Police Emergency", number: "119" },
    { label: "Ambulance / Fire", number: "110" },
    { label: "Tourist Police", number: "1912" },
    { label: "Colombo Central Hospital", number: "+9411269111" },
    { label: "Highway Help Line", number: "1969" },
    { label: "Suwaseriya Ambulance", number: "1990" },
  ];

  const onlineServices = [
    {
      label: "Online Visa Service",
      link: "https://www.eta.gov.lk/slvisa/visainfo/center.jsp?locale=en_US",
    },
    {
      label: "Train Online Booking",
      link: "https://seatreservation.railway.gov.lk/mtktwebslr/",
    },
  ];

  return (
    <div
      className="flex flex-col items-center font-serif bg-[#f8fdf8]"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Header / Hero Section */}
      <div
        className="w-full relative flex flex-col justify-center items-center text-center h-[400px] md:h-[450px] lg:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/support1.PNG)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 md:px-20">
          <h1 className="text-3xl md:text-5xl font-semibold text-green-900 mb-6 drop-shadow-sm">
            24/7 Travel Support & Assistance
          </h1>
          <p className="text-black text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Whether you're on an exciting journey or facing an emergency, our
            support team and partner services are here to help you anytime,
            anywhere in Sri Lanka.
          </p>
        </div>
      </div>

      {/* Offices Section */}
      <section className="w-full max-w-6xl px-6 md:px-10 py-16 grid md:grid-cols-2 gap-10">
        {/* Corporate Office */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Corporate Office
          </h2>
          <p className="flex justify-center items-center gap-2 text-gray-700 mb-2">
            <FaMapMarkerAlt /> {contact.corporateOffice}
          </p>
          <p className="flex justify-center items-center gap-2 text-gray-700 mb-2">
            <FaPhoneAlt /> {contact.phone}
          </p>
          <p className="flex justify-center items-center gap-2 text-gray-700 mb-4">
            <MdEmail /> {contact.email}
          </p>
          <iframe
            src={`https://maps.google.com/maps?q=${contact.corporateCoords[0]},${contact.corporateCoords[1]}&z=15&output=embed`}
            className="w-full h-64 rounded-lg border-none"
            allowFullScreen
            loading="lazy"
            title="Corporate Office Map"
          ></iframe>
        </div>

        {/* Regional Office */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Regional Office
          </h2>
          <p className="flex justify-center items-center gap-2 text-gray-700 mb-2">
            <FaMapMarkerAlt /> {contact.regionalOffice}
          </p>
          <p className="flex justify-center items-center gap-2 text-gray-700 mb-2">
            <FaPhoneAlt /> {contact.phone}
          </p>
          <p className="flex justify-center items-center gap-2 text-gray-700 mb-4">
            <MdEmail /> {contact.email}
          </p>
          <iframe
            src={`https://maps.google.com/maps?q=${contact.regionalCoords[0]},${contact.regionalCoords[1]}&z=15&output=embed`}
            className="w-full h-64 rounded-lg border-none"
            allowFullScreen
            loading="lazy"
            title="Regional Office Map"
          ></iframe>
        </div>
      </section>

      {/* Quick Access Numbers */}
      <section className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-10 text-center mb-16">
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          Quick Access Numbers
        </h2>
        <p className="text-gray-600 mb-8">
          You can get any kind of these services for free
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {emergencyNumbers.map(({ label, number }) => (
            <div
              key={label}
              className="bg-green-100 text-green-900 rounded-xl p-5 hover:bg-green-200 transition cursor-pointer shadow-sm hover:shadow-md"
            >
              <p className="font-semibold">{label}</p>
              <p className="text-lg font-bold">{number}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Online Services */}
      <section className="w-full max-w-3xl bg-green-900 text-white rounded-2xl shadow-lg p-10 text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Online Services</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {onlineServices.map(({ label, link }) => (
            <a
              key={label}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* Social Media */}
      <section className="text-center mb-20">
        <h2 className="text-3xl font-bold text-green-800 mb-6">
          Connect With Us
        </h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {Object.entries(contact.socialMedia).map(([key, link]) => (
            <a
              key={key}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-green-700 hover:bg-green-600 text-white rounded-full text-xl transition"
              title={key}
            >
              {socialIcons[key] || key[0]}
            </a>
          ))}
        </div>
      </section>

      {/* Emergency Hotline */}
      <section className="max-w-2xl mx-auto bg-green-800 text-white text-center p-10 rounded-2xl shadow-lg mb-20">
        <h2 className="text-3xl font-bold mb-3">24/7 Emergency Hotline</h2>
        <p className="text-xl font-semibold mb-2">{contact.phone}</p>
        <p className="text-green-200">
          Available any time for travel assistance, emergencies, or inquiries.
        </p>
      </section>
    </div>
  );
};

export default Support;

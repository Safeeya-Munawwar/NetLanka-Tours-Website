import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTripadvisor,
  FaPinterest,
  FaGooglePlusG,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="relative w-full text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-90"
        style={{ backgroundImage: "url('/images/footer-bg.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-green-900/80"></div>

      {/* Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        {/* Left Section - Logo & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 sm:space-y-4">
          <img
            src="/images/logo.PNG"
            alt="Net Lanka Tours Logo"
            className="w-24 sm:w-28 md:w-32 h-auto object-contain"
          />
          <p className="text-sm sm:text-base md:text-lg leading-relaxed font-serif">
            Explore the best tours and holidays with Net Lanka Tours. Creating
            memorable journeys across Sri Lanka.
          </p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="flex flex-col items-center md:items-start space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-green-200">
            Quick Links
          </h3>
          {[
            "Home",
            "Tour Packages",
            "Destinations",
            "Gallery",
            "Blog",
            "About",
            "Contact",
          ].map((link) => (
            <a
              key={link}
              href={`/${
                link === "Home" ? "" : link.toLowerCase().replace(" ", "")
              }`}
              className="text-sm sm:text-base md:text-lg font-semibold hover:text-green-400 transition"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right Section - Contact & Social */}
        <div className="flex flex-col items-center md:items-start space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-green-200">
            Contact Us
          </h3>

          <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-semibold">
            <MdPhone className="text-green-300 text-lg sm:text-xl md:text-2xl" />
            +94 77 123 4567
          </p>
          <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-semibold">
            <MdEmail className="text-green-300 text-lg sm:text-xl md:text-2xl" />
            info@netlankatours.com
          </p>
          <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-semibold leading-snug text-center md:text-left">
            <MdLocationOn className="text-green-300 text-lg sm:text-xl md:text-2xl" />
            123, Colombo Rd, <br /> Kandy, Sri Lanka
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 sm:space-x-6 pt-3 text-2xl sm:text-3xl text-green-100">
            {[
              FaFacebookF,
              FaInstagram,
              FaYoutube,
              FaTripadvisor,
              FaPinterest,
              FaGooglePlusG,
            ].map((Icon, idx) => (
              <button
                key={idx}
                type="button"
                className="hover:text-green-400 transition text-2xl sm:text-3xl text-green-100"
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-green-950 text-green-100 py-3 sm:py-4 text-xs sm:text-sm md:text-base text-center font-medium">
        © {new Date().getFullYear()} Net Lanka Tours | Developed By{" "}
        <span className="text-green-300 font-semibold">NetIT Technology</span>
      </div>
    </footer>
  );
}

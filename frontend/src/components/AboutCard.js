import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";

const LOCALSTORAGE_KEY = "mahaweli_about_data";

const AboutCard = () => {
  const navigate = useNavigate();
  const [firstParagraph, setFirstParagraph] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirstParagraph = () => {
      try {
        const res = localStorage.getItem(LOCALSTORAGE_KEY);
        const data = res ? JSON.parse(res) : null;

        if (data && data.aboutTexts && data.aboutTexts.length > 0) {
          setFirstParagraph(data.aboutTexts[0]);
        } else {
          setFirstParagraph(
            "Net Lanka Tours & Holidays started in 2009 in Kandy. Our goal is to provide exceptional travel experiences across Sri Lanka."
          );
        }
      } catch (err) {
        console.error("Failed to fetch About paragraph:", err);
        setFirstParagraph(
          "Net Lanka Tours & Holidays started in 2009 in Kandy. Our goal is to provide exceptional travel experiences across Sri Lanka."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFirstParagraph();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mx-auto my-10 max-w-[1400px] bg-green-950 shadow-lg overflow-hidden flex flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="md:w-1/2 h-48 md:h-64 lg:h-80">
        <img
          src="/images/yala7.jpg"
          alt="Yala"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Content */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center items-center text-center">
        <h2 className="text-3xl font-bold text-lime-500 mb-4">Who We Are</h2>
        <p className="text-white mb-6 text-justify max-w-xl">{firstParagraph}</p>
        <button
          onClick={() => navigate("/about")}
          className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaInfoCircle /> About Us
        </button>
      </div>
    </div>
  );
};

export default AboutCard;

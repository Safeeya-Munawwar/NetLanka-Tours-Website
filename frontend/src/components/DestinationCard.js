import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaStar, FaMapMarkedAlt } from "react-icons/fa";

const DestinationCard = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tours");
        const latestTours = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setTours(latestTours);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="px-5 md:px-12 py-10 max-w-[1400px] mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900">
        Explore Our Exclusive Destinations
        </h2>
        <p className="text-lg text-gray-600 mt-2">Enjoy a stress-free vacation with all your needs covered.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tours.map((tour) => (
          <div
            key={tour._id}
            className="border-2 border-black rounded-xl overflow-hidden flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            {tour.imageUrl && (
              <img
                src={`http://localhost:5000${tour.imageUrl}`}
                alt={tour.title}
                className="w-full h-44 object-cover"
              />
            )}

            <div className="flex justify-between items-center px-3 py-2">
              <h3 className="text-green-900 font-bold text-lg">{tour.title}</h3>
              <div className="flex items-center text-yellow-400">
                <FaStar />
              </div>
            </div>

            <div className="flex justify-between items-center px-3 pb-3 text-gray-600">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" />
                <span>{tour.location}</span>
              </div>
              <span className="font-bold">5.0</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
  <button
    onClick={() => (window.location.href = "/destinations")}
    className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
  >
    <FaMapMarkedAlt /> View More Destinations
  </button>
</div>

    </div>
  );
};

export default DestinationCard;

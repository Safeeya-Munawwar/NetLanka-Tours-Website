// src/components/CategoryButtons.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

const placesData = {
  Beaches: [
    { name: "Unawatuna Beach", lat: 6.0171, lng: 80.2498 },
    { name: "Mirissa Beach", lat: 5.9481, lng: 80.4547 },
    { name: "Nilaveli Beach", lat: 8.395, lng: 81.221 },
    { name: "Bentota Beach", lat: 6.4205, lng: 79.9939 },
    { name: "Arugam Bay", lat: 6.8417, lng: 81.8723 },
    { name: "Hikkaduwa Beach", lat: 6.1432, lng: 80.1035 },
    { name: "Tangalle Beach", lat: 6.0326, lng: 80.7882 },
    { name: "Pasikudah Beach", lat: 8.8097, lng: 81.2727 },
  ],
  Wildlife: [
    { name: "Yala National Park", lat: 6.3619, lng: 81.5088 },
    { name: "Udawalawe National Park", lat: 6.423, lng: 80.927 },
    { name: "Wilpattu National Park", lat: 8.0647, lng: 79.9191 },
    { name: "Bundala National Park", lat: 5.9933, lng: 80.6363 },
    { name: "Sinharaja Forest Reserve", lat: 6.4212, lng: 80.4571 },
    { name: "Minneriya National Park", lat: 7.5956, lng: 81.0198 },
  ],
  Adventure: [
    { name: "Adam's Peak", lat: 6.8003, lng: 80.4912 },
    { name: "Knuckles Mountain Range", lat: 7.333, lng: 80.825 },
    { name: "Kitulgala", lat: 7.198, lng: 80.5 },
    { name: "Horton Plains National Park", lat: 6.8027, lng: 80.8128 },
    { name: "Ella Rock", lat: 6.865, lng: 81.044 },
    { name: "Pidurutalagala (Mount Pedro)", lat: 7.0034, lng: 80.7659 },
    { name: "Diyaluma Falls", lat: 6.8157, lng: 81.0706 },
  ],
  History: [
    { name: "Sigiriya Rock Fortress", lat: 7.9577, lng: 80.7606 },
    { name: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
    { name: "Polonnaruwa", lat: 7.9393, lng: 81.0009 },
    { name: "Dambulla Cave Temple", lat: 7.8589, lng: 80.6521 },
    { name: "Temple of the Tooth (Kandy)", lat: 7.293, lng: 80.6413 },
    { name: "Galle Fort", lat: 6.0328, lng: 80.217 },
    { name: "Ruwanwelisaya Stupa", lat: 8.3517, lng: 80.3946 },
  ],
  Gastronomy: [
    { name: "Colombo Food Street", lat: 6.9271, lng: 79.8612 },
    { name: "Kandy Market", lat: 7.2906, lng: 80.6337 },
    { name: "Galle Fort Food Market", lat: 6.0317, lng: 80.217 },
    { name: "Pettah Market (Colombo)", lat: 6.9277, lng: 79.8577 },
    { name: "Negombo Fish Market", lat: 7.2096, lng: 79.8353 },
  ],
  "Lesser Travelled": [
    { name: "Jaffna", lat: 9.6615, lng: 80.0255 },
    { name: "Haputale", lat: 6.8657, lng: 80.9936 },
    { name: "Mannar", lat: 8.9913, lng: 79.8996 },
    { name: "Kalpitiya", lat: 8.0261, lng: 79.7935 },
    { name: "Trincomalee", lat: 8.5679, lng: 81.233 },
    { name: "Ella", lat: 6.8408, lng: 81.0455 },
  ],
};

const categoryImages = {
  Beaches: "/images/beach.PNG",
  Wildlife: "/images/yala3.jpg",
  Gastronomy: "/images/culture.PNG",
  History: "/images/history.PNG",
  Adventure: "/images/adventure1.PNG",
  "Lesser Travelled": "/images/lessure.PNG",
};

// FitBounds component
function FitBounds({ places }) {
  const map = useMap();
  useEffect(() => {
    if (!places || places.length === 0) return;
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [places, map]);
  return null;
}

export default function CategoryButtons() {
  const [category, setCategory] = useState("Beaches");

  return (
    <div className="px-5 md:px-12 py-10 max-w-[1400px] mx-auto">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-green-900">Explore Sri Lanka
        </h2>
       
      </div>

      {/* Buttons Row */}
      <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Object.keys(placesData).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-full font-semibold transition-all ${
              category === cat
                ? "bg-green-900 text-white border-2 border-green-700"
                : "bg-white text-green-900 border border-gray-300"
            }`}
          >
            <img
              src={categoryImages[cat]}
              alt={cat}
              className="w-8 h-8 rounded-full object-cover"
            />
            {cat}
          </button>
        ))}
      </div>

      {/* Map */}
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={7}
        className="w-full h-[500px] mt-5 rounded-2xl border-4 border-green-700 shadow-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {placesData[category].map((place, idx) => (
          <Marker key={idx} position={[place.lat, place.lng]}>
            <Popup>📍 {place.name}</Popup>
            <Tooltip permanent direction="top" offset={[0, -10]}>
              {place.name}
            </Tooltip>
          </Marker>
        ))}

        <FitBounds places={placesData[category]} />
      </MapContainer>
    </div>
  );
}

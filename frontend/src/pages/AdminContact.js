import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker icon
const officeIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Draggable marker
function DraggableMarker({ position, setPosition }) {
  const [markerPos, setMarkerPos] = useState(position);

  useEffect(() => {
    setMarkerPos(position);
  }, [position]);

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPos([lat, lng]);
    setPosition([lat, lng]);
  };

  if (!markerPos) return null;
  return (
    <Marker
      draggable
      position={markerPos}
      eventHandlers={{ dragend: handleDragEnd }}
      icon={officeIcon}
    />
  );
}

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Geocoding with OpenStreetMap
const geocodeAddress = async (address, setCoordsCallback) => {
  if (!address) return;
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: address, format: "json" },
    });
    if (res.data && res.data.length > 0) {
      const { lat, lon } = res.data[0];
      setCoordsCallback([parseFloat(lat), parseFloat(lon)]);
    }
  } catch (err) {
    console.error("Geocoding failed", err);
  }
};

export default function AdminContact() {
  const [contactInfo, setContactInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [, setIsMobile] = useState(window.innerWidth <= 768);

  const showPopup = (message, type = "success") => {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => setPopup(""), 3000);
  };

  const fetchContact = useCallback(async () => {
    try {
      const res = await axios.get("/api/contact");
      const data = res.data;
      setContactInfo({
        ...data,
        corporateCoords: data.corporateCoords || [7.0010, 79.9150],
        regionalCoords: data.regionalCoords || [7.2907, 80.6330],
      });
    } catch (err) {
      console.error(err);
      showPopup("Failed to fetch contact info", "error");
    }
  }, []);

  useEffect(() => {
    fetchContact();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setContactInfo((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleAddressChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const debouncedCorporate = useDebounce(contactInfo?.corporateOffice, 500);
  const debouncedRegional = useDebounce(contactInfo?.regionalOffice, 500);

  useEffect(() => {
    if (!editing) return;
    if (debouncedCorporate) {
      geocodeAddress(debouncedCorporate, (coords) =>
        setContactInfo((prev) => ({ ...prev, corporateCoords: coords }))
      );
    }
  }, [debouncedCorporate, editing]);

  useEffect(() => {
    if (!editing) return;
    if (debouncedRegional) {
      geocodeAddress(debouncedRegional, (coords) =>
        setContactInfo((prev) => ({ ...prev, regionalCoords: coords }))
      );
    }
  }, [debouncedRegional, editing]);

  const handleSave = async () => {
    try {
      await axios.post("/api/contact", contactInfo);
      showPopup("Contact Information Saved Successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      showPopup("Failed to save contact info", "error");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset to default values?"))
      return;
    try {
      const res = await axios.post("/api/contact/reset");
      setContactInfo(res.data.contact);
      showPopup("Contact Information Reset Successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      showPopup("Failed to reset contact info", "error");
    }
  };

  if (!contactInfo) return <div>Loading...</div>;

  return (
    <div className="max-w-[1500px] mx-auto my-5 p-8 bg-gradient-to-br from-green-100 to-green-500 rounded-2xl shadow-md">
      <h3 className="text-center text-green-900 font-extrabold text-3xl sm:text-4xl mb-10">
        Admin Contact Management
      </h3>

      <div className="bg-green-50 rounded-xl p-6 shadow-md border border-green-200">
        {/* Phone */}
        <div className="mb-5">
          <label className="block font-semibold text-green-900 mb-2">Phone:</label>
          <input
            name="phone"
            value={contactInfo.phone}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block font-semibold text-green-900 mb-2">Email:</label>
          <input
            name="email"
            value={contactInfo.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
          />
        </div>

        {/* Corporate Office */}
        <div className="mb-5">
          <label className="block font-semibold text-green-900 mb-2">
            Corporate Office:
          </label>
          <textarea
            name="corporateOffice"
            value={contactInfo.corporateOffice}
            onChange={(e) =>
              handleAddressChange("corporateOffice", e.target.value)
            }
            disabled={!editing}
            rows={3}
            className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
          />
        </div>

        {/* Regional Office */}
        <div className="mb-5">
          <label className="block font-semibold text-green-900 mb-2">
            Regional Office:
          </label>
          <textarea
            name="regionalOffice"
            value={contactInfo.regionalOffice}
            onChange={(e) =>
              handleAddressChange("regionalOffice", e.target.value)
            }
            disabled={!editing}
            rows={3}
            className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
          />
        </div>

        {/* Social Media */}
        <fieldset className="border border-green-300 rounded-lg p-4 mb-6">
          <legend className="font-semibold text-green-800 px-2">
            Social Media Links
          </legend>
          {Object.entries(contactInfo.socialMedia).map(([platform, url]) => (
            <div key={platform} className="mb-3">
              <label className="block font-semibold text-green-900 mb-2">
                {platform} URL:
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => handleSocialChange(platform, e.target.value)}
                disabled={!editing}
                className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
              />
            </div>
          ))}
        </fieldset>

        {/* Coordinates */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-green-900 mb-2">
              Corporate Latitude:
            </label>
            <input
              type="number"
              value={contactInfo.corporateCoords[0]}
              onChange={(e) =>
                setContactInfo((prev) => ({
                  ...prev,
                  corporateCoords: [
                    parseFloat(e.target.value),
                    prev.corporateCoords[1],
                  ],
                }))
              }
              disabled={!editing}
              className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-semibold text-green-900 mb-2">
              Corporate Longitude:
            </label>
            <input
              type="number"
              value={contactInfo.corporateCoords[1]}
              onChange={(e) =>
                setContactInfo((prev) => ({
                  ...prev,
                  corporateCoords: [
                    prev.corporateCoords[0],
                    parseFloat(e.target.value),
                  ],
                }))
              }
              disabled={!editing}
              className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          <div>
            <label className="block font-semibold text-green-900 mb-2">
              Regional Latitude:
            </label>
            <input
              type="number"
              value={contactInfo.regionalCoords[0]}
              onChange={(e) =>
                setContactInfo((prev) => ({
                  ...prev,
                  regionalCoords: [
                    parseFloat(e.target.value),
                    prev.regionalCoords[1],
                  ],
                }))
              }
              disabled={!editing}
              className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-semibold text-green-900 mb-2">
              Regional Longitude:
            </label>
            <input
              type="number"
              value={contactInfo.regionalCoords[1]}
              onChange={(e) =>
                setContactInfo((prev) => ({
                  ...prev,
                  regionalCoords: [
                    prev.regionalCoords[0],
                    parseFloat(e.target.value),
                  ],
                }))
              }
              disabled={!editing}
              className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Map */}
        {contactInfo.corporateCoords && contactInfo.regionalCoords && (
          <div className="h-[400px] mt-6 border-2 border-green-300 rounded-xl overflow-hidden">
            <MapContainer
              center={contactInfo.regionalCoords}
              zoom={8}
              className="w-full h-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <DraggableMarker
                position={contactInfo.corporateCoords}
                setPosition={(pos) =>
                  setContactInfo((prev) => ({
                    ...prev,
                    corporateCoords: pos,
                  }))
                }
              />
              <DraggableMarker
                position={contactInfo.regionalCoords}
                setPosition={(pos) =>
                  setContactInfo((prev) => ({
                    ...prev,
                    regionalCoords: pos,
                  }))
                }
              />
            </MapContainer>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mt-8">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={handleReset}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition"
              >
                Reset
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Popup */}
      {popup && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg font-semibold text-white ${
            popupType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup}
        </div>
      )}
    </div>
  );
}

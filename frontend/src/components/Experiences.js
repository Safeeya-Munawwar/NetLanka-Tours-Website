import React from "react";
const experiences = [
  {
    id: 1,
    title: "Surfing",
    image: "/images/surfing.jpg",
  },
  {
    id: 2,
    title: "Hiking",
    image: "/images/whale-watching.jpg",
  },
  {
    id: 3,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 4,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 5,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 6,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 7,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 8,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 9,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 10,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 11,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
  {
    id: 12,
    title: "Boat rides",
    image: "/images/boat-rides.jpg",
  },
];

const Experiences = () => {
  return (
    <section className=" bg-white">
      {/* Title section */}
      <div className="text-center mb-12 relative">
        <img
          src="/images/adam.PNG"
          alt="Ella"
          className="w-full h-[500px] rounded-lg"
        />
        <h2 className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold font-serif text-white bg-black/40">
          Experiences
        </h2>
      </div>

      {/* Experience Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 py-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-[#eaeff7] p-3 shadow-lg rounded-md border-4 border-[#d4e6f3] hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white shadow-inner rounded-sm p-2">
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-56 object-cover rounded-sm"
              />
            </div>
            <div className="text-center py-4">
              <h3 className="text-lg md:text-xl font-bold text-[#1a457a] font-serif">
                {exp.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experiences;

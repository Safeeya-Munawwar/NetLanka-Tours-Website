import React, { useEffect, useState, useRef } from "react";
import { FaGlobe, FaUserFriends, FaMapMarkedAlt } from "react-icons/fa";

const StatCard = ({ stats = [] }) => {
  return (
    <div className="w-full flex flex-wrap justify-center gap-4">
      {stats.length > 0 ? (
        stats.map((stat, i) => (
          <SingleStat
            key={i}
            stat={{
              ...stat,
              icon:
                stat.icon ||
                [<FaGlobe />, <FaUserFriends />, <FaMapMarkedAlt />][i % 3],
            }}
          />
        ))
      ) : (
        <p className="text-center text-gray-300 w-full">No stats available</p>
      )}
    </div>
  );
};

const SingleStat = ({ stat }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const startCount = () => {
      const end = parseInt(stat.number, 10) || 0;
      const duration = 2000;
      const stepTime = 16;
      let current = 0;
      const increment = end / (duration / stepTime);

      const counter = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startCount();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [hasAnimated, stat.number]);

  return (
    <div
      ref={ref}
      className="w-full sm:w-80 md:w-96 p-6 rounded-xl bg-black/70 backdrop-blur-md text-center border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/20 cursor-default"
    >
      <div className="text-4xl text-green-500 mb-3 flex justify-center">
        {stat.icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{count.toLocaleString()}</div>
      <p className="text-white/80 font-medium text-lg">{stat.label}</p>
    </div>
  );
};

export default StatCard;

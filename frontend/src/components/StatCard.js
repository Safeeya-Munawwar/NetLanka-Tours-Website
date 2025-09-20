import React, { useEffect, useState, useRef } from "react";

const StatCard = ({ stats = [] }) => {
  const darkGrayGradients = [
    "from-gray-600/70 to-gray-700/80",
    "from-gray-500/70 to-gray-600/80",
    "from-gray-700/70 to-gray-800/80",
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {stats.length > 0 ? (
          stats.map((stat, i) => (
            <AnimatedStat
              key={i}
              stat={stat}
              gradient={darkGrayGradients[i % darkGrayGradients.length]}
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-white">No stats available</p>
        )}
      </div>
    </div>
  );
};

const AnimatedStat = ({ stat, gradient }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const startCount = () => {
      const end = parseInt(stat.number, 10) || 0;
      const duration = 2000;
      const stepTime = 16; // ~60fps
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
            startCount(); // ✅ call it here
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(node);

    return () => observer.unobserve(node);
  }, [hasAnimated, stat.number]); // ✅ no ESLint warning

  return (
    <div
      ref={ref}
      className={`w-full max-w-[320px] p-6 rounded-xl shadow-lg text-center
                  bg-gradient-to-br ${gradient}
                  backdrop-blur-md border border-white/20
                  transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
    >
      <div className="text-3xl md:text-4xl font-bold text-white flex justify-center items-center gap-2 mb-2 drop-shadow-lg">
        {stat.icon || "⭐"} {count.toLocaleString()}
      </div>
      <p className="text-white font-semibold text-lg md:text-xl m-0 drop-shadow-md">
        {stat.label}
      </p>
    </div>
  );
};

export default StatCard;

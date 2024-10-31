"use client";

import { useEffect, useState } from "react";

const counters = [
  { title: "Total Martyrs", count: 1500, color: "bg-red-300", textColor: "text-gray-800" }, // Lighter Red
  { title: "Listed Martyrs", count: 650, color: "bg-purple-300", textColor: "text-gray-800" }, // Lighter Purple
  { title: "Total Injured", count: 33000, color: "bg-yellow-200", textColor: "text-gray-800" }, // Lighter Yellow
  { title: "Verified Injured", count: 10000, color: "bg-blue-300", textColor: "text-gray-800" }, // Lighter Blue
];




const CounterCard: React.FC<{ title: string; count: number; color: string; textColor: string }> = ({
  title,
  count,
  color,
  textColor,
}) => {
  const [currentCount, setCurrentCount] = useState<number>(0);

  // Counter animation effect
  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(count / 100);
    const timer = setInterval(() => {
      start += increment;
      if (start >= count) {
        setCurrentCount(count);
        clearInterval(timer);
      } else {
        setCurrentCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg ${color} w-full h-48`}
    >
      <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>{title.toUpperCase()}</h3>
      <p className={`text-5xl font-extrabold ${textColor}`}>{currentCount.toLocaleString()}+</p>
    </div>
  );
};

const Counter: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {counters.map((counter, index) => (
          <CounterCard
            key={index}
            title={counter.title}
            count={counter.count}
            color={counter.color}
            textColor={counter.textColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Counter;

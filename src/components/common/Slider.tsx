"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const slides = [
  {
    src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/slider1.jpg`,
    alt: "Slide 1",
    title: "Long Live The Revolution!",
    subtitle: "Remembering All The Heroes of July",
  },
  {
    src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/1.webp`,
    alt: "Slide 2",
    title: "Long Live The Resistance!",
    subtitle: "Honoring the sacrifice of all the heroes of July",
  },
  {
    src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/slider2.jpg`,
    alt: "Slide 3",
    title: "Heroes Never Die!",
    subtitle: "Remembering their legacy, Inspiring our future.",
  },
];

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasTrackedVisitor = useRef(false); // To prevent multiple tracking

  // Automatically change the slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Track visitor function
  const trackVisitor = async () => {
    try {
      // Fetch the public IP address
      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      // Send visitor data to the backend for processing
      await fetch("/api/track-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });
    } catch (error) {
      console.error("Error tracking visitor:", error);
    }
  };

  // Track visitor on initial render
  useEffect(() => {
    if (!hasTrackedVisitor.current) {
      hasTrackedVisitor.current = true; // Mark as tracked
      trackVisitor();
    }
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[550px]">
      {/* Image Slider */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill={true}
            style={{ objectFit: "cover" }}
            priority={true}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Black Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Centered Text and Button Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          {slides[currentIndex].title}
        </h1>
        <p className="text-white text-lg md:text-xl mb-6">
          {slides[currentIndex].subtitle}
        </p>
        <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Slider;

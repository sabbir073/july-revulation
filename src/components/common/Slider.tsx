"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
    { src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/1.webp`, alt: "Slide 1" },
    { src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/2.jpg`, alt: "Slide 2" },
    { src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/3.jpg`, alt: "Slide 3" },
  ];

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change the slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px]">
      {/* Image Slider */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            priority={true}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Black Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Centered Text and Button Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          Heroes Never Dies!
        </h1>
        <p className="text-white text-lg md:text-xl mb-6">
          Enjoy seamless transitions with stunning visuals.
        </p>
        <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Slider;

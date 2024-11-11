"use client";

import Image from "next/image";

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] my-16 px-4">
      {/* Background Image */}
      <Image
        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/bannerBg.png`} // Replace with your actual image URL
        alt="Hero Background"
        fill={true}
        style={{objectFit: "cover"}}
        className="object-cover"
        priority={true}
      />

      {/* Red Overlay */}
      <div className="absolute inset-0 bg-red-500 opacity-50"></div>

      {/* Quote Text */}
      <div className="relative flex flex-col justify-center items-center text-center h-full">
        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-snug">
          The sacrifice of today<br />
          Will shape our future<br />
          And echo through eternity.
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;

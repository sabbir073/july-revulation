"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Sample Data for Cards
const cards = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  occupation: i % 2 === 0 ? "Student" : "Job Holder",
  location: i % 3 === 0 ? "Dhaka" : "Chittagong",
  age: Math.floor(Math.random() * 80) + 1,
  date: "16th July, 2024",
  image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/abu-sayed.jpg`,
}));

const Filters: React.FC = () => {
  const [age, setAge] = useState(40);
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 sticky top-20">
      <h2 className="text-2xl font-bold mb-6">Filters</h2>

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-lg">Age</label>
        <input
          type="range"
          min={1}
          max={80}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full accent-red-500"
        />
        <p className="mt-2 text-sm text-gray-600">Selected: {age} years</p>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-lg">Occupation</label>
        <select
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All</option>
          <option value="Student">Student</option>
          <option value="Job Holder">Job Holder</option>
          <option value="Doctor">Doctor</option>
          <option value="Labour">Labour</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-lg">Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All</option>
          <option value="Dhaka">Dhaka</option>
          <option value="Chittagong">Chittagong</option>
          <option value="Rajshahi">Rajshahi</option>
          <option value="Rangpur">Rangpur</option>
        </select>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Card: React.FC<{ person: any }> = ({ person }) => (
  <Link href={`/person/${person.id}`} className="hover:shadow-xl transition-shadow">
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-hidden">
        <Image
          src={person.image}
          alt={person.name}
          width={400}
          height={300}
          className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1 hover:text-red-500">{person.name}</h3>
        <p className="text-sm text-gray-600 mb-1">Occupation: {person.occupation}</p>
        <p className="text-sm text-gray-600 mb-1">Location: {person.location}</p>
        <p className="text-sm text-gray-600">Date: {person.date}</p>
      </div>
    </div>
  </Link>
);

const ListWithFilters: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Title and Search Box */}
      <div className="sticky top-0 bg-white z-10 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center md:text-left">
            List of <span className="text-red-500">Our Heroes</span> in the Movement
          </h1>

          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name or any other details"
              className="w-full px-4 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.35-1.35l4.35 4.35z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Filters and Cards */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4">
          <Filters />
        </div>

        {/* Cards Section */}
        <div className="w-full md:w-3/4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((person) => (
            <Card key={person.id} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListWithFilters;

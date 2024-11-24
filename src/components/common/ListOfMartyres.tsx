"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Person {
  id: number;
  name: string;
  occupation: { title: string } | null;
  institution: { title: string } | null;
  incident_location: { title: string } | null;
  age: number | null;
  date: string | null;
  date_of_death: string | null;
  gender: string | null;
  profile_picture: string | null;
}

const Filters: React.FC<{
  age: number;
  setAge: React.Dispatch<React.SetStateAction<number>>;
  occupation: string;
  setOccupation: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  institution: string;
  setInstitution: React.Dispatch<React.SetStateAction<string>>;
  options: {
    occupations: string[];
    locations: string[];
    institutions: string[];
  };
}> = ({
  age,
  setAge,
  occupation,
  setOccupation,
  gender,
  setGender,
  location,
  setLocation,
  institution,
  setInstitution,
  options,
}) => (
  <div className="w-full bg-white rounded-lg shadow-lg p-6 sticky top-20">
    <h2 className="text-2xl font-bold text-white bg-red-600 py-2 text-center mb-6">Filters</h2>

    <div className="mb-4">
      <label className="block mb-2 font-semibold text-sm">Age</label>
      <input
        type="range"
        min={1}
        max={100}
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        className="w-full accent-red-500"
      />
      <p className="mt-2 text-sm text-gray-600">Selected: {age} years</p>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold text-sm">Occupation</label>
      <select
        value={occupation}
        onChange={(e) => setOccupation(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">All</option>
        {options.occupations.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold text-sm">Gender</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">All</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="THIRD GENDER">Third Gender</option>
      </select>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold text-sm">Location</label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">All</option>
        {options.locations.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>

    <div className="mb-4">
      <label className="block mb-2 font-semibold text-sm">Institution</label>
      <select
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">All</option>
        {options.institutions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const Card: React.FC<{ person: Person }> = ({ person }) => (
  <Link href={`/list/${person.id}`} className="hover:shadow-xl transition-shadow h-full">
    <div className="bg-white shadow-md rounded-lg h-full flex flex-col">
      <div className="overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${person.profile_picture || "placeholder.png"}`}
          alt={person.name}
          width={400}
          height={300}
          className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-sm font-bold mb-1 hover:text-red-500">
          {person.name
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          <strong className="font-semibold">Occupation:</strong> {person.occupation?.title || "N/A"}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong className="font-semibold">Type:</strong>{"Martyr"}
        </p>
      </div>
    </div>
  </Link>
);

const ListOfMartyres: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [age, setAge] = useState(100);
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [incidentType, setIncidentType] = useState("MARTYR");
  const [location, setLocation] = useState("");
  const [institution, setInstitution] = useState("");
  const [options, setOptions] = useState({
    occupations: [],
    locations: [],
    institutions: [],
  });
  const [skip, setSkip] = useState(0);
  const take = 12;

  const fetchOptions = async () => {
    try {
      const [occupationsRes, locationsRes, institutionsRes] = await Promise.all([
        fetch("/api/occupations"),
        fetch("/api/incident-locations"),
        fetch("/api/institutions"),
      ]);

      const [occupationsData, locationsData, institutionsData] = await Promise.all([
        occupationsRes.json(),
        locationsRes.json(),
        institutionsRes.json(),
      ]);

      setOptions({
        occupations: occupationsData.map((item: { title: string }) => item.title),
        locations: locationsData.map((item: { title: string }) => item.title),
        institutions: institutionsData.map((item: { title: string }) => item.title),
      });
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchPeople = async (reset: boolean = false) => {
    setLoading(reset);
    setLoadingMore(!reset);
    try {
      const queryParams = new URLSearchParams({
        search,
        age: age.toString(),
        occupation,
        gender,
        incidentType,
        location,
        institution,
        skip: reset ? "0" : skip.toString(),
        take: take.toString(),
      });
      const response = await fetch(`/api/public/lists?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setPeople(reset ? data.people : [...people, ...data.people]);
        setTotalCount(data.totalCount);
        if (reset) setSkip(take); // Reset skip for new data
      } else {
        console.error("Error fetching people data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching people data:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const delayFetch = setTimeout(() => fetchPeople(true), 300);
    fetchOptions();
    
    return () => clearTimeout(delayFetch);
  }, [search, age, occupation, gender, incidentType, location, institution]);

  const handleLoadMore = () => {
    setSkip((prev) => prev + take);
    fetchPeople();
};

  return (
    <div id="cards-container" className="container mx-auto px-4 py-12">
      <div className="sticky top-0 bg-white z-10 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center md:text-left">
            List of <span className="text-red-500">OUR MARTYR</span> in the Movement
          </h1>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name or any other details"
              className="w-full px-4 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Filters
            age={age}
            setAge={setAge}
            occupation={occupation}
            setOccupation={setOccupation}
            gender={gender}
            setGender={setGender}
            location={location}
            setLocation={setLocation}
            institution={institution}
            setInstitution={setInstitution}
            options={options}
          />
        </div>

        <div className="w-full md:w-3/4 relative">
          {!loading && (
            <p className="mb-4 text-lg text-gray-600">
              We have found total <strong>{totalCount}</strong> records.
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="loader border-t-red-500 border-4 rounded-full w-8 h-8 animate-spin"></div>
            </div>
            ) : people.length > 0 ? (
              people.map((person) => <Card key={person.id} person={person} />)
            ) : (
              <p>No results found.</p>
            )}
          </div>

          {!loading && !loadingMore && people.length < totalCount && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Load More
                </button>
              </div>
            )}

          {loadingMore && (
            <div className="mt-6 flex justify-center">
              <div className="loader border-t-red-500 border-4 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListOfMartyres;

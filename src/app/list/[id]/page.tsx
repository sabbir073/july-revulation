"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import HomeLayout from "@/components/layouts/HomeLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ReactPlayer from "react-player";

interface Person {
  name: string;
  age: number | null;
  occupation: { title: string } | null;
  institution: { title: string } | null;
  date: string | null;
  date_of_death: string | null;
  story: string | null;
  profile_picture: string | null;
  gallery: string[];
  incident_location: { title: string } | null;
  incident_type: string;
  gender: string;
  documentary: string | null;
}

export default function PersonProfile() {
  const router = useRouter();
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchPersonData = useCallback(async () => {
    try {
      const response = await fetch(`/api/public/lists/${id}`);
      const data = await response.json();
      if (data.success) {
        setPerson(data.person);
      } else {
        router.push("/not-found");
      }
    } catch (error) {
      console.error("Error fetching person data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd MMM yyyy");

  if (loading) return <LoadingSpinner />;

  const imageUrl = person?.profile_picture
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${person.profile_picture}`
    : `${process.env.NEXT_PUBLIC_IMAGE_URL}/placeholder.png`;

  const galleryImages =
    person?.gallery?.map((img) => ({
      src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`,
    })) || [];

  return (
    <HomeLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-center text-xl font-bold my-6 py-6 text-red-600 bg-[#e2e8f0]">
          DETAILS ABOUT {person?.name.toUpperCase()}
        </h1>
      </div>
      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6 h-auto lg:sticky lg:top-6 lg:self-start">
          <Image
            src={imageUrl}
            alt={person?.name || "Profile Image"}
            width={250}
            height={250}
            className="w-[250px] h-[250px] object-cover rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-center mb-4">{person?.name}</h2>

          <div className="w-full border border-gray-200 rounded-lg overflow-hidden text-lg">
            <div className="grid grid-cols-6">
              <div className="bg-red-200 p-2 font-semibold col-span-3">Age:</div>
              <div className="bg-gray-50 p-2 col-span-3">{person?.age || "N/A"}</div>

              <div className="bg-sky-100 p-2 font-semibold col-span-3">Gender:</div>
              <div className="bg-gray-50 p-2 col-span-3">{person?.gender || "N/A"}</div>

              <div className="bg-blue-200 p-2 font-semibold col-span-3">Occupation:</div>
              <div className="bg-gray-50 p-2 col-span-3">
                {person?.occupation?.title || "N/A"}
              </div>

              <div className="bg-purple-200 p-2 font-semibold col-span-3">Institution:</div>
              <div className="bg-gray-50 p-2 col-span-3">
                {person?.institution?.title || "N/A"}
              </div>

              <div className="bg-yellow-200 p-2 font-semibold col-span-3">Type:</div>
              <div className="bg-gray-50 p-2 col-span-3 text-red-500">
                {person?.incident_type === "DEATH"
                  ? "MARTYR"
                  : person?.incident_type === "INJURED"
                  ? "INJURED"
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Cards */}
        <div className="lg:col-span-2 space-y-4 text-lg">
          {/* Individual Cards */}
          {person?.date && (
            <div className="bg-[#fecaca] p-4 rounded shadow-lg flex">
              <div className="w-[200px] font-semibold text-left">Date of Incident:</div>
              <div className="flex-1 text-left">{formatDate(person.date)}</div>
            </div>
          )}
          {person?.date_of_death && (
            <div className="bg-[#d1d5db] p-4 rounded shadow-lg flex">
              <div className="w-[200px] font-semibold text-left">Date of Death:</div>
              <div className="flex-1 text-left">{formatDate(person.date_of_death)}</div>
            </div>
          )}
          {person?.incident_location?.title && (
            <div className="bg-[#cffafe] p-4 rounded shadow-lg flex">
              <div className="w-[200px] font-semibold text-left">Incident Location:</div>
              <div className="flex-1 text-left">{person.incident_location.title}</div>
            </div>
          )}
          {person?.story && (
            <div className="bg-gray-300 p-4 rounded shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Story:</h3>
              <p className="text-base text-lg">{person.story}</p>
            </div>
          )}
          {person?.gallery && person.gallery.length > 0 && (
            <div className="bg-gray-100 p-4 rounded shadow-lg">
              <strong className="text-lg font-bold">Gallery:</strong>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {person.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setLightboxOpen(true);
                    }}
                    className="p-2"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`}
                      alt={`Gallery Image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-[300px] h-[150px] object-cover rounded-[10px] border border-red-600"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {lightboxOpen && (
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={galleryImages}
              index={currentImageIndex}
              on={{
                click: ({ index }) => {
                  if (typeof index === "number") {
                    setCurrentImageIndex(index);
                  }
                },
              }}
            />
          )}
          {person?.documentary && (
            <div className="bg-gray-100 p-4 rounded shadow-lg">
              <strong className="text-lg font-bold">Documentary:</strong>
              <div className="mt-4">
                <ReactPlayer
                  url={convertToEmbedUrl(person.documentary)}
                  width="100%"
                  height="315px"
                  controls={true} // Adds play/pause controls
                  playing={false} // Prevent auto-play
                  className="rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

// Utility function to ensure the URL is embeddable
function convertToEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v"); // Extract the `v` query parameter
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url; // Return original URL if parsing fails
  }
}

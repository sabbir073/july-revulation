"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ReactPlayer from "react-player";

interface Person {
    id: number;
    name: string;
    age: number | null;
    occupation: { title: string } | null;
    institution: { title: string } | null;
    address: string | null;
    fathers_name: string | null;
    mothers_name: string | null;
    date: string | null;
    date_of_death: string | null;
    story: string | null;
    family_member_contact: string | null;
    profile_picture: string | null;
    gallery: string[];
    incident_location: { title: string } | null;
    incident_type: string;
    gender: string;
    status: string;
    documentary: string | null;
    submitted_by: { name: string };
    updated_by: { name: string } | null;
    created_at: string;
    updated_at: string;
}

export default function PersonProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = useParams();
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        } else if (status === "authenticated" && session?.user.role === "ADMIN") {
            fetchPersonData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, router, session]);

    const fetchPersonData = async () => {
        try {
            const response = await fetch(`/api/people/${id}`);
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
    };

    
    const formatDateTop = (dateString: string) =>
        format(new Date(dateString), "dd MMM yyyy");

    const formatDate = (dateString: string) =>
        format(new Date(dateString), "dd MMM yyyy  hh:mm a");

    if (status === "loading" || loading) return <LoadingSpinner />;
    if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

    const imageUrl = person?.profile_picture
        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${person.profile_picture}`
        : `${process.env.NEXT_PUBLIC_IMAGE_URL}/placeholder.png`;

    const galleryImages =
        person?.gallery?.map((img) => ({
            src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`,
        })) || [];

    return (
        <DashboardLayout>
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
                            <div className="bg-gray-50 p-2 col-span-3">{person?.occupation?.title || "N/A"}</div>

                            <div className="bg-purple-200 p-2 font-semibold col-span-3">Institution:</div>
                            <div className="bg-gray-50 p-2 col-span-3">{person?.institution?.title || "N/A"}</div>

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
                            <div className="flex-1 text-left">{formatDateTop(person.date)}</div>
                        </div>
                    )}
                    {person?.date_of_death && (
                        <div className="bg-[#d1d5db] p-4 rounded shadow-lg flex">
                            <div className="w-[200px] font-semibold text-left">Date of Death:</div>
                            <div className="flex-1 text-left">{formatDateTop(person.date_of_death)}</div>
                        </div>
                    )}
                    {person?.fathers_name && (
                        <div className="bg-[#fde68a] p-4 rounded shadow-lg flex">
                            <div className="w-[200px] font-semibold text-left">Fathers Name:</div>
                            <div className="flex-1 text-left">{person.fathers_name}</div>
                        </div>
                    )}
                    {person?.mothers_name && (
                        <div className="bg-[#bbf7d0] p-4 rounded shadow-lg flex">
                            <div className="w-[200px] font-semibold text-left">Mothers Name:</div>
                            <div className="flex-1 text-left">{person.mothers_name}</div>
                        </div>
                    )}
                    {person?.address && (
                        <div className="bg-[#d9f99d] p-4 rounded shadow-lg flex">
                            <div className="w-[200px] font-semibold text-left">Address:</div>
                            <div className="flex-1 text-left">{person.address}</div>
                        </div>
                    )}
                    {person?.family_member_contact && (
                        <div className="bg-[#e9d5ff] p-4 rounded shadow-lg flex">
                            <div className="w-[200px] font-semibold text-left">Family Contact:</div>
                            <div className="flex-1 text-left">{person.family_member_contact}</div>
                        </div>
                    )}
                    {person?.incident_location?.title && (
                        <div className="bg-[#cffafe] p-4 rounded shadow-lg flex">
                            <div className="w-[200px] font-semibold text-left">Incident Location:</div>
                            <div className="flex-1 text-left">{person.incident_location.title}</div>
                        </div>
                    )}
                    {person?.status && (
                        <div className="bg-[#ede9fe] p-4 rounded shadow-lg flex">
                            <div className="w-[200px] font-semibold text-left">Status:</div>
                            <div className="flex-1 text-left">{person.status}</div>
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

                    {/* Cards for Created, Updated, Submitted By */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-100 p-4 rounded shadow-lg text-base">
                            <h3 className="font-semibold">Submitted At</h3>
                            <p>{formatDate(person?.created_at || "")}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded shadow-lg text-base">
                            <h3 className="font-semibold">Last Update</h3>
                            <p>{formatDate(person?.updated_at || "")}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded shadow-lg text-base">
                            <h3 className="font-semibold">Submitted By</h3>
                            <p>{person?.submitted_by.name}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded shadow-lg text-base">
                            <h3 className="font-semibold">Updated By</h3>
                            <p>{person?.updated_by?.name || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Utility function to convert YouTube URL to embeddable URL
// Utility function to ensure the URL is embeddable
function convertToEmbedUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get("v"); // Extract the `v` query parameter
        return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
    } catch {
        return url; // Return original URL if parsing fails
    }
}

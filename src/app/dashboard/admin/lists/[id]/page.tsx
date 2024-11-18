"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import Image from "next/image";

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
    how_died: string | null;
    how_injured: string | null;
    story: string | null;
    family_member_contact: string | null;
    profile_picture: string | null;
    gallery: string[];
    incident_location: { title: string } | null;
    incident_type: string;
    status: string;
    documentary: string | null;
    submitted_by: { name: string };
    created_at: string;
    updated_at: string;
}

export default function PersonProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = useParams();
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        } else if (status === "authenticated" && session?.user.role === "ADMIN") {
            fetchPersonData(); // Fetch person data on load
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

    const formatDate = (dateString: string) =>
        format(new Date(dateString), "dd MMM yyyy");

    if (status === "loading" || loading) return <LoadingSpinner />;
    if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

    const imageUrl = person?.profile_picture 
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${person.profile_picture}`
    : `${process.env.NEXT_PUBLIC_IMAGE_URL}/placeholder.png`;

    return (
        <DashboardLayout>
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6 h-auto sticky top-6 self-start">
            {person?.profile_picture && (
                <Image
                    src={imageUrl}
                    alt={person.name || "Profile Image"}
                    width={300}
                    height={300}
                    className="w-full max-w-xs mx-auto rounded-full mb-4"
                />
            )}
            <h2 className="text-xl font-bold text-center mb-4">{person?.name}</h2>

            <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-5">
                    <div className="bg-red-100 p-2 font-semibold col-span-2">Age:</div>
                    <div className="bg-gray-50 p-2 col-span-3">{person?.age || "N/A"}</div>

                    <div className="bg-blue-100 p-2 font-semibold col-span-2">Occupation:</div>
                    <div className="bg-gray-50 p-2 col-span-3">{person?.occupation?.title || "N/A"}</div>

                    <div className="bg-purple-100 p-2 font-semibold col-span-2">Institution:</div>
                    <div className="bg-gray-50 p-2 col-span-3">{person?.institution?.title || "N/A"}</div>

                    <div className="bg-yellow-100 p-2 font-semibold col-span-2">Incident Type:</div>
                    <div className="bg-gray-50 p-2 col-span-3">{person?.incident_type || "N/A"}</div>
                </div>
            </div>
        </div>

        {/* Right Detail Cards */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Date of Incident:</strong> <br />
                    {person?.date ? formatDate(person.date) : "N/A"}
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Fathers Name:</strong> <br />
                    {person?.fathers_name || "N/A"}
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Mothers Name:</strong> <br />
                    {person?.mothers_name || "N/A"}
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Address:</strong> <br />
                    {person?.address || "N/A"}
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {person?.how_died && (
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <strong>How Died:</strong> <br />
                        {person.how_died}
                    </div>
                )}
                {person?.how_injured && (
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <strong>How Injured:</strong> <br />
                        {person.how_injured}
                    </div>
                )}
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Family Contact:</strong> <br />
                    {person?.family_member_contact || "N/A"}
                </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Incident Location:</strong> <br />
                    {person?.incident_location?.title || "N/A"}
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Status:</strong> <br />
                    {person?.status}
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Story:</strong> <br />
                    {person?.story || "N/A"}
                </div>
            </div>

            {/* Gallery */}
            <div className="bg-gray-100 p-4 rounded shadow">
                <strong>Gallery:</strong>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {person?.gallery.map((img, index) => (
                        <Image
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`}
                            alt={`Gallery Image ${index + 1}`}
                            width={150}
                            height={150}
                            className="object-cover rounded"
                        />
                    ))}
                </div>
            </div>

            {/* Documentary */}
            {person?.documentary && (
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Documentary:</strong>
                    <iframe
                        width="100%"
                        height="315"
                        src={person.documentary}
                        title="Documentary Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded"
                    ></iframe>
                </div>
            )}

            {/* Submission Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Created At:</strong> <br />
                    {person?.created_at ? formatDate(person.created_at) : "N/A"}
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Updated At:</strong> <br />
                    {person?.updated_at ? formatDate(person.updated_at) : "N/A"}
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <strong>Submitted By:</strong> <br />
                    {person?.submitted_by.name || "N/A"}
                </div>
            </div>
        </div>
    </div>
</DashboardLayout>

    );
}

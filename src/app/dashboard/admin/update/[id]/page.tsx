// app/dashboard/admin/AdminEditPeople.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import Swal from "sweetalert2";
import Image from "next/image";

const INCIDENT_TYPES = ["DEATH", "INJURED"] as const;
const STATUS_TYPES = ["PENDING", "VERIFIED"] as const;
const GENDER_TYPES = ["MALE", "FEMALE", "THIRD GENDER"] as const;

type IncidentType = typeof INCIDENT_TYPES[number];
type StatusType = typeof STATUS_TYPES[number];
type GenderType = typeof GENDER_TYPES[number];

interface Occupation {
  id: number;
  title: string;
}
interface Institution {
  id: number;
  title: string;
}
interface IncidentLocation {
  id: number;
  title: string;
}

export default function AdminEditPeople() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const personId = params?.id; // Assume the ID is passed in the URL

  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [incidentLocations, setIncidentLocations] = useState<IncidentLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation_id: "",
    institution_id: "",
    address: "",
    fathers_name: "",
    mothers_name: "",
    date: "",
    date_of_death: "",
    gender: "" as GenderType,
    story: "",
    family_member_contact: "",
    profile_picture: null as File | string | null,
    gallery: [] as (File | string)[],
    incident_location_id: "",
    incident_type: "" as IncidentType,
    status: "" as StatusType,
    documentary: "",
  });

  const profilePictureRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);


  useEffect(() => {
    async function fetchData() {
      try {
        const [occupationRes, institutionRes, locationRes, personRes] = await Promise.all([
          fetch("/api/occupations"),
          fetch("/api/institutions"),
          fetch("/api/incident-locations"),
          fetch(`/api/people/${personId}`),
        ]);

        setOccupations(await occupationRes.json());
        setInstitutions(await institutionRes.json());
        setIncidentLocations(await locationRes.json());
        const { person } = await personRes.json();

        setFormData({
            ...person,
            date: person.date ? person.date.split("T")[0] : "", // Extract YYYY-MM-DD
            date_of_death: person.date_of_death ? person.date_of_death.split("T")[0] : "", // Extract YYYY-MM-DD
            profile_picture: person.profile_picture,
            gallery: person.gallery,
          });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to load data", "error");
        setLoading(false);
      }
    }

    fetchData();
  }, [personId]);

  if (status === "loading" || loading) return <LoadingSpinner />;
  if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    if (name === "profile_picture") {
      setFormData((prev) => ({ ...prev, profile_picture: files[0] })); // Replace the profile picture
    } else if (name === "gallery") {
      setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...Array.from(files)] })); // Add new gallery files
    }
  };

  const handleGalleryRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let fileUploadResponse = { success: true, profileName: null, galleryNames: [], message: "" };

    // Upload only new files
    const newGalleryFiles = formData.gallery.filter((file) => file instanceof File) as File[];
    const newProfilePicture = formData.profile_picture instanceof File ? formData.profile_picture : null;

    if (newProfilePicture || newGalleryFiles.length > 0) {
      fileUploadResponse = await uploadFilesToS3({
        profile_picture: newProfilePicture,
        gallery: newGalleryFiles,
      });
      if (!fileUploadResponse.success) {
        Swal.fire("Error", fileUploadResponse.message || "An error occurred during file upload.", "error");
        setSubmitting(false);
        return;
      }
    }

    const submissionData = {
      ...formData,
      profile_picture: fileUploadResponse.profileName || formData.profile_picture,
      gallery: [
        ...formData.gallery.filter((file) => typeof file === "string"), // Keep existing paths
        ...fileUploadResponse.galleryNames, // Add newly uploaded paths
      ],
      updated_by_id: Number(session?.user.id), // User updating the record
    };

    try {
      const response = await fetch(`/api/people/${personId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        Swal.fire("Success", "Data updated successfully!", "success");
        router.push("/dashboard/admin/lists"); // Redirect to the admin dashboard
      } else {
        throw new Error("Failed to update data");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "An error occurred while updating the data.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Edit Person</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form fields */}
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Enter name", required: true },
              { label: "Age", name: "age", type: "number", placeholder: "Enter age" },
              {
                label: "Occupation",
                name: "occupation_id",
                type: "select",
                options: occupations.map((occ) => ({ value: occ.id, label: occ.title })),
              },
              {
                label: "Institution",
                name: "institution_id",
                type: "select",
                options: institutions.map((inst) => ({ value: inst.id, label: inst.title })),
              },
              { label: "Home Address", name: "address", type: "text", placeholder: "Enter address" },
              { label: "Father's Name", name: "fathers_name", type: "text", placeholder: "Father's name" },
              { label: "Mother's Name", name: "mothers_name", type: "text", placeholder: "Mother's name" },
              { label: "Incident Date", name: "date", type: "date" },
              { label: "Date Of Death", name: "date_of_death", type: "date" },
              {
                label: "Gender",
                name: "gender",
                type: "select",
                options: GENDER_TYPES.map((gn) => ({ value: gn, label: gn })),
                required: true,
              },
              { label: "Family Contact", name: "family_member_contact", type: "text", placeholder: "Family contact" },
              {
                label: "Incident Location",
                name: "incident_location_id",
                type: "select",
                options: incidentLocations.map((loc) => ({ value: loc.id, label: loc.title })),
                required: true,
              },
              {
                label: "Incident Type",
                name: "incident_type",
                type: "select",
                options: INCIDENT_TYPES.map((type) => ({ value: type, label: type })),
                required: true,
              },
              {
                label: "Status",
                name: "status",
                type: "select",
                options: STATUS_TYPES.map((status) => ({ value: status, label: status })),
                required: true,
              },
              { label: "Documentary", name: "documentary", type: "url", placeholder: "URL of documentary" },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name as keyof typeof formData] as string}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full border border-red-200 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData] as string}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full border border-red-200 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                )}
              </div>
            ))}

            {/* Story Textarea */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Story</label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleInputChange}
                placeholder="Enter the story"
                className="w-full border border-red-200 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
              {typeof formData.profile_picture === "string" && (
                <Image
                width={150}
                height={150}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${formData.profile_picture}`}
                alt="Profile Preview"
                className="w-32 h-32 object-cover mb-4"
              />
              )}
              <input
                type="file"
                name="profile_picture"
                ref={profilePictureRef}
                onChange={handleFileChange}
                accept="image/*"
                className="w-full border border-red-200 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Gallery Preview */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Gallery</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {formData.gallery.map((file, index) =>
                  typeof file === "string" ? (
                    <div key={index} className="relative">
                      <Image
                        width={150}
                        height={150}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${file}`}
                        alt={`Gallery Preview ${index}`}
                        className="w-24 h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleGalleryRemove(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ) : null
                )}
              </div>
              <input
                type="file"
                name="gallery"
                ref={galleryRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="w-full border border-red-200 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={`font-semibold rounded-md px-6 py-3 ${
                  submitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                }`}
              >
                {submitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

// S3 upload function remains the same
async function uploadFilesToS3(formData: { profile_picture: File | null; gallery: File[] }) {
  const form = new FormData();

  if (formData.profile_picture) {
    form.append("profile_picture", formData.profile_picture);
  }
  formData.gallery.forEach((file) => form.append("gallery", file));

  const response = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  return response.json();
}
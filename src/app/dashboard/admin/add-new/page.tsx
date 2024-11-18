// app/dashboard/admin/AdminAddNewPeople.tsx

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import Swal from "sweetalert2";

const INCIDENT_TYPES = ["DEATH", "INJURED"] as const;
const STATUS_TYPES = ["PENDING", "VERIFIED"] as const;

type IncidentType = typeof INCIDENT_TYPES[number];
type StatusType = typeof STATUS_TYPES[number];

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

export default function AdminAddNewPeople() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [incidentLocations, setIncidentLocations] = useState<IncidentLocation[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation_id: "",
    institution_id: "",
    address: "",
    fathers_name: "",
    mothers_name: "",
    date: "",
    how_died: "",
    how_injured: "",
    story: "",
    family_member_contact: "",
    profile_picture: null as File | null,
    gallery: [] as File[],
    incident_location_id: "",
    incident_type: "" as IncidentType,
    status: "" as StatusType,
    documentary: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      const [occupationRes, institutionRes, locationRes] = await Promise.all([
        fetch("/api/occupations"),
        fetch("/api/institutions"),
        fetch("/api/incident-locations"),
      ]);

      setOccupations(await occupationRes.json());
      setInstitutions(await institutionRes.json());
      setIncidentLocations(await locationRes.json());
    }

    fetchData();
  }, []);

  if (status === "loading") return <LoadingSpinner />;
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
      setFormData((prev) => ({ ...prev, profile_picture: files[0] }));
    } else if (name === "gallery") {
      setFormData((prev) => ({ ...prev, gallery: Array.from(files) }));
    }
  };

  const handleSubmit = async () => {
    let fileUploadResponse = { success: true, profileName: null, galleryNames: [], message: "" };
  
    // Check if there are files to upload
    if (formData.profile_picture || formData.gallery.length > 0) {
      fileUploadResponse = await uploadFilesToS3(formData);
      if (!fileUploadResponse.success) {
        Swal.fire("Error", fileUploadResponse.message || "An error occurred during file upload.", "error");
        return;
      }
    }
  
    // Prepare submission data
    const submissionData = {
      ...formData,
      profile_picture: fileUploadResponse.profileName, // Will be null if not uploaded
      gallery: fileUploadResponse.galleryNames, // Ensure this is passed as an array of file names
      submitted_by_id: Number(session?.user.id), // Convert submitted_by_id to an integer
    };
  
    try {
      const response = await fetch("/api/people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
  
      if (response.ok) {
        Swal.fire("Success", "Data submitted successfully!", "success");
        // Reset the form data
        setFormData({
          name: "",
          age: "",
          occupation_id: "",
          institution_id: "",
          address: "",
          fathers_name: "",
          mothers_name: "",
          date: "",
          how_died: "",
          how_injured: "",
          story: "",
          family_member_contact: "",
          profile_picture: null,
          gallery: [],
          incident_location_id: "",
          incident_type: "" as IncidentType,
          status: "" as StatusType,
          documentary: "",
        });
      } else {
        throw new Error("Failed to submit data");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "An error occurred while submitting the data.", "error");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Add New Martyrs Or Injured</h2>
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
              { label: "How Died", name: "how_died", type: "text", placeholder: "How died" },
              { label: "How Injured", name: "how_injured", type: "text", placeholder: "How injured" },
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

            {/* Profile Picture */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
              <input
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full border border-red-200 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Gallery (multiple images) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Gallery</label>
              <input
                type="file"
                name="gallery"
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
                className="bg-red-500 text-white font-semibold rounded-md px-6 py-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

// S3 upload function
// Modify the uploadFilesToS3 function to handle empty files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uploadFilesToS3(formData: any) {
  const form = new FormData();

  // Only append files if they exist
  if (formData.profile_picture) {
    form.append("profile_picture", formData.profile_picture);
  }
  if (formData.gallery.length > 0) {
    formData.gallery.forEach((file: File) => form.append("gallery", file)); // Use "gallery" as a single field name
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  return response.json();
}


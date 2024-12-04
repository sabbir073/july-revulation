"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface IncidentLocation {
  id: number;
  title: string;
}

export default function AdminManageIncidentLocations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [incidentLocations, setIncidentLocations] = useState<IncidentLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIncidentLocationTitle, setNewIncidentLocationTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchIncidentLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/incident-locations");
      const incidentLocations = await response.json();
      setIncidentLocations(incidentLocations);
    } catch (error) {
      console.error("Error fetching incident locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncidentLocation = async () => {
    if (!newIncidentLocationTitle.trim()) {
      Swal.fire("Error", "Incident Location title cannot be empty.", "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: newIncidentLocationTitle,
        created_by_id: session?.user.id,
      };

      const response = await fetch("/api/incident-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIncidentLocations((prev) => [...prev, data.incidentLocation]);
        setNewIncidentLocationTitle("");
        Swal.fire("Success", "Incident Location added successfully.", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to add incident location.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while adding incident location.", "error");
      console.error("Error adding incident location:", error);
    } finally {
      setSubmitting(false); // Enable button and reset text
    }
  };


  const handleEditIncidentLocation = async (id: number, currentTitle: string) => {
    const { value: newTitle } = await Swal.fire({
      title: "Edit Incident Location",
      input: "text",
      inputValue: currentTitle,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value.trim()) {
          return "The title cannot be empty.";
        }
      },
    });
  
    if (newTitle) {
      try {
        const response = await fetch(`/api/incident-locations`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, title: newTitle }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          setIncidentLocations((prev) =>
            prev.map((location) =>
              location.id === id ? { ...location, title: newTitle } : location
            )
          );
          Swal.fire("Success", "Incident Location updated successfully.", "success");
        } else {
          Swal.fire("Error", data.message || "Failed to update incident location.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while updating the incident location.", "error");
        console.error("Error updating incident location:", error);
      }
    }
  };
  

  const handleDeleteIncidentLocation = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/incident-locations?id=${id}`, { method: "DELETE" });
        const data = await response.json();

        if (data.success) {
          setIncidentLocations((prev) => prev.filter((incidentLocation) => incidentLocation.id !== id));
          Swal.fire("Deleted!", "The incident location has been deleted.", "success");
        } else {
          Swal.fire("Error", data.message || "Failed to delete incident location.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while deleting the incident location.", "error");
        console.error("Error deleting incident location:", error);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchIncidentLocations();
    }
  }, [status, router, session]);

  if (status === "loading" || loading) return <LoadingSpinner />;
  if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

  const columns = [
    { name: "ID", selector: (row: IncidentLocation) => row.id, sortable: true, grow: 0 },
    { name: "Title", selector: (row: IncidentLocation) => row.title, sortable: true },
    {
      name: "Actions",
      cell: (row: IncidentLocation) => (
        <div className="flex space-x-3 text-lg">
          <FontAwesomeIcon
            icon={faEdit}
            className="text-blue-600 cursor-pointer"
            title="Edit"
            onClick={() => handleEditIncidentLocation(row.id, row.title)}
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-600 cursor-pointer"
            title="Delete"
            onClick={() => handleDeleteIncidentLocation(row.id)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 0,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Incident Location</h2>
          <input
            type="text"
            value={newIncidentLocationTitle}
            onChange={(e) => setNewIncidentLocationTitle(e.target.value)}
            placeholder="Write incident location title"
            className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          <button
            onClick={handleAddIncidentLocation}
            disabled={submitting} // Disable the button while submitting
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Creating..." : "Add Incident Location"}
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Incident Location List</h2>
          <DataTable
            columns={columns}
            data={incidentLocations}
            pagination
            highlightOnHover
            pointerOnHover={false}
            responsive
            striped
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

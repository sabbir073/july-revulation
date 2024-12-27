/* eslint-disable react-hooks/exhaustive-deps */
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

interface Occupation {
  id: number;
  title: string;
}

export default function AdminManageOccupations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOccupationTitle, setNewOccupationTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const fetchOccupations = async () => {
    if (hasFetchedInitialData) return; // Avoid multiple fetches for initial data
    try {
      setLoading(true);
      const response = await fetch("/api/occupations");
      const occupations = await response.json();
      setOccupations(occupations);
      setHasFetchedInitialData(true); // Mark initial data as fetched
    } catch (error) {
      console.error("Error fetching occupations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOccupation = async () => {
    if (!newOccupationTitle.trim()) {
      Swal.fire("Error", "Occupation title cannot be empty.", "error");
      return;
    }
  
    try {
      setSubmitting(true);
      const payload = {
        title: newOccupationTitle,
        created_by_id: session?.user.id,
      };
  
      const response = await fetch("/api/occupations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setOccupations((prev) => [...prev, data.occupation]);
        setNewOccupationTitle("");
        Swal.fire("Success", "Occupation added successfully.", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to add occupation.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while adding occupation.", "error");
      console.error("Error adding occupation:", error);
    } finally {
      setSubmitting(false); // Enable button and reset text
    }
  };

  const handleEditOccupation = async (id: number, currentTitle: string) => {
    const { value: newTitle } = await Swal.fire({
      title: "Edit Occupation",
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
        const response = await fetch(`/api/occupations`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, title: newTitle }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          setOccupations((prev) =>
            prev.map((occupation) =>
              occupation.id === id ? { ...occupation, title: newTitle } : occupation
            )
          );
          Swal.fire("Success", "Occupation updated successfully.", "success");
        } else {
          Swal.fire("Error", data.message || "Failed to update occupation.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while updating the occupation.", "error");
        console.error("Error updating occupation:", error);
      }
    }
  };
  

  const handleDeleteOccupation = async (id: number) => {
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
        const response = await fetch(`/api/occupations?id=${id}`, { method: "DELETE" });
        const data = await response.json();

        if (data.success) {
          setOccupations((prev) => prev.filter((occupation) => occupation.id !== id));
          Swal.fire("Deleted!", "The occupation has been deleted.", "success");
        } else {
          Swal.fire("Error", data.message || "Failed to delete occupation.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while deleting the occupation.", "error");
        console.error("Error deleting occupation:", error);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchOccupations();
    }
  }, [status, router, session]);

  if (status === "loading" || loading) return <LoadingSpinner />;
  if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

  const columns = [
    { name: "ID", selector: (row: Occupation) => row.id, sortable: true, grow: 0 },
    { name: "Title", selector: (row: Occupation) => row.title, sortable: true },
    {
      name: "Actions",
      cell: (row: Occupation) => (
        <div className="flex space-x-3 text-lg">
          <FontAwesomeIcon
            icon={faEdit}
            className="text-blue-600 cursor-pointer"
            title="Edit"
            onClick={() => handleEditOccupation(row.id, row.title)}
          />

          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-600 cursor-pointer"
            title="Delete"
            onClick={() => handleDeleteOccupation(row.id)}
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
          <h2 className="text-xl font-semibold mb-4">Add New Occupation</h2>
          <input
            type="text"
            value={newOccupationTitle}
            onChange={(e) => setNewOccupationTitle(e.target.value)}
            placeholder="Write occupation title"
            className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={handleAddOccupation}
            disabled={submitting} // Disable the button while submitting
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Creating..." : "Add Occupation"}
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Occupation List</h2>
          <DataTable
            columns={columns}
            data={occupations}
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

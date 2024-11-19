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

interface Institution {
  id: number;
  title: string;
}

export default function AdminManageInstitutions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInstitutionTitle, setNewInstitutionTitle] = useState("");

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/institutions");
      const institutions = await response.json();
      setInstitutions(institutions);
    } catch (error) {
      console.error("Error fetching institutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitution = async () => {
    if (!newInstitutionTitle.trim()) {
      Swal.fire("Error", "Institution title cannot be empty.", "error");
      return;
    }

    try {
      const payload = {
        title: newInstitutionTitle,
        created_by_id: session?.user.id,
      };

      const response = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setInstitutions((prev) => [...prev, data.institution]);
        setNewInstitutionTitle("");
        Swal.fire("Success", "Institution added successfully.", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to add institution.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while adding institution.", "error");
      console.error("Error adding institution:", error);
    }
  };

  const handleDeleteInstitution = async (id: number) => {
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
        const response = await fetch(`/api/institutions?id=${id}`, { method: "DELETE" });
        const data = await response.json();

        if (data.success) {
          setInstitutions((prev) => prev.filter((institution) => institution.id !== id));
          Swal.fire("Deleted!", "The institution has been deleted.", "success");
        } else {
          Swal.fire("Error", data.message || "Failed to delete institution.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while deleting the institution.", "error");
        console.error("Error deleting institution:", error);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchInstitutions();
    }
  }, [status, router, session]);

  if (status === "loading" || loading) return <LoadingSpinner />;
  if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

  const columns = [
    { name: "ID", selector: (row: Institution) => row.id, sortable: true, grow: 0 },
    { name: "Title", selector: (row: Institution) => row.title, sortable: true },
    {
      name: "Actions",
      cell: (row: Institution) => (
        <div className="flex space-x-3 text-lg">
          <FontAwesomeIcon icon={faEdit} className="text-blue-600 cursor-pointer" title="Edit" />
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-600 cursor-pointer"
            title="Delete"
            onClick={() => handleDeleteInstitution(row.id)}
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
          <h2 className="text-xl font-semibold mb-4">Add New Institution</h2>
          <input
            type="text"
            value={newInstitutionTitle}
            onChange={(e) => setNewInstitutionTitle(e.target.value)}
            placeholder="Write institution title"
            className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={handleAddInstitution}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Institution
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Institution List</h2>
          <DataTable
            columns={columns}
            data={institutions}
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

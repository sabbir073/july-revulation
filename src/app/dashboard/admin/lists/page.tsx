/* eslint-disable react-hooks/exhaustive-deps */
// app/dashboard/admin/AdminSeeLists.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import DataTable from "react-data-table-component";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Person {
  id: number;
  name: string;
  age: number | null;
  occupation: { title: string } | null;
  institution: { title: string } | null;
  address: string | null;
  permanent_address: string | null;
  nid: string | null;
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
}

export default function AdminSeeLists() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState("");
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  // Fetch initial data without search query
  const fetchInitialData = async () => {
    if (hasFetchedInitialData) return; // Avoid multiple fetches for initial data
    try {
      setLoading(true);
      const response = await fetch("/api/people");
      const data = await response.json();
      if (data.success) {
        setPeopleData(data.people);
        setHasFetchedInitialData(true); // Mark initial data as fetched
      } else {
        console.error("Error fetching initial data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData2 = async () => {
    
    try {
      setLoading(true);
      const response = await fetch("/api/people");
      const data = await response.json();
      if (data.success) {
        setPeopleData(data.people);
        
      } else {
        console.error("Error fetching initial data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch search data with search query
  const fetchSearchData = async (searchQuery: string) => {
    try {
      setLoadingSearch(true);
      const response = await fetch(`/api/people?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.success) {
        setPeopleData(data.people);
      } else {
        console.error("Error fetching search data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchInitialData();
    }
  }, [status, router, session]);

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    if (value) {
      fetchSearchData(value);
    } else {
      fetchInitialData2();
    }
  }, 500);

  const handleDelete = async (id: number) => {
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
        const response = await fetch(`/api/people/${id}`, { method: "DELETE" });
        const data = await response.json();

        if (data.success) {
          setPeopleData((prevData) => prevData.filter((person) => person.id !== id));
          Swal.fire("Deleted!", "The entry has been deleted.", "success");
        } else {
          Swal.fire("Error", data.error || "Failed to delete the entry.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while deleting the entry.", "error");
        console.error("Error deleting entry:", error);
      }
    }
  };

  const handleView = (id: number) => {
    router.push(`/dashboard/admin/lists/${id}`); // Redirect to the profile view page
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/admin/update/${id}`);
  };

  if (status === "loading" || loading) return <LoadingSpinner />;
  if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

  const columns = [
    { name: "ID", selector: (row: Person) => row.id, sortable: true, grow: 0 },
    { name: "Name", selector: (row: Person) => row.name, sortable: true },
    { name: "Age", selector: (row: Person) => row.age || "N/A", sortable: true, grow: 0 },
    { name: "Occupation", selector: (row: Person) => row.occupation?.title || "N/A", sortable: true },
    {
      name: "Date",
      selector: (row: Person) =>
        row.date
          ? new Date(row.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "N/A",
      sortable: true,
    },
    { name: "Family Contact", selector: (row: Person) => row.family_member_contact || "N/A", sortable: false },
    { name: "Type", selector: (row: Person) => row.incident_type, sortable: true },
    { name: "Status", selector: (row: Person) => row.status, sortable: true },
    { name: "Submitted By", selector: (row: Person) => row.submitted_by.name, sortable: false },
    {
      name: "Actions",
      cell: (row: Person) => (
        <div className="flex space-x-3 text-lg">
          <FontAwesomeIcon icon={faEye} className="text-green-600 cursor-pointer" title="View" onClick={() => handleView(row.id)} />
          <FontAwesomeIcon icon={faEdit} className="text-blue-600 cursor-pointer" title="Edit" onClick={() => handleEdit(row.id)}/>
          <FontAwesomeIcon icon={faTrash} className="text-red-600 cursor-pointer" title="Delete" onClick={() => handleDelete(row.id)} />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 0,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgb(134 239 172 / var(--tw-bg-opacity))",
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Martyrs Or Injured List</h2>
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        {loadingSearch && <p className="text-gray-600 mb-4">Searching...</p>}
        <DataTable
          columns={columns}
          data={peopleData}
          pagination
          highlightOnHover
          pointerOnHover={false}
          responsive
          striped
          customStyles={customStyles}
        />
      </div>
    </DashboardLayout>
  );
}

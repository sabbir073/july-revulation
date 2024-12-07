// app/dashboard/admin/AdminSeeVisitors.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import DataTable from "react-data-table-component";

interface Visitor {
  id: number;
  ip_address: string;
  country: string | null;
  region: string | null;
  city: string | null;
  visit_count: number;
  visited_at: string;
}

export default function AdminSeeVisitors() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visitorData, setVisitorData] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch visitor data
  const fetchVisitorData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/public/visitor");
      const data = await response.json();
      if (data.success) {
        setVisitorData(data.visitors);
      } else {
        console.error("Error fetching visitor data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching visitor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchVisitorData();
    }
  }, [status, router, session]);

  if (status === "loading" || loading) return <LoadingSpinner />;
  if (status === "unauthenticated" || session?.user.role !== "ADMIN") return null;

  const columns = [
    { name: "ID", selector: (row: Visitor) => row.id, sortable: true, grow: 0 },
    { name: "IP Address", selector: (row: Visitor) => row.ip_address, sortable: true },
    { name: "Country", selector: (row: Visitor) => row.country || "N/A", sortable: true },
    { name: "Region", selector: (row: Visitor) => row.region || "N/A", sortable: true },
    { name: "City", selector: (row: Visitor) => row.city || "N/A", sortable: true },
    { name: "Visit Count", selector: (row: Visitor) => row.visit_count, sortable: true },
    {
        name: "Last Visited",
        selector: (row: Visitor) =>
          new Date(row.visited_at).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Use 12-hour format with AM/PM
          }),
        sortable: true,
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
          <h2 className="text-2xl font-semibold text-gray-800">Visitor List</h2>
        </div>
        <DataTable
          columns={columns}
          data={visitorData}
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

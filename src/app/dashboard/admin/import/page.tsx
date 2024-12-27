"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminManageImport() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Check session & role
  if (status === "loading") return <LoadingSpinner />;
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }
  if (status === "authenticated" && session?.user.role !== "ADMIN") {
    router.replace(`/dashboard/${session?.user.role.toLowerCase()}`);
    return null;
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Submit file to import API (no progress bar)
  const handleImportSubmit = async () => {
    if (!csvFile) {
      Swal.fire("Error", "Please select a CSV file first.", "error");
      return;
    }

    try {
      setImporting(true);

      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("submitted_by_id", String(session?.user.id));

      const res = await fetch("/api/people/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire("Success", "CSV import completed!", "success");
      } else {
        Swal.fire("Error", data.error || "Import failed", "error");
      }
    } catch (err) {
      console.error("Import error:", err);
      Swal.fire("Error", "Failed to import CSV", "error");
    } finally {
      setImporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Import People Data from CSV</h2>
        <div className="flex flex-col space-y-3 md:w-1/2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            disabled={importing}
          />

          <button
            onClick={handleImportSubmit}
            disabled={importing}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
              importing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {importing ? "Importing..." : "Start Import"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

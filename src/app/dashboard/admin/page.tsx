"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import the spinner

const CounterCard: React.FC<{ title: string; count: number; color: string; textColor: string }> = ({
  title,
  count,
  color,
  textColor,
}) => {
  const [currentCount, setCurrentCount] = useState<number>(0);

  // Counter animation effect
  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(count / 100);
    const timer = setInterval(() => {
      start += increment;
      if (start >= count) {
        setCurrentCount(count);
        clearInterval(timer);
      } else {
        setCurrentCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg ${color} w-full h-48`}>
      <h3 className={`text-xs sm:text-xl md:text-sm font-bold mb-4 ${textColor}`}>{title.toUpperCase()}</h3>
      <p className={`text-xl sm:text-2xl md:text-2xl font-extrabold ${textColor}`}>{currentCount.toLocaleString()}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visitorCount, setVisitorCount] = useState<number>(0); // State for visitor count

  const counters = [
    { title: "Listed Martyrs", count: 1500, color: "bg-red-300", textColor: "text-gray-800" },
    { title: "Listed Injured", count: 650, color: "bg-green-300", textColor: "text-gray-800" },
    { title: "Pending Martyrs", count: 120, color: "bg-yellow-300", textColor: "text-gray-800" },
    { title: "Pending Injured", count: 75, color: "bg-blue-300", textColor: "text-gray-800" },
    { title: "Total Location", count: 35, color: "bg-purple-300", textColor: "text-gray-800" },
    { title: "Visitor Count", count: visitorCount, color: "bg-teal-300", textColor: "text-gray-800" }, // Use dynamic visitorCount
    { title: "Total Story", count: 200, color: "bg-indigo-300", textColor: "text-gray-800" },
    { title: "Total Documentary", count: 20, color: "bg-pink-300", textColor: "text-gray-800" },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    } else if (status === "authenticated" && session?.user.role !== "ADMIN") {
      router.replace(`/dashboard/${session?.user.role.toLowerCase()}`);
    }
  }, [session, status, router]);

  useEffect(() => {
    // Fetch the total visitor count
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch("/api/public/visitor");
        const data = await response.json();
        if (data.success) {
          setVisitorCount(data.total_visit_count || 0); // Update visitor count state
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };

    fetchVisitorCount();
  }, []);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated" || session?.user.role !== "ADMIN") {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Counter Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {counters.map((counter, index) => (
          <CounterCard
            key={index}
            title={counter.title}
            count={counter.count}
            color={counter.color}
            textColor={counter.textColor}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}

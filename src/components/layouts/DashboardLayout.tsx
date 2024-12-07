"use client";

import { ReactNode, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FiHome, FiList, FiPlusSquare, FiX, FiChevronDown, FiMenu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const [language, setLanguage] = useState("EN"); // Add this state for language
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false); // For toggling the dropdown

  // Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [loading, setLoading] = useState(false); // Existing loading state

const handleLanguageChange = async (lang: string) => {
  setLoading(true); // Start loading
  setLanguage(lang);
  localStorage.setItem("language", lang);
  setIsLanguageDropdownOpen(false);

  try {
    //await translatePage(lang); // Translate the page
  } finally {
    setLoading(false); // End loading
  }
};
  
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
      //translatePage(storedLanguage); // Apply translation on page load
    }
  }, []);

  // Define role-based menu items
  const menuItems = useMemo(() => {
    if (status === "authenticated" && session?.user.role) {
      const basePath = `/dashboard/${session.user.role.toLowerCase()}`;
      const items = [
        { title: "Dashboard", icon: FiHome, path: `${basePath}` },
        { title: "Lists", icon: FiList, path: `${basePath}/lists` },
      ];

      if (session.user.role === "ADMIN") {
        items.push({ title: "Add New", icon: FiPlusSquare, path: `${basePath}/add-new` });
        items.push({ title: "Occupation", icon: FiPlusSquare, path: `${basePath}/occupation` });
        items.push({ title: "Institution", icon: FiPlusSquare, path: `${basePath}/institution` });
        items.push({ title: "Story", icon: FiPlusSquare, path: `${basePath}/story` });
        items.push({ title: "Photo Gallery", icon: FiPlusSquare, path: `${basePath}/photo-gallery` });
        items.push({ title: "Incident Location", icon: FiPlusSquare, path: `${basePath}/incident-location` });
        items.push({ title: "Documentary", icon: FiPlusSquare, path: `${basePath}/documentary` });
        items.push({ title: "Users", icon: FiPlusSquare, path: `${basePath}/users` });
        items.push({ title: "Visitor Details", icon: FiPlusSquare, path: `${basePath}/visitor` });
        
      }

      return items;
    }
    return [];
  }, [status, session]);

  if (status === "loading") {
    return <LoadingSpinner />;;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (status === "authenticated") {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
  className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 z-50 transform ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0 transition-transform duration-300 ease-in-out`}
  style={{
    overflowY: "auto",
    maxHeight: "100vh",
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For IE and Edge
  }}
>
  <style jsx>{`
    aside::-webkit-scrollbar {
      display: none; // For Chrome, Safari, and Edge
    }
  `}</style>

  <div className="p-6 pt-4 flex justify-between items-center">
    <Image
      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logo.png`}
      alt="Logo"
      width={150}
      height={50}
      className="h-12 w-auto object-cover cursor-pointer"
    />
    <button
      onClick={toggleSidebar}
      className="md:hidden text-white focus:outline-none"
    >
      <FiX size={24} />
    </button>
  </div>

  {/* Role-based Dashboard Label */}
  <div className="px-6 pb-4 text-gray-300 text-lg font-semibold">
    Hi, {session?.user.display_name}
  </div>

  {/* Sidebar Menu */}
  <nav className="space-y-2 px-4">
    {menuItems.map((item) => (
      <Link
        key={item.title}
        href={item.path}
        className="flex items-center px-2 py-2 rounded-md hover:bg-gray-700"
      >
        <item.icon className="mr-3" />
        {item.title}
      </Link>
    ))}
  </nav>
</aside>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between bg-red-600 p-4 text-white">
          {/* Mobile Menu Icon */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white focus:outline-none"
          >
            <FiMenu size={24} />
          </button>

          {/* Welcome Message */}
          <span className="hidden md:block text-lg font-semibold">
            {session?.user.role} Dashboard
          </span>

          {/* Centered Search Box */}
          <div className="mx-auto">
            <input
              type="text"
              placeholder="Type to search..."
              className="w-64 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-100 text-black"
            />
          </div>

          {/* Language Dropdown */}
          <div className="relative mr-4">
            <button
              onClick={() => setIsLanguageDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <span className="uppercase">{language}</span>
              <FiChevronDown size={20} />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded-md shadow-lg z-20">
                <button
                  onClick={() => handleLanguageChange("EN")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange("BN")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                >
                  BN
                </button>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <FaUserCircle size={24} />
              <FiChevronDown size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded-md shadow-lg z-20">
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-100 text-center py-4 mt-auto">
            <p className="text-gray-600 text-sm">
                © 2024 JRABD. All Rights Reserved. | Developed By{" "}
                <Link href="https://mdsabbirahmed.com" target="_blank" className="text-blue-500 hover:underline">
                Md Sabbir Ahmed
                </Link>
            </p>
            </footer>

      </div>
    </div>
  );
}
return null;
}



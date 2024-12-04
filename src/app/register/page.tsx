"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import LoginLayout from "@/components/layouts/LoginLayout";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    display_name: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState(false);

  const redirectToDashboard = useCallback(
    (role: string) => {
      switch (role) {
        case "ADMIN":
          router.replace("/dashboard/admin");
          break;
        case "VENDOR":
          router.replace("/dashboard/vendor");
          break;
        case "USER":
          router.replace("/dashboard/user");
          break;
        default:
          router.replace("/login");
      }
    },
    [router]
  );

  // Redirect authenticated users to the dashboard based on their role
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      redirectToDashboard(session.user.role);
    }
  }, [status, session, redirectToDashboard]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, mobile_number, display_name, password, confirmPassword } = formData;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match.", "error");
      return;
    }
  
    setSubmitting(true);
  
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile_number, display_name, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setSuccess(true);
        Swal.fire("Success", data.message || "Registration successful!", "success");
        setTimeout(() => router.replace("/login"), 2000);
      } else {
        Swal.fire("Error", data.message || "Registration failed.", "error");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };
  

 // Show spinner if session status is loading or authenticated
 if (status === "loading" || status === "authenticated") {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
  return (
    <LoginLayout>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-8">
        {/* Logo Positioned Outside and Centered */}
        <div className="mb-6">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logo.png`}
            alt="Logo"
            width={180}
            height={150}
          />
        </div>

        {/* Registration Card */}
        <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-6 text-2xl font-semibold text-center text-gray-700">Member Registration</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              name="mobile_number"
              placeholder="Mobile Number"
              value={formData.mobile_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              name="display_name"
              placeholder="Display Name"
              value={formData.display_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <div className="relative">
                <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
                <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                />
            </div>

            <div className="relative">
                <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
                <FontAwesomeIcon
                    icon={confirmPasswordVisible ? faEyeSlash : faEye}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                    onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full px-4 py-2 font-semibold rounded-md ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              {submitting ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="flex justify-center mt-4 text-sm text-indigo-500">
            <Link href="/login" className="hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
}
return null; // Prevent rendering anything if session status is undefined
}

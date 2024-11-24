"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBars,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Header: React.FC = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [isSticky, setSticky] = useState<boolean>(false);
  const [isLanguageOpen, setLanguageOpen] = useState<boolean>(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileNav = () => setMobileNavOpen((prev) => !prev);
  const toggleLanguageDropdown = () => setLanguageOpen((prev) => !prev);

  return (
    <header className="relative w-full">
      {/* Topbar */}
      <div
        className={`bg-[#b71c1c] text-white text-base py-2 hidden md:block ${
          isSticky ? "hidden" : "block"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <FaMapMarkerAlt className="mr-2 text-lg" />
              <p>Uttara, Dhaka 1230.</p>
            </div>
            <div className="flex items-center mb-2 md:mb-0">
              <FaPhoneAlt className="mr-2 text-lg" />
              <p>+01234567890</p>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-2 text-lg" />
              <a href="mailto:info@jrabd.com" className="hover:underline">
                info@jrabd.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className={`bg-[#2e7d32] sticky top-0 z-50 py-4 transition-all ${
          isSticky ? "py-2 shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" passHref>
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logo.png`}
            alt="Logo"
            width={150}
            height={50}
            className="h-12 w-auto object-cover cursor-pointer"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden xl:flex space-x-8 items-center text-white text-sm">
            <li>
              <Link
                href="/"
                className="hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md transition-all"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                href="/martyrs"
                className="hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md transition-all"
              >
                MARTYRS
              </Link>
            </li>
            <li>
              <Link
                href="/injured"
                className="hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md transition-all"
              >
                INJURED
              </Link>
            </li>
            <li>
              <Link
                href="/photos"
                className="hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md transition-all"
              >
                PHOTOS
              </Link>
            </li>
            <li>
              <Link
                href="/documentaries"
                className="hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md transition-all"
              >
                DOCUMENTARIES
              </Link>
            </li>
            <li>
              <Link
                href="/forum"
                className="hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md transition-all"
              >
                FORUM
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md transition-all"
              >
                ABOUT US
              </Link>
            </li>
            
          </ul>

          {/* Right Section: Language Switcher and Login */}
          <div className="flex items-center space-x-6">
            {/* Language Dropdown */}
            <div className="relative" ref={languageRef}>
              <button
                className="uppercase text-white flex items-center space-x-1 focus:outline-none"
                onClick={toggleLanguageDropdown}
              >
                <span>EN</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 14.7l-5.3-5.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l6 6c.4.4 1 .4 1.4 0l6-6c.4-.4.4-1 0-1.4s-1-.4-1.4 0L12 14.7z" />
                </svg>
              </button>
              {isLanguageOpen && (
                <ul className="absolute left-0 mt-2 bg-white text-black shadow-lg rounded-md w-32">
                  <li>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setLanguageOpen(false)}
                    >
                      English
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setLanguageOpen(false)}
                    >
                      Bangla
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <Link href="/login">
              <button className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800">
                Login
              </button>
            </Link>

            <button
              className="xl:hidden text-2xl text-white"
              onClick={toggleMobileNav}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 h-full w-2/3 bg-gradient-to-b from-green-500 to-red-500 text-white z-50 transform transition-transform ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <Link href="/" passHref>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logo.png`}
              alt="Logo"
              width={120}
              height={40}
              className="h-12 w-auto object-cover"
            />
          </Link>
          <button onClick={toggleMobileNav}>
            <RxCross2 className="text-2xl" />
          </button>
        </div>

        <ul className="flex flex-col items-start p-4 space-y-3 text-sm">
          <li>
            <Link
              href="/"
              onClick={toggleMobileNav}
              className="hover:text-blue-900 transition-all"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/martyrs"
              onClick={toggleMobileNav}
              className="hover:text-blue-900 transition-all"
            >
              MARTYRS
            </Link>
          </li>
          <li>
            <Link
              href="/injured"
              onClick={toggleMobileNav}
              className="hover:text-blue-900 transition-all"
            >
              INJURED
            </Link>
          </li>
          <li>
            <Link
              href="/photos"
              onClick={toggleMobileNav}
              className="hover:text-blue-900 transition-all"
            >
              PHOTOS
            </Link>
          </li>
          <li>
            <Link
              href="/documentaries"
              onClick={toggleMobileNav}
              className="hover:text-blue-900 transition-all"
            >
              DOCUMENTARIES
            </Link>
          </li>
          <li>
            <Link
              href="/forum"
              onClick={toggleMobileNav}
              className="hover:text-blue-900 transition-all"
            >
              FORUM
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              onClick={toggleMobileNav}
              className="hover:text-blue-900 transition-all"
            >
              ABOUT US
            </Link>
          </li>
        </ul>

        <div className="mt-auto p-4 space-y-4">
          <div className="flex items-center space-x-2 text-sm">
            <FaMapMarkerAlt className="text-lg" />
            <p>Moonshine St. 14/05 Light City</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <FaPhoneAlt className="text-lg" />
            <p>00 (123) 456 78 90</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <FaEnvelope className="text-lg" />
            <a href="mailto:sandbox@email.com">sandbox@email.com</a>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="bg-white p-2">
              <FaFacebook className="text-blue-600 text-xl" />
            </a>
            <a href="#" className="bg-white p-2">
              <FaInstagram className="text-pink-500 text-xl" />
            </a>
            <a href="#" className="bg-white p-2">
              <FaYoutube className="text-red-600 text-xl" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

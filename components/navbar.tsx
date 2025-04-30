"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Sun, Moon } from "lucide-react";
import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
//import the aboutRef from the root page
import Home from "@/app/page";


export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    // Check initial theme preference from ThemeProvider (if possible) or system/localStorage
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    // Adjusted dark background for navbar
    <nav className="sticky top-0 z-50 bg-white border dark:bg-[#0F172A]">
      <div className="flex h-16 items-center px-8 my-1 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          {/* Apply filter in dark mode to make SVG logo compatible */}
          <Image src="/logo.svg" width={120} height={120} alt="Logo" className="dark:invert dark:brightness-0" />
        </Link>

        {/* Adjusted spacing and text color for dark mode */}
        <div className="flex items-center ml-auto md:ml-80 space-x-4 md:space-x-20">
          <Link
            href="/instructors"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-indigo-400"
          >
            Instructors
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-indigo-400"
          >
            Courses
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-indigo-400"
          >
            About Us
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="focus:outline-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" // Added padding and hover effect
          >
            {darkMode ? (
              //</button> Adjusted icon color for dark mode
              <Sun className="w-5 h-5 text-gray-500 dark:text-yellow-400" />
            ) : (
              // Adjusted icon color for light mode
              <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          <SignedOut>
            <div className="flex gap-4">
              <SignInButton mode="modal">
                 {/* Adjusted dark mode button styles */}
                <Button className="bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 dark:hover:from-indigo-700 dark:hover:to-indigo-900 transition-all">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                 {/* Adjusted dark mode button styles */}
                <Button className="bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-slate-50 dark:hover:bg-gray-600 transition-all">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

// Define types or fetch data for courses dynamically if needed
const CoursesPage = () => {
  const { user } = useUser(); // Get user data from Clerk
  const searchParams = useSearchParams();
  const searchCategory = searchParams.get("search") || "";
  const [courses, setCourses] = useState([]);

  // Fetch courses dynamically if needed (replace with API if real data is required)
  useEffect(() => {
    const fetchCourses = async () => {
      // Assuming we have an API endpoint to fetch courses
      const res = await fetch('/api/courses'); // Replace with your actual API route
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  // Filter courses by category if provided
  const filteredCourses = searchCategory
    ? courses.filter(course => course.category.toLowerCase().includes(searchCategory.toLowerCase()))
    : courses;

  // If no user, show login prompt
  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Please Log In</h1>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-10">
      <div className="flex">
        <div className="flex-1">
          <div className="p-8">
            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl p-8 mb-12 text-primary-foreground">
              <h1 className="text-4xl font-bold mb-4">
                Sharpen Your Skills With
                <br />
                Professional Online Courses
              </h1>
              <Button variant="secondary" className="mt-4">
                Join Now
              </Button>
            </div>

            {/* Courses Listing */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Courses</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <Link href={`/courses/${course.id}`} key={course.id}>
                      <Card className="overflow-hidden dark:bg-gray-700 shadow-lg rounded-lg">
                        <div className="aspect-video relative">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader className="space-y-2">
                          <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {course.category}
                          </div>
                          <CardTitle className="line-clamp-2 text-lg">
                            {course.title}
                          </CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <div className="flex items-center gap-3">
                            <Image
                              src={course.instructor.avatar}
                              alt={course.instructor.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <div className="font-medium">{course.instructor.name}</div>
                              <div className="text-sm text-muted-foreground">{course.instructor.role}</div>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <p>No courses available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 flex-shrink-0 border-l min-h-screen sticky top-0 overflow-y-auto max-h-screen scroll-smooth transition-all duration-300">
          <div className="p-10 space-y-8">
            {/* User Profile */}
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4 mb-2">
                <Link href="/profile">
                  <Image
                    src={user?.imageUrl || "User"}
                    alt={user?.fullName || "User"}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </Link>
                <div className="text-center">
                  <h2 className="font-semibold text-lg">Welcome Back {user?.firstName || "User"}!</h2>
                  <p className="text-sm text-muted-foreground">
                    Continue Your Journey
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  {/* Icons can be added here */}
                </Button>
              </div>
            </div>

            {/* Your Mentor */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Your Mentor</h2>
                <Button variant="link" className="text-primary text-sm">
                  See All
                </Button>
              </div>

              {/* Assuming you have mentor data */}
              <div className="space-y-4">
                {/* Mock mentors or dynamically load them */}
                {[
                  { name: "Subhajit S", role: "DSA Expert", avatar: "https://ui-avatars.com/api/?name=S+S&background=random" },
                  { name: "Debargha B", role: "Software Developer", avatar: "https://ui-avatars.com/api/?name=D+B&background=random" },
                  { name: "Tridib P", role: "Frontend Developer", avatar: "https://ui-avatars.com/api/?name=T+P&background=random" },
                  { name: "Anirban B", role: "Civil Engineer", avatar: "https://ui-avatars.com/api/?name=A+B&background=random" },
                  { name: "Ayan B", role: "Thermodynamics Expert", avatar: "https://ui-avatars.com/api/?name=A+B&background=random" },
                ].map((mentor) => (
                  <div key={mentor.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={mentor.avatar}
                        alt={mentor.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{mentor.name}</div>
                        <div className="text-sm text-muted-foreground">{mentor.role}</div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

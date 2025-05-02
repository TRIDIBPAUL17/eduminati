"use client";

import { Suspense, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Dummy data
const courses = [
  {
    id: 1,
    title: "Subhajit Srimani",
    category: "PROGRAMMING",
    thumbnail: "https://as1.ftcdn.net/v2/jpg/02/25/43/84/1000_F_225438459_rf2TFCzW8MohNc2jD98Fu9UZg9fAbkBJ.jpg",
  },
  {
    id: 2,
    title: "Debargha Bhattacharjee",
    category: "PROGRAMMING",
    thumbnail: "https://edtech4beginners.com/wp-content/uploads/2021/05/1.png",
  },
  {
    id: 3,
    title: "Tridib Paul",
    category: "FRONTEND",
    thumbnail: "https://as1.ftcdn.net/v2/jpg/03/45/75/94/1000_F_345759488_gh3cxWU7DEnZJCmDiggHnsuM2zqpkTpG.jpg",
  },
  {
    id: 4,
    title: "Anirban Bhattacharya",
    category: "ENGINEERING",
    thumbnail: "https://ww2.kqed.org/app/uploads/sites/23/2015/05/Beard-Algorithm-1440x811.jpg",
  },
  {
    id: 5,
    title: "Ayan Biswas",
    category: "PHYSICS",
    thumbnail: "https://media.istockphoto.com/id/184397828/photo/bossy-teacher-sitting-and-teaching.jpg?s=612x612&w=0&k=20&c=JMooowVez49WCr-pJFhu90NB_aC2reLkFqGLKt2Ux8A=",
  },
];

const mentors = [
  {
    name: "Subhajit S",
    role: "DSA Expert",
    avatar: "https://ui-avatars.com/api/?name=S+S&background=random",
  },
  {
    name: "Debargha B",
    role: "Software Developer",
    avatar: "https://ui-avatars.com/api/?name=D+B&background=random",
  },
  {
    name: "Tridib P",
    role: "Frontend Developer",
    avatar: "https://ui-avatars.com/api/?name=T+P&background=random",
  },
  {
    name: "Anirban B",
    role: "Civil Engineer",
    avatar: "https://ui-avatars.com/api/?name=A+B&background=random",
  },
  {
    name: "Ayan B",
    role: "Thermodynamics Expert",
    avatar: "https://ui-avatars.com/api/?name=A+B&background=random",
  },
];

// ✅ Component using useSearchParams inside Suspense
function InstructorContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const searchCategory = searchParams.get("search") || "";
  const [index, setIndex] = useState(0);

  const categories = searchCategory
    .split(",")
    .map((cat) => cat.trim().toLowerCase())
    .filter(Boolean);

  const filteredCourses = categories.length
    ? courses.filter((c) =>
        categories.some((cat) =>
          c.category.toLowerCase().includes(cat)
        )
      )
    : courses;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 pl-10">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            {/* Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl p-8 mb-12 text-primary-foreground dark:from-indigo-700 dark:to-indigo-900">
              <h1 className="text-4xl font-bold mb-4">
                Sharpen Your Skills With
                <br />
                Professional Online Courses
              </h1>
              <Button variant="secondary" className="mt-4">
                Join Now
              </Button>
            </div>

            {/* Instructors */}
            <div>
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Instructors</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="transition-transform hover:scale-[1.02]">
                    <Card className="overflow-hidden dark:bg-gray-700">
                      <div className="aspect-video relative">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="space-y-2">
                        <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                          {course.category}
                        </div>
                        <CardTitle className="line-clamp-2 text-lg dark:text-white">
                          {course.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 flex-shrink-0 border-l dark:border-slate-700 min-h-screen sticky top-0 overflow-y-auto max-h-screen scroll-smooth transition-all duration-300">
          <div className="p-10 space-y-8">
            {/* User */}
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4 mb-2">
                <Link href="/profile">
                  <Image
                    src={user?.imageUrl || "/default.jpg"}
                    alt={user?.fullName || "User"}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </Link>
                <div className="text-center">
                  <h2 className="font-semibold text-lg dark:text-white">
                    Welcome Back {user?.firstName || "User"}!
                  </h2>
                  <p className="text-sm text-muted-foreground dark:text-slate-400">
                    Continue Your Journey
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5 dark:text-white" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Mail className="h-5 w-5 dark:text-white" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageSquare className="h-5 w-5 dark:text-white" />
                </Button>
              </div>
              {/* Mentor List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold dark:text-white">Your Mentor</h2>
                  <Button variant="link" className="text-primary text-sm">
                    See All
                  </Button>
                </div>
                <div className="space-y-4">
                  {mentors.map((mentor) => (
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
                          <div className="font-medium dark:text-white">{mentor.name}</div>
                          <div className="text-sm text-muted-foreground dark:text-slate-400">
                            {mentor.role}
                          </div>
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
    </div>
  );
}

// ✅ Main page component — SINGLE FILE!
export default function InstructorPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <InstructorContent />
    </Suspense>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StartTestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Preliminary Test</h1>
        <p className="text-gray-500">
          Please take this test to help us better understand your preliminary knowledge in
        </p>
        <p className="text-gray-500">
          C++ programming so as to suggest you the perfect entry point to this course.
        </p>
      </div>
      <Link href="http://localhost:3000/courses/1/prilim/learn/assessment">
        <Button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:shadow-md text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          START TEST
        </Button>
      </Link>
    </div>
  );
}

import { Suspense } from "react";
import { CourseContent } from "./components/CourseContent";

async function getCourseData() {
  let result: any = {};
  try {
    const response = await fetch("http://localhost:3000/api/courseData");
    result = await response.json();
  } catch (error) {
    console.error("Error fetching course data:", error);
  }

  return {
    id: "1",
    title: result.result[0].course_name,
    instructor: result.result[0].course_instructor,
    description: result.result[0].course_description,
    duration: result.result[0].course_duration,
    chapters: result.result[0].course_sections.map((section: any) => ({
      title: section[0],
      duration: section[1],
      totalVideos: section[2],
      lessons: section[3].map((lesson: any) => ({
        title: lesson,
      })),
    })),
  };
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function Page() {
  const courseData = await getCourseData();

  return (
    <Suspense fallback={<div>Loading course content...</div>}>
      <CourseContent courseData={courseData} />
    </Suspense>
  );
}

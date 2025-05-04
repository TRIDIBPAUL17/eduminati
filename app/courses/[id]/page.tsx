import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Dummy review data
const reviews = [
  {
    id: 1,
    name: "Leonardo Da Vinci",
    avatar: "https://ui-avatars.com/api/?name=L+V&background=random",
    comment: "Loved the course. I've learned some very subtle techniques, especially on leaves.",
  },
];

// Types
interface Lesson {
  title: string;
  videoUrl?: string;
}

interface Chapter {
  title: string;
  duration: string;
  totalVideos: string;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  description: string;
  duration: string;
  chapters: Chapter[];
  price: string;
}

// Fetch course data
async function fetchCourseData(id: string): Promise<CourseData | null> {
  try {
    const response = await fetch("http://localhost:3000/api/courseData", {
      cache: "no-store",
    });
    const result = await response.json();
    const course = result.result?.find((course: any) => course.id === id);

    if (!course) return null;

    return {
      id: course.id || id,
      title: course.course_name || "Course Name Unavailable",
      instructor: course.course_instructor || "Unknown Instructor",
      description: course.course_description || "No description available",
      duration: course.course_duration || "N/A",
      chapters: course.course_sections?.map((section: any) => ({
        title: section[0] || "Untitled Section",
        duration: section[1] || "N/A",
        totalVideos: section[2] || "N/A",
        lessons: section[3]?.map((lesson: any) => ({
          title: lesson || "Untitled Lesson",
        })) || [],
      })) || [],
      price: course.Price || "N/A",
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function CoursePage() {
  // ✅ Hardcoded ID
  const courseId = "1";
  const courseData = await fetchCourseData(courseId);

  if (!courseData) {
    return <div className="p-8 text-red-600 text-xl">Course not found.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden mb-8">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/MNeX4EGtR5Y"
                title="YouTube player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <h1 className="text-2xl font-bold mb-6">{courseData.title}</h1>

            <div className="flex items-center gap-4 mb-8">
              <Image
                src="https://ui-avatars.com/api/?name=S+S&background=random"
                alt="Instructor"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <div className="font-medium">{courseData.instructor}</div>
                <div className="text-sm text-muted-foreground">DSA Expert</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About Course</h2>
              <p className="text-muted-foreground">{courseData.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{review.name}</div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-52 mx-auto flex items-center">
                  Load more reviews
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold">INR {courseData.price}</div>
                    <div className="text-sm text-muted-foreground line-through">
                      INR {parseInt(courseData.price) + 1000}
                    </div>
                  </div>
                  <div className="bg-yellow-100 text-amber-500 text-sm font-medium px-2.5 py-0.5 rounded">
                    50% OFF
                  </div>
                </div>

                <Link href="https://buy.stripe.com/test_6oE289fUcgBe5r2fYY">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 hover:shadow-md" size="lg">
                    Buy
                  </Button>
                </Link>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">📚 {courseData.chapters.length} Sections</div>
                  <div className="flex items-center gap-3">
                    📝{" "}
                    {courseData.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)} Lectures
                  </div>
                  <div className="flex items-center gap-3">⏱️ {courseData.duration}</div>
                  <div className="flex items-center gap-3">🌐 English</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

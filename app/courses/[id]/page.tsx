import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}

const reviews = [
  {
    id: 1,
    name: "Leonardo Da Vinci",
    avatar:
      "https://ui-avatars.com/api/?name=L+V&background=random",
    comment:
      "Loved the course. I've learned some very subtle techniques, especially on leaves.",
  },
  {
    id: 2,
    name: "Titania S",
    avatar:
      "https://ui-avatars.com/api/?name=Titania+S&background=random",
    comment:
      "Loved the course, it had been a while since I had experimented with watercolors and now I will.",
  },
  {
    id: 3,
    name: "Zhirkov",
    avatar:
      "https://ui-avatars.com/api/?name=Z+K&background=random",
    comment:
      "Loved the course. I've learned some very subtle techniques, especially on leaves.",
  },
  {
    id: 4,
    name: "Miphoska",
    avatar:
      "https://ui-avatars.com/api/?name=M+P&background=random",
    comment:
      "Loved the course. I've learned some very subtle techniques, especially on leaves.",
  },
];

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  description: string;
  duration: string;
  chapters: {
    title: string;
    duration: string;
    totalVideos: string;
    lessons: {
      title: string;
      videoUrl?: string; 
    }[];
  }[];
  price: string;
};

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  // Fetch course data server-side
  let courseData: CourseData;
  
  try {
    const response = await fetch("http://localhost:3000/api/courseData", { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const result = await response.json();
    const courseResult = result.result?.find((course: any) => course.id === params.id) || result.result?.[0];
    
    if (!courseResult) {
      throw new Error("Course not found");
    }
    
    courseData = {
      id: courseResult.id || params.id,
      title: courseResult.course_name || "Course Name Unavailable",
      instructor: courseResult.course_instructor || "Unknown Instructor",
      description: courseResult.course_description || "No description available",
      duration: courseResult.course_duration || "N/A",
      chapters: courseResult.course_sections?.map((section: any) => ({
        title: section[0] || "Untitled Section",
        duration: section[1] || "N/A",
        totalVideos: section[2] || "N/A",
        lessons: section[3]?.map((lesson: any) => ({
          title: lesson || "Untitled Lesson",
        })) || [],
      })) || [],
      price: courseResult.Price || "N/A",
    };
  } catch (error) {
    console.error("Error fetching course data:", error);
    // Fallback data if fetch fails
    courseData = {
      id: params.id,
      title: "Course information unavailable",
      instructor: "Unknown",
      description: "Course information could not be loaded",
      duration: "N/A",
      chapters: [],
      price: "N/A",
    };
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden mb-8">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/MNeX4EGtR5Y"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
                ></iframe>
            </div>

            {/* Course Title */}
            <h1 className="text-2xl font-bold mb-6">{courseData.title}</h1>

            {/* Instructor */}
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="https://ui-avatars.com/api/?name=S+S&background=random"
                alt="Subhajit Srimani"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <div className="font-medium">{courseData.instructor}</div>
                <div className="text-sm text-muted-foreground">
                  DSA Expert
                </div>
              </div>
            </div>

            {/* About Course */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About Course</h2>
              <p className="text-muted-foreground">
                {courseData.description || "Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with modern tooling and supporting libraries."}
              </p>
            </div>

            {/* Reviews */}
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

                <div className="space-y-4">         
                  <Link href="https://buy.stripe.com/test_6oE289fUcgBe5r2fYY" passHref>
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 hover:shadow-md" size="lg">
                      Buy
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      📚
                    </div>
                    <div>{courseData.chapters?.length || 0} Sections</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      📝
                    </div>
                    <div>{courseData.chapters?.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0} Lectures</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      ⏱️
                    </div>
                    <div>{courseData.duration || "21h 33m total length"}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      🌐
                    </div>
                    <div>English</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

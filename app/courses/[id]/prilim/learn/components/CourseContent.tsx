"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
};

interface CourseContentProps {
  courseData: CourseData;
}

const comments = [
  {
    id: 1,
    name: "Debargha Bhattacharjee",
    avatar: "https://ui-avatars.com/api/?name=D+B&background=random",
    comment:
      "Loved the course. I've learned some very subtle techniques, especially on leaves.",
  },
  {
    id: 2,
    name: "Tridib Paul",
    avatar: "https://ui-avatars.com/api/?name=T+P&background=random",
    comment:
      "Loved the course, it had been a while since I had experimented with watercolors and now I will.",
  },
  {
    id: 3,
    name: "Anirban Bhattacharya",
    avatar: "https://ui-avatars.com/api/?name=A+B&background=random",
    comment:
      "Loved the course. I've learned some very subtle techniques, especially on leaves.",
  },
  {
    id: 4,
    name: "Ayan Biswas",
    avatar: "https://ui-avatars.com/api/?name=A+B&background=random",
    comment:
      "Loved the course. I've learned some very subtle techniques, especially on leaves.",
  },
];

export function CourseContent({ courseData }: CourseContentProps) {

  const [activeChapters, setActiveChapters] = useState<number[]>([]);
  const [activeLesson, setActiveLesson] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://www.youtube.com/embed/MNeX4EGtR5Y");
  const [refreshKey, setRefreshKey] = useState(0); 

  const toggleChapter = (chapterIndex: number) => {
    setActiveChapters((prevActiveChapters) =>
      prevActiveChapters.includes(chapterIndex)
        ? prevActiveChapters.filter((index) => index !== chapterIndex)
        : [...prevActiveChapters, chapterIndex]
    );
  };
  
  const handleLessonClick = (chapterIndex: number, lessonIndex: number) => {
    setActiveLesson(lessonIndex);
    const videoUrl = courseData.chapters[chapterIndex].lessons[lessonIndex].videoUrl || "https://www.youtube.com/embed/MNeX4EGtR5Y";
    setCurrentVideoUrl(videoUrl);
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden mb-8">
              <iframe
              key={refreshKey}
              width="100%"
              height="100%"
              src={currentVideoUrl}
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
                  DSA Instructor
                </div>
              </div>
            </div>

            {/* About Course */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About Course</h2>
              <p className="text-muted-foreground">
              {courseData.description}
              </p>
            </div>

            {/* Comments */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              <div className="space-y-6">
                {comments.map((review) => (
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
                <Button
                  variant="outline"
                  className="w-52 mx-auto flex items-center"
                >
                  Load more comments
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:border-l">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                {courseData.chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.title} className="border rounded-lg dark:border-gray-600">
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-600"
                      onClick={() => toggleChapter(chapterIndex)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {chapter.totalVideos} videos • {chapter.duration}
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    {activeChapters.includes(chapterIndex) && (
                      <div className="border-t">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.title}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-600 ${
                              activeLesson === lessonIndex ? "bg-gray-600" : ""
                            }`}
                            onClick={() => handleLessonClick(chapterIndex, lessonIndex)}
                          >
                            <div className="text-left">
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-sm text-muted-foreground">
                                15 min
                              </div>
                            </div>
                            {false && (
                              <div className="text-green-500">✓</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

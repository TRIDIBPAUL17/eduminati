"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Question {
  text: string;
  options: {
    id: number;
    text: string;
  }[];
  correctAnswer: number;
}

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  chapters: never[];
}

interface AssessmentContentProps {
  courseData: CourseData;
}

export default function AssessmentContent({
  courseData,
}: AssessmentContentProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [wasAnswerCorrect, setWasAnswerCorrect] = useState<boolean | null>(null);
  const totalQuestions = 10;
  const minLevel = 1;
  const maxLevel = 5;
  const [level, setLevel] = useState(3);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        let response;

        if (level === 1) response = await fetch("/api/beginner");
        else if (level === 2) response = await fetch("/api/intermediate");
        else if (level === 3) response = await fetch("/api/basic");
        else if (level === 4) response = await fetch("/api/advanced");
        else response = await fetch("/api/expert");

        const result = await response.json();

        const index =
          (Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10)) %
          25;

        const fetchedQuestions = [
          {
            text: result.result[0].questions[index][0],
            options: result.result[0].questions[index][1].map(
              (option: string, idx: number) => ({
                id: idx,
                text: option,
              })
            ),
            correctAnswer: result.result[0].questions[index][2],
          },
        ];

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }

    fetchQuestions();
  }, [currentQuestion]);

  const handleOptionSelect = (optionId: number, question: Question) => {
    setSelectedOption(optionId);
    const isCorrect = Number(question.correctAnswer) === optionId;
    setWasAnswerCorrect(isCorrect);
  };

  const handleNext = () => {
    if (wasAnswerCorrect !== null) {
      if (wasAnswerCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        setLevel((prev) => Math.min(prev + 1, maxLevel));
      } else {
        setIncorrectAnswers((prev) => prev + 1);
        setLevel((prev) => Math.max(prev - 1, minLevel));
      }
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedOption(null);
    setWasAnswerCorrect(null);
  };

  return (
    // Added dark mode background for the page container
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      {/* Added dark mode background and border for the main card */}
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6 border dark:border-gray-700">
        {/* Left Sidebar */}
        {/* Adjusted border color for dark mode */}
        <div className="flex flex-col justify-center space-y-6 pl-4 py-4 pr-8 border-r dark:border-gray-600">
          {/* Adjusted text color for dark mode */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Mastering C++: From Beginner to Advanced</h1>
          {/* Adjusted text color for dark mode */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Preliminary Test</h1>
          {/* Adjusted background and text color for dark mode */}
          <div className="flex justify-center bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-2xl shadow mx-auto">
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">LEVEL: {level}</div>
          </div>
          <div className="flex flex-col items-center justify-center py-2 px-4 mx-auto">
            {/* Adjusted text color for dark mode */}
            <div className="text-lg font-bold text-green-600 dark:text-green-400">Correct: {correctAnswers}</div>
            {/* Adjusted text color for dark mode */}
            <div className="text-lg font-bold text-red-600 dark:text-red-400">Incorrect: {incorrectAnswers}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="my-auto md:col-span-3 space-y-6 p-4">
          {questions.map((question, index) => (
            <div key={index} className="space-y-6">
              {/* Question */}
              {/* Adjusted background and text color for dark mode */}
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-lg shadow flex items-center gap-4">
                {/* Adjusted background and text color for dark mode */}
                <div className="w-12 h-12 bg-amber-400 text-white dark:text-gray-900 flex items-center justify-center text-lg font-semibold rounded-full">
                  {currentQuestion}
                </div>
                {/* Adjusted text color for dark mode */}
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{question.text}</h3>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id, question)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg shadow-sm transition-colors font-medium border",
                      // Dark mode styles for default state
                      "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600",
                      selectedOption === option.id
                        // Dark mode styles for selected state
                        ? "bg-indigo-500 dark:bg-indigo-600 text-white dark:text-white border-indigo-700 dark:border-indigo-500"
                        : "" // Default state handled above
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "font-semibold",
                          // Adjusted text color for dark mode (default)
                          "text-indigo-600 dark:text-indigo-400",
                          selectedOption === option.id ? "text-white dark:text-white" : "" // Selected state handled above
                        )}
                      >
                        {Number(option.id) + 1}
                      </span>
                      <span
                        // Adjusted text color for dark mode (default)
                        className={cn("text-gray-800 dark:text-gray-200",
                        selectedOption === option.id ? "text-white dark:text-white" : "" // Selected state handled above
                        )}
                      >
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex justify-end">
          {currentQuestion === totalQuestions ? (
            <Button
            onClick={() => {
              if (wasAnswerCorrect !== null) {
              if (wasAnswerCorrect) {
                setCorrectAnswers((prev) => prev + 1);
              } else {
                setIncorrectAnswers((prev) => prev + 1);
              }
              }
                const finalCorrectAnswers = correctAnswers + (wasAnswerCorrect ? 1 : 0);
                let suggestion = "";
                if (finalCorrectAnswers < 5) {
                  suggestion = "We suggest you to start from Unit 1.";
                } else if (finalCorrectAnswers >= 5 && finalCorrectAnswers < 7) {
                suggestion = "We suggest you to start from Unit 2.";
                } else if (finalCorrectAnswers >= 7 && finalCorrectAnswers < 9) {
                suggestion = "We suggest you to start from Unit 3.";
                } else if (finalCorrectAnswers >= 9) {
                suggestion = "We suggest you to start from Unit 4.";
                }
                // Consider using a modal instead of alert for better UX
                alert(`Correct Answers: ${finalCorrectAnswers}\n${suggestion}`);
                window.location.href = "http://localhost:3000/courses/1/prilim/learn";
            }}
            disabled={selectedOption === null}
            // Adjusted button colors for dark mode
            className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white"
            >
            Submit
            </Button>
          ) : (
            <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            // Adjusted button colors for dark mode
            className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white"
            >
            Next
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

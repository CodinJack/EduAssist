"use client";
import { useState, useEffect } from "react";
import QuizQuestion from "@/components/quizQuestion";
import ProgressBar from "@/components/progressBar";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";

const questions = [
  { id: "1", question: "What is 2 + 2?", options: ["3", "4", "5", "6"] },
  { id: "2", question: "What is the capital of France?", options: ["Berlin", "Paris", "Rome", "Madrid"] },
  { id: "3", question: "Who developed Python?", options: ["Linus Torvalds", "Guido van Rossum", "Bill Gates", "James Gosling"] },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins countdown
  const router = useRouter();
  const totalQuestions = questions.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/quiz/1/result`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz Time! 🧠</h1>
      <ProgressBar progress={progress} />

      <div className="text-right mb-4">
        <span className="text-red-500 font-semibold">
          ⏳ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      <QuizQuestion {...questions[currentIndex]} />

      <div className="flex justify-between mt-4">
        <button
          className="p-2 bg-gray-300 rounded"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
        >
          Previous
        </button>
        {currentIndex < totalQuestions - 1 ? (
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="p-2 bg-green-500 text-white rounded"
            onClick={() => router.push(`/quiz/1/result`)}
          >
            Submit
          </button>
        )}
      </div>
    </main>
  );
}

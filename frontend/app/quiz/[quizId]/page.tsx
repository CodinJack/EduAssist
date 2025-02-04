"use client";
import { useParams } from "next/navigation";

export default function QuizPage() {
  const { quizId } = useParams();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Quiz {quizId}</h1>
      <p>Question 1: What is 2 + 2?</p>
      <button className="mt-4 p-2 bg-blue-500 text-white rounded">Submit</button>
    </main>
  );
}

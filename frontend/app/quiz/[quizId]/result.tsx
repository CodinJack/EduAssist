"use client";
import { useParams } from "next/navigation";

export default function QuizResult() {
  const { quizId } = useParams();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Results for Quiz {quizId}</h1>
      <p>You scored: 8/10</p>
    </main>
  );
}

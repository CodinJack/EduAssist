"use client";
import Link from "next/link";

const quizzes = [
  { id: "1", title: "Math Basics" },
  { id: "2", title: "Physics Fundamentals" },
];

export default function QuizList() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Quizzes</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link href={`/quizzes/${quiz.id}`}>
              <span className="text-blue-500">{quiz.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Hardcoded questions
const questions = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    option1: "O(n)",
    option2: "O(log n)",
    option3: "O(n log n)",
    option4: "O(1)",
    correct: "O(log n)",
    difficulty: "Intermediate",
    tags: ["Binary Search", "Algorithms"],
    hint: "Binary search divides the search space in half each time.",
    solution: "Binary search has O(log n) time complexity because it halves the search space at each step."
  },
  {
    id: 2,
    question: "Which SQL JOIN returns only the matching rows from both tables?",
    option1: "LEFT JOIN",
    option2: "RIGHT JOIN",
    option3: "INNER JOIN",
    option4: "FULL OUTER JOIN",
    correct: "INNER JOIN",
    difficulty: "Beginner",
    tags: ["SQL", "Joins"],
    hint: "It returns only the common records between two tables.",
    solution: "INNER JOIN returns only the rows where there is a match in both tables."
  }
];

const PracticeSession = () => {
  const { practiceId } = useParams(); // Get topic from URL params
  const router = useRouter();
  
  const [expandedHint, setExpandedHint] = useState<number | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.push("/practice")}
      >
        <ArrowLeft size={18} /> Back to Practice
      </Button>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">Practicing: {decodeURIComponent(practiceId)}</h1>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-3">{index + 1}. {q.question}</h2>
            <ul className="space-y-1 text-gray-700">
              <li>A. {q.option1}</li>
              <li>B. {q.option2}</li>
              <li>C. {q.option3}</li>
              <li>D. {q.option4}</li>
            </ul>

            {/* Hint Button */}
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => setExpandedHint(expandedHint === q.id ? null : q.id)}
            >
              {expandedHint === q.id ? "Hide Hint" : "Show Hint"}
            </Button>
            {expandedHint === q.id && (
              <p className="mt-2 bg-gray-100 p-3 rounded">{q.hint}</p>
            )}

            {/* Solution Button */}
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setExpandedSolution(expandedSolution === q.id ? null : q.id)}
            >
              {expandedSolution === q.id ? "Hide Solution" : "Show Solution"}
            </Button>
            {expandedSolution === q.id && (
              <p className="mt-2 bg-green-100 p-3 rounded">{q.solution}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeSession;

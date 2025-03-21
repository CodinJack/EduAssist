"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Eye, EyeOff } from "lucide-react";
import { createPracticeQuestions } from "@/services/practiceService";

const PracticeSession = () => {
  const { practiceId } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedHint, setExpandedHint] = useState<number | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const generatedQuestions = await createPracticeQuestions(decodeURIComponent(practiceId));
        console.log("API Response:", generatedQuestions);
        
        if (!generatedQuestions.length) {
          setError("No questions found for this topic.");
          return;
        }

        setQuestions(generatedQuestions);
        setError(null);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to fetch questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [practiceId]);

  if (loading)
    return <p className="text-center text-gray-600 text-lg mt-8 animate-pulse">Loading questions...</p>;
  if (error)
    return <p className="text-center text-red-500 text-lg mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        onClick={() => router.push("/practice")}
      >
        <ArrowLeft size={18} /> Back to Practice
      </Button>

      <h1 className="text-3xl font-bold text-center mb-6">
        Practicing: <span className="text-blue-600">{decodeURIComponent(practiceId)}</span>
      </h1>

      {/* Questions List */}
      <div className="space-y-8 max-w-3xl mx-auto">
        {questions.map((q, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h2 className="font-semibold text-lg mb-4">
              <span className="text-blue-600">{index + 1}.</span> {q.question}
            </h2>

            <ul className="space-y-2">
            {q.options.map((opt: string, i: number) => (
              <li key={i} className="p-3 bg-gray-200 rounded-md text-gray-800">
                <strong className="text-blue-500">{String.fromCharCode(65 + i)}.</strong> {opt}
              </li>
            ))}

            </ul>

            {/* Hint Toggle Button */}
            <button
              className="flex items-center gap-2 mt-4 text-yellow-600 hover:text-yellow-500 transition"
              onClick={() => setExpandedHint(expandedHint === index ? null : index)}
            >
              <Lightbulb size={18} />
              {expandedHint === index ? "Hide Hint" : "Show Hint"}
            </button>
            {expandedHint === index && (
              <p className="mt-2 bg-yellow-100 p-3 rounded-md text-yellow-700">{q.hint}</p>
            )}

            {/* Solution Toggle Button */}
            <button
              className="flex items-center gap-2 mt-4 text-green-600 hover:text-green-500 transition"
              onClick={() => setExpandedSolution(expandedSolution === index ? null : index)}
            >
              {expandedSolution === index ? <EyeOff size={18} /> : <Eye size={18} />}
              {expandedSolution === index ? "Hide Solution" : "Show Solution"}
            </button>
            {expandedSolution === index && (
              <div className="mt-2 bg-green-100 p-3 rounded-md text-green-700">
                <strong>Correct Answer:</strong> {q.correct_answer.toUpperCase()}
                <br />
                <strong>Explanation:</strong> {q.solution}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeSession;

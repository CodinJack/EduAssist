"use client";
import { useQuizStore } from "@/store/quizStore";

interface QuestionProps {
  id: string;
  question: string;
  options: string[];
}

export default function QuizQuestion({ id, question, options }: QuestionProps) {
  const { answers, setAnswer } = useQuizStore();

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-md bg-white text-black">
      <h2 className="text-lg font-semibold">{question}</h2>
      <div className="mt-2">
        {options.map((option) => (
          <button
            key={option}
            className={`block w-full p-2 mt-2 text-left rounded-lg border ${
              answers[id] === option ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setAnswer(id, option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

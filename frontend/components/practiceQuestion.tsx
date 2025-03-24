import React, { useState } from "react";
import { getCookie } from "./utils/cookieUtils"; // Cookie handler
import { Lightbulb, Eye, EyeOff } from "lucide-react"; // Icons

// Define the types
interface Question {
    id: number; // Added ID field to uniquely identify each question
    question: string;
    options: string[];
    hint: string;
    correct_answer: string;
    solution: string;
    remarks: string;
}

interface QuestionCardProps {
    q: Question;
    index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ q, index }) => {
    const [bookmarked, setBookmarked] = useState<boolean | null>(null);
    const [expandedHint, setExpandedHint] = useState<number | null>(null);
    const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

    const handleBookmark = async (question: object) => {
        const apiUrl = "http://localhost:8000/auth/update_bookmarked_questions/";
        const token = getCookie("idToken"); // Read token from cookie

        if (!token) {
            console.error("No token found in cookie.");
            return;
        }
        let payload = {
            question: question,
        };
        console.log("Payload:", payload);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload), // Send the question object directly
            });

            if (response.ok) {
                setBookmarked((prev) => !prev); // Toggle bookmark state

                console.log(`Bookmark for question updated successfully`);
            } else {
                console.error("Failed to update bookmark:", await response.text());
            }
        } catch (error) {
            console.error("Error making bookmark request:", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            {/* Question Header */}
            <h2 className="font-semibold text-lg mb-4 flex justify-between items-center">
                <div>
                    <span className="text-blue-600">{index + 1}.</span> {q.question}
                </div>
                <button
                    className={`transition ${
                        bookmarked ? "text-yellow-500" : "text-gray-500"
                    }`}
                    onClick={() => handleBookmark(q)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill={bookmarked ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                        />
                    </svg>
                </button>
            </h2>

            {/* Options */}
            <ul className="space-y-2">
                {q.options.map((opt: string, i: number) => (
                    <li key={i} className="p-3 bg-gray-200 rounded-md text-gray-800">
                        <strong className="text-blue-500">
                            {String.fromCharCode(65 + i)}.
                        </strong>{" "}
                        {opt}
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
                <p className="mt-2 bg-yellow-100 p-3 rounded-md text-yellow-700">
                    {q.hint}
                </p>
            )}

            {/* Solution Toggle Button */}
            <button
                className="flex items-center gap-2 mt-4 text-green-600 hover:text-green-500 transition"
                onClick={() =>
                    setExpandedSolution(expandedSolution === index ? null : index)
                }
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
    );
};

export default QuestionCard;

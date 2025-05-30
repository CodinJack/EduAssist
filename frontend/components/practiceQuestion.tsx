import { useAuth } from "@/context/AuthContext";
import { bookmarkQuestion, removeBookmarkedQuestion } from "@/services/quizService";
import { Eye, EyeOff, Lightbulb } from "lucide-react"; // Icons
import React, { useEffect, useState } from "react";

// Define the types
interface Question {
    id: number;
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
    const {user} = useAuth();
    // Get userId from cookie or another source
    const [userId, setUserId] = useState();
    useEffect(() => {
        setUserId(user.uid);
    }, [user]);
    // Initialize state variables
    const [isLoading, setIsLoading] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [expandedHint, setExpandedHint] = useState<number | null>(null);
    const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

    const handleBookmark = async () => {
        if (!userId) {
            console.error("User ID is required for bookmarking");
            return;
        }
        
        setIsLoading(true);
        try {
            if (bookmarked) {
                // If already bookmarked, remove it
                const result = await removeBookmarkedQuestion(userId, q.id);
                if (result.success) {
                    setBookmarked(false);
                    console.log(result.message);
                }
            } else {
                // If not bookmarked, add it
                const result = await bookmarkQuestion(userId, q);
                setBookmarked(result.action === "added");
                console.log(result.message);
            }
        } catch (error) {
            console.error("Error handling bookmark:", error);
        } finally {
            setIsLoading(false);
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
                    onClick={handleBookmark}
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
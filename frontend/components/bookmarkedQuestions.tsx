import { bookmarkQuestion } from "@/services/quizService"; // Import the new function
import { Eye, EyeOff, Lightbulb } from "lucide-react";
import React, { useState } from "react";

// Define the types
interface Question {
    id: number;
    question: string;
    options: string[];
    hint: string;
    correct_answer: string;
    solution: string;
    remarks: string;
    quizId?: string; // Optional field that might be needed for the bookmark function
}

interface QuestionCardProps {
    q: Question;
    index: number;
    showBookmark?: boolean; // Optional prop to control bookmark button visibility
    userId?: string; // User ID for bookmarking
}

// Main QuestionCard component that supports bookmarking
const QuestionCard: React.FC<QuestionCardProps> = ({ 
    q, 
    index, 
    showBookmark = true, // Default to showing bookmark button
    userId 
}) => {
    const [bookmarked, setBookmarked] = useState<boolean>(false);
    const [expandedHint, setExpandedHint] = useState<number | null>(null);
    const [expandedSolution, setExpandedSolution] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle bookmarking with the new function
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
            </h2>

            {/* Options - With error handling for when options is not an array */}
            <ul className="space-y-2">
            {q.options && typeof q.options === "object" ? (
                Object.entries(q.options).map(([key, value]) => (
                    <li key={key} className="p-3 bg-gray-200 rounded-md text-gray-800">
                        <strong className="text-blue-500">{key.toUpperCase()}.</strong>{" "}
                        {value}
                    </li>
                ))
            ) : (
                <li className="p-3 bg-gray-100 rounded-md text-gray-600">
                    No options available for this question.
                </li>
            )}

            </ul>

            {/* Hint Toggle Button */}
            <button
                className="flex items-center gap-2 mt-4 text-yellow-600 hover:text-yellow-500 transition"
                onClick={() => setExpandedHint(expandedHint === index ? null : index)}
            >
                <Lightbulb size={18} />
                {expandedHint === index ? "Hide Hint" : "Show Hint"}
            </button>
            {expandedHint === index && q.hints && (
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
                    <strong>Correct Answer:</strong> {q.correct_answer?.toUpperCase() || "Not provided"}
                    <br />
                    <strong>Explanation:</strong> {q.solution || "No explanation available"}
                </div>
            )}
        </div>
    );
};

// Bookmarked Question Card - Reuses the main component with bookmark disabled
export const BookmarkedQuestionCard: React.FC<QuestionCardProps> = (props) => {
    return <QuestionCard {...props} showBookmark={false} />;
};

// Empty state component for when there are no bookmarked questions
export const NoBookmarkedQuestions: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-md text-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mb-4"
                fill="none"
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookmarked Questions</h3>
            <p className="text-gray-500 mb-4">
                You haven't bookmarked any questions yet. Bookmark questions during practice to review them later.
            </p>
        </div>
    );
};

export default QuestionCard;
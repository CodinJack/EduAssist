import { useAuth } from "@/context/AuthContext";
import { bookmarkQuestion, removeBookmarkedQuestion } from "@/services/quizService";
import { Eye, EyeOff, Lightbulb, Bookmark, BookmarkX, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

// Define the types
interface Question {
    id: number;
    question: string;
    options: string[] | Record<string, string>;
    hint?: string;
    hints?: string;
    correct_answer: string;
    solution: string;
    remarks: string;
    quizId?: string;
}

interface QuestionCardProps {
    q: Question;
    index: number;
    showBookmark?: boolean;
    userId?: string;
    onDelete?: () => void;
}

// Main QuestionCard component that supports bookmarking
const QuestionCard: React.FC<QuestionCardProps> = ({ 
    q, 
    index, 
    showBookmark = true,
    onDelete
}) => {
    const router = useRouter();
    const [expandedHint, setExpandedHint] = useState<number | null>(null);
    const [expandedSolution, setExpandedSolution] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState();
    const {user} = useAuth();
    // Handle delete button for bookmarked questions
    const handleDelete = async () => {
        if (!userId) {
            console.error("User ID is required for deleting bookmark");
            return;
        }
        
        setIsLoading(true);
        try {
            const result = await removeBookmarkedQuestion(userId, q.id);
            if (result.success) {
                console.log(result.message);
                if (onDelete) onDelete();
            }
        } catch (error) {
            console.error("Error deleting bookmark:", error);
        } finally {
            setIsLoading(false);
            router.push('/bookmarked')
        }
    };
    useEffect(() => {
      setUserId(user.uid);
    }, [user])
    
    const hint = q.hint || q.hints;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all hover:shadow-xl">
            {/* Question Header with Optional Bookmark/Delete Buttons */}
            <div className="flex justify-between items-start mb-4">
                <h2 className="font-semibold text-lg text-gray-800">
                    <span className="text-blue-600 font-bold mr-2">Q{index + 1}.</span> 
                    {q.question}
                </h2>
                <div className="flex space-x-2">
                    
                    {showBookmark && userId && (
                        <button 
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            title="Remove from bookmarks"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Options with improved styling */}
            <div className="space-y-3 mb-6">
                {Array.isArray(q.options) ? (
                    q.options.map((option, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold mr-3">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                        </div>
                    ))
                ) : q.options && typeof q.options === "object" ? (
                    Object.entries(q.options).map(([key, value]) => (
                        <div key={key} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold mr-3">
                                {key.toUpperCase()}
                            </span>
                            <span>{value}</span>
                        </div>
                    ))
                ) : (
                    <div className="p-4 bg-gray-100 rounded-lg text-gray-600 italic">
                        No options available for this question.
                    </div>
                )}
            </div>

            {/* Action buttons with improved styling */}
            <div className="flex flex-wrap gap-3 mt-4">
                {/* Hint Button */}
                {hint && (
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            expandedHint === index 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                        onClick={() => setExpandedHint(expandedHint === index ? null : index)}
                    >
                        <Lightbulb size={18} />
                        {expandedHint === index ? "Hide Hint" : "Show Hint"}
                    </button>
                )}

                {/* Solution Button */}
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        expandedSolution === index 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    onClick={() => setExpandedSolution(expandedSolution === index ? null : index)}
                >
                    {expandedSolution === index ? <EyeOff size={18} /> : <Eye size={18} />}
                    {expandedSolution === index ? "Hide Solution" : "Show Solution"}
                </button>
            </div>

            {/* Hint Expandable Section */}
            {expandedHint === index && hint && (
                <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800 animate-fadeIn">
                    <h3 className="font-semibold text-yellow-700 mb-2">Hint</h3>
                    <p>{hint}</p>
                </div>
            )}

            {/* Solution Expandable Section */}
            {expandedSolution === index && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200 text-green-800 animate-fadeIn">
                    <h3 className="font-semibold text-green-700 mb-2">Solution</h3>
                    <div className="mb-2">
                        <span className="font-semibold">Correct Answer: </span>
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-green-100 text-green-800 rounded-md font-bold">
                            {q.correct_answer?.toUpperCase() || "Not provided"}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Explanation: </span>
                        <p className="mt-1">{q.solution || "No explanation available"}</p>
                    </div>
                    {q.remarks && (
                        <div className="mt-3">
                            <span className="font-semibold">Remarks: </span>
                            <p className="mt-1">{q.remarks}</p>
                        </div>
                    )}
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
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg text-center border border-gray-200">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <BookmarkX size={36} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookmarked Questions</h3>
            <p className="text-gray-500 max-w-md">
                You haven't bookmarked any questions yet. Bookmark questions during practice to review them later.
            </p>
        </div>
    );
};

// Add some CSS to the global stylesheet for animation
const addGlobalStyles = () => {
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
};

// Call this function when the component mounts
if (typeof window !== 'undefined') {
    addGlobalStyles();
}

export default QuestionCard;
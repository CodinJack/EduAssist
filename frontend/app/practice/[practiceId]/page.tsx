"use client";
import { Button } from "@/components/ui/button";
import { createPracticeQuestions } from "@/services/practiceService";
import { bookmarkQuestion } from "@/services/quizService"; // Import the bookmarkQuestion function
import { getAuth } from "firebase/auth"; // Import Firebase auth to get current user
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import QuestionCard from "../../../components/practiceQuestion";

const PracticeSession = () => {
    const { practiceId } = useParams();
    const router = useRouter();
    const auth = getAuth(); // Initialize Firebase auth

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<{
        [key: string]: boolean;
    }>({});

    const handleNavigation = (path: string) => {
        startTransition(() => {
            router.push(path);
        });
    };

    // Function to handle bookmarking using the Firebase function
    const handleBookmark = async (question: any) => {
        const user = auth.currentUser;
        
        if (!user) {
            toast.error("You must be logged in to bookmark questions", {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: "#FF4B4B",
                    color: "white",
                },
            });
            return;
        }

        try {
            // Make sure question has an ID (use existing or create one)
            const questionWithId = {
                ...question,
                id: question.id || `${practiceId}_q${Date.now()}`,
                quizId: practiceId
            };
            
            // Call the Firebase bookmarking function
            const result = await bookmarkQuestion(user.uid, questionWithId);
            
            // Update local state based on the result
            setBookmarkedQuestions(prev => ({
                ...prev,
                [questionWithId.id]: result.action === "added"
            }));
            
            // Show success toast
            toast.success(result.message, {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: result.action === "added" ? "#10B981" : "#6B7280",
                    color: "white",
                },
            });
            
        } catch (error: any) {
            console.error("Error bookmarking question:", error);
            toast.error(error.message || "Failed to bookmark question", {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: "#FF4B4B",
                    color: "white",
                },
            });
        }
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const generatedQuestions = await createPracticeQuestions(
                    decodeURIComponent(practiceId as string)
                );

                if (!generatedQuestions || !generatedQuestions.length) {
                    toast.error("Cannot make practice questions on this topic!", {
                        duration: 3000,
                        position: 'top-right',
                        style: {
                            background: "#FF4B4B",
                            color: "white",
                        },
                    });
                    handleNavigation('/practice');
                    return;
                }

                // Add IDs to questions if they don't have them
                const questionsWithIds = generatedQuestions.map((q, index) => ({
                    ...q,
                    id: q.id || `${practiceId}_q${index}`
                }));

                setQuestions(questionsWithIds);
                setError(null);
            } catch (err) {
                setError("Failed to fetch questions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [practiceId]);

    // Check if questions are already bookmarked on component mount
    useEffect(() => {
        const checkBookmarkedStatus = async () => {
            const user = auth.currentUser;
            if (!user || !questions.length) return;
            
            try {
                // Import Firebase functions
                const { doc, getDoc } = await import("firebase/firestore");
                const { db } = await import("@/firebaseConfig");
                
                // Get user document
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists() && userDoc.data().bookmarkedQuestions) {
                    const bookmarkedIds = userDoc.data().bookmarkedQuestions.map(q => q.id);
                    
                    // Create a map of question IDs to bookmark status
                    const bookmarkStatus = {};
                    questions.forEach(q => {
                        bookmarkStatus[q.id] = bookmarkedIds.includes(q.id);
                    });
                    
                    setBookmarkedQuestions(bookmarkStatus);
                }
            } catch (error) {
                console.error("Error checking bookmarked status:", error);
            }
        };
        
        checkBookmarkedStatus();
    }, [questions]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-400 border-dashed rounded-full animate-spin"></div>
                    <p className="text-lg text-gray-600 font-medium">Cooking up questions for you...</p>
                </div>
            </div>              
        );
    if (error) return <p className="text-center text-red-500 text-lg mt-8">{error}</p>;

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
                Practicing:{" "}
                <span className="text-blue-600">{decodeURIComponent(practiceId as string)}</span>
            </h1>
            {isPending && (
                <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                </div>
            )}
            {/* Questions List */}
            <div className="space-y-8 max-w-3xl mx-auto">
                {questions.map((q, index) => (
                    <QuestionCard 
                        key={q.id || index} 
                        q={q} 
                        index={index}
                        isBookmarked={bookmarkedQuestions[q.id] || false}
                        onBookmark={() => handleBookmark(q)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PracticeSession;
"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Eye, EyeOff } from "lucide-react";
import { createPracticeQuestions } from "@/services/practiceService";
import QuestionCard from "../../../components/practiceQuestion";
import { toast } from "react-hot-toast";
const PracticeSession = () => {
    const { practiceId } = useParams();
    const router = useRouter();

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleNavigation = (path: string) => {
        startTransition(() => {
            router.push(path);
        });
    };
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const generatedQuestions = await createPracticeQuestions(
                    decodeURIComponent(practiceId)
                );

                if (!generatedQuestions.length) {
                    toast.error("Cannot make a practice questions on this topic!!", {
                        duration: 3000,
                        position : 'top-right',
                        style: {
                          background: "red",
                          color: "white",
                        },
                    });
                    handleNavigation('/practice');
                }

                setQuestions(generatedQuestions);
                setError(null);
            } catch (err) {
                setError("Failed to fetch questions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [practiceId]);

    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
    };

    // const [bookmarked, setBookmarked] = useState<boolean>(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<{
        [key: number]: boolean;
    }>({});
    const handleBookmark = async (id: number, question: object) => {
        const apiUrl = "http://localhost:8000/auth/update_bookmarked_questions/";
        const token = getCookie("idToken"); // Read token from cookie

        if (!token) {
            console.error("No token found in cookie.");
            return;
        }

        console.log("Payload:", question);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(question),
            });

            if (response.ok) {
                setBookmarkedQuestions((prev) => ({
                    ...prev,
                    [id]: !prev[id], // Toggle the bookmark state for the specific ID
                }));
                console.log(`Bookmark for question ${id} updated successfully`);
            } else {
                console.error("Failed to update bookmark:", await response.text());
            }
        } catch (error) {
            console.error("Error making bookmark request:", error);
        }
    };

    if (loading)
        return (
            <p className="text-center text-gray-600 text-lg mt-8 animate-pulse">
                Loading questions...
            </p>
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
                <span className="text-blue-600">{decodeURIComponent(practiceId)}</span>
            </h1>
            {isPending && (
                <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                </div>
            )}
            {/* Questions List */}
            <div className="space-y-8 max-w-3xl mx-auto">
                {questions.map((q, index) => (
                    <QuestionCard key={index} q={q} index={index} />
                ))}
            </div>
        </div>
    );
};

export default PracticeSession;

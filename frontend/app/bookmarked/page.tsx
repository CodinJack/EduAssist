"use client";
import React, { useState, useEffect } from "react";
import { BookMarked } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/SideBar";
import QuestionCard from "../../components/practiceQuestion";
import { useAuth } from "@/context/AuthContext";

const BookmarkedQuestionsPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isClient, setIsClient] = useState(false); // ✅ Ensure client-side rendering
    const [error, setError] = useState(null);

    const { user, loading } = useAuth();

    // ✅ Ensure client-side rendering to avoid flicker
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (!user || !user.details || !user.details.firestore_user) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    const firestoreUser = user.details.firestore_user;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content */}
            <div className={`p-8 flex-1 transition-all ${collapsed ? "ml-16" : "ml-64"}`}>
                {/* Page Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                        <BookMarked size={32} /> Bookmarked Questions
                    </h1>
                </div>

                {/* Bookmarked Questions */}
                <div className="mt-8">
                    <div className="space-y-8 max-w-3xl mx-auto">
                        {firestoreUser?.bookmarked_questions?.length > 0 ? (
                            firestoreUser?.bookmarked_questions.map((q, index) => (
                                <QuestionCard key={index} q={q} index={index} />
                            ))
                        ) : (
                            <p className="text-gray-600">
                                No bookmarked questions found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookmarkedQuestionsPage;

"use client";
import QuestionCard from "@/components/bookmarkedQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookMarked, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BookmarkedQuestion {
  id?: string; // Optional if some don't have an id
  question: string;
  options: any[]; // Changed from [] to any[]
  correct_answer: string; 
  solution: string;
  remarks: string; // Changed from String to string
  [key: string]: any; // Allow extra properties passed to QuestionCard
}

const BookmarkedQuestionsPage = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<BookmarkedQuestion[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const bookmarkedQuestions: BookmarkedQuestion[] = Array.isArray(user?.bookmarkedQuestions)
      ? user.bookmarkedQuestions
      : [];

    const filtered = bookmarkedQuestions.filter((q) =>
      q.question?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredQuestions(filtered);
  }, [searchQuery, user?.bookmarkedQuestions]);

  if (!isClient || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 bg-gray-100 animate-pulse"></div>
        <div className="flex-1 p-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg mb-4 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to view your bookmarked questions.</p>
            <Button onClick={() => router.push("/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasBookmarks = user.bookmarkedQuestions?.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="p-6 md:p-8 flex-1 ml-16">
        <div className="bg-white p-5 rounded-xl shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                onClick={() => router.push("/profile")}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-1">Back</span>
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center gap-2">
                <BookMarked className="w-6 h-6 md:w-8 md:h-8" />
                Bookmarked Questions
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {hasBookmarks ? (
            <>
              <div className="mb-4 text-sm text-gray-500">
                {filteredQuestions.length}{" "}
                {filteredQuestions.length === 1 ? "question" : "questions"} bookmarked
              </div>

              <div className="space-y-6">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question, index) => (
                    <QuestionCard key={question.id ?? index} q={question} index={index} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No questions match your search.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <Card className="mt-8">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <BookMarked className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Bookmarks Yet</h3>
                <p className="text-gray-500 text-center mb-6">
                  You haven't bookmarked any questions yet. Bookmark questions during quizzes to review them later.
                </p>
                <Button onClick={() => router.push("/quiz")}>Browse Quizzes</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkedQuestionsPage;
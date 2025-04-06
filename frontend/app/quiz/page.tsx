"use client";
import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/dashboard/SideBar";
import { useAuth } from "@/context/AuthContext";
import { createQuiz, getAllQuizzes, deleteQuiz } from "@/services/quizService";

// Import our new components
import QuizCard from "@/components/quiz/QuizCard";
import CreateQuizModal from "@/components/quiz/CreateQuizModal";
import EmptyQuizState from "@/components/quiz/EmptyQuizState";
import QuizSearchBar from "@/components/quiz/QuizSearchBar";

const QuizList = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const [newQuiz, setNewQuiz] = useState({
    topic: "",
    difficulty: "Beginner",
    questionCount: 10,
  });

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  const getDifficultyNumber = (difficulty: string) => {
    const vals: Record<string, number> = {
      Beginner: 2,
      Intermediate: 2.5,
      Advanced: 3,
    };
    return vals[difficulty];
  };

  const fetchQuizzes = async () => {
    if (user) {
      const quizlist = await getAllQuizzes(user.uid);
      console.log(quizlist);
      if (quizlist) setQuizzes(quizlist);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
      fetchQuizzes();
    }
  }, [user]);

  const handleStartQuiz = (quizId: string) => {
    handleNavigation(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = async () => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.", {
        position: "top-center",
      });
      return;
    }

    if (newQuiz.questionCount < 1 || newQuiz.questionCount > 50) {
      toast.error("Number of questions must be between 1 and 50.", {
        position: "top-center",
      });
      return;
    }

    if (!newQuiz.topic.trim()) {
      toast.error("Please enter a quiz topic.", {
        position: "top-center",
      });
      return;
    }

    toast.success("Cooking up a quiz...", {
      duration: 10000,
      position: "top-center",
      style: {
        background: "#9b87f5",
        color: "white",
        borderRadius: "10px",
      },
      icon: "🧠",
    });

    try {
      const timeLimit =
        newQuiz.questionCount * getDifficultyNumber(newQuiz.difficulty);

      // Use quizService's createQuiz function
      const result = await createQuiz({
        topic: newQuiz.topic,
        difficulty: newQuiz.difficulty,
        numQuestions: newQuiz.questionCount,
        timeLimit,
        userId,
      });

      // Optionally, you can log or process the result:
      console.log("Quiz created:", result);

      setIsModalOpen(false);
      setNewQuiz({ topic: "", difficulty: "Beginner", questionCount: 10 });

      // Refresh the quizzes list
      startTransition(() => {
        fetchQuizzes();
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Cannot create a quiz on this topic!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "white",
          borderRadius: "10px",
        },
      });
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.", {
        position: "top-center",
      });
      return;
    }

    try {
      await deleteQuiz(quizId); // Call the deleteQuiz function
      toast.success("Quiz deleted successfully", {
        position: "top-center",
      });
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Could not delete quiz", {
        position: "top-center",
      });
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {isPending && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      
      <div
        className={`transition-all duration-500 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-quiz-purple mr-2" />
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-quiz-purple to-quiz-blue text-transparent bg-clip-text">
                  My Quizzes
                </h1>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-quiz-purple to-quiz-blue text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all animated-gradient-button"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Create Quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <QuizSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          {/* Quiz List */}
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quiz-purple"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-red-500 text-lg">{error}</p>
                <Button
                  onClick={() => fetchQuizzes()}
                  className="mt-4 bg-quiz-purple text-white"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              searchQuery ? (
                <div className="text-center p-12">
                  <h3 className="text-xl font-medium text-gray-700">No results found</h3>
                  <p className="text-gray-500 mt-2">
                    We couldn't find any quizzes matching "{searchQuery}"
                  </p>
                </div>
              ) : (
                <EmptyQuizState onCreateQuiz={() => setIsModalOpen(true)} />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onStartQuiz={handleStartQuiz}
                    onDeleteQuiz={handleDeleteQuiz}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateQuiz}
        newQuiz={newQuiz}
        setNewQuiz={setNewQuiz}
      />
    </div>
  );
};

export default QuizList;

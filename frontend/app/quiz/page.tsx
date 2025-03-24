"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Clock,
  BookOpen,
  Star,
  Timer,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/dashboard/SideBar";
import Cookies from "js-cookie";

const QuizList = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search Query State

  const BASE_URL = "http://127.0.0.1:8000";
  const getDifficultyNumber = (difficulty: string) => {
    const vals: Record<string, number> = {
      Beginner: 2,
      Intermediate: 2.5,
      Advanced: 3,
    };
    return vals[difficulty];
  };
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Beginner: "text-green-600 bg-green-50",
      Intermediate: "text-orange-600 bg-orange-50",
      Advanced: "text-red-600 bg-red-50",
    };
    return colors[difficulty] || "text-gray-600 bg-gray-50";
  };
  const [newQuiz, setNewQuiz] = useState({
    topic: "",
    difficulty: "Beginner",
    questionCount: 10,
  });
 
  const fetchUserAndQuizzes = async () => {
    try {
      const token = Cookies.get("idToken");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const userResponse = await fetch(`${BASE_URL}/auth/get_user_from_cookie/`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user data");

      const user = await userResponse.json();
      if (!user.userID) {
        console.error("User ID not found in response");
        return;
      }

      setUserId(user.userID);

      const quizzesResponse = await fetch(`${BASE_URL}/api/quizzes/get_all_quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userID }),
      });

      if (!quizzesResponse.ok) throw new Error("Failed to fetch quizzes");

      const quizzesData = await quizzesResponse.json();
      setQuizzes(quizzesData);
    } catch (err) {
      setError("Failed to load quizzes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndQuizzes();
  }, []);

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };
  const handleCreateQuiz = async () => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
  
    if (newQuiz.questionCount < 1 || newQuiz.questionCount > 50) {
      alert("Number of questions must be between 1 and 50.");
      return;
    }
  
    try {
      const timeLimit = newQuiz.questionCount * getDifficultyNumber(newQuiz.difficulty);
  
      const response = await fetch(`${BASE_URL}/api/quizzes/create_quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: newQuiz.topic,
          difficulty: newQuiz.difficulty,
          numQuestions: newQuiz.questionCount,
          timeLimit,
          userId,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }  
      setIsModalOpen(false);
      setNewQuiz({ topic: "", difficulty: "Beginner", questionCount: 10 });
      await fetchUserAndQuizzes();
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };
  
 
  const handleDeleteQuiz = async (quizId: string) => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/quizzes/delete_quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: quizId }),
      });

      if (!response.ok) throw new Error("Failed to delete quiz");

      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
        <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="w-4 h-4" /> Create New Quiz
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-8 flex items-center gap-2">
          <Input
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button onClick={() => setSearchQuery("")}>
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-8">
          {loading ? (
            <p>Loading quizzes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes
                .filter((quiz) =>
                  quiz.topic.toLowerCase().includes(searchQuery.toLowerCase()) 
                )
                .map((quiz) => (
                  <Card key={quiz.id} className="shadow-md rounded-lg border hover:shadow-lg transition-all bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{quiz.topic || quiz.title}</h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span>{quiz.numQuestions} Questions</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>{quiz.timeLimit} mins</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="w-full" onClick={() => handleStartQuiz(quiz.id)}>
                          Start Quiz
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full flex items-center justify-center"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Create a New Quiz</h2>
                <Input
                  placeholder="Quiz Topic"
                  value={newQuiz.topic}
                  className="mt-3 mb-3"
                  onChange={(e) => setNewQuiz({ ...newQuiz, topic: e.target.value })}
                />
                <Select value={newQuiz.difficulty} onValueChange={(val) => setNewQuiz({ ...newQuiz, difficulty: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Number of Questions"
                  value={newQuiz.questionCount}
                  className="mt-3"
                  onChange={(e) => setNewQuiz({ ...newQuiz, questionCount: Number(e.target.value) })}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button className="ml-2 bg-blue-600 hover:bg-blue-700" onClick={() => {handleCreateQuiz()}}>Create</Button>
                </div>
              </div>
            </div>
          )}
 
        </div>
      </div>
    </div>
  );
};

export default QuizList;

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
import { createQuiz, getAllQuizzes } from "@/services/quizService";
import Cookies from "js-cookie";

const QuizList = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    topic: "",
    difficulty: "Beginner",
    questionCount: 10,
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (err) {
        setError("Failed to load quizzes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);
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

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = async () => {
    if (newQuiz.questionCount < 1 || newQuiz.questionCount > 50) {
      alert("Number of questions must be between 1 and 50.");
      return;
    }

    try {
      const timeLimit = newQuiz.questionCount * getDifficultyNumber(newQuiz.difficulty);
      const createdQuiz = await createQuiz(newQuiz.topic, newQuiz.difficulty, newQuiz.questionCount, timeLimit);
      setQuizzes([...quizzes, createdQuiz]);
      setIsModalOpen(false);
      setNewQuiz({ topic: "", difficulty: "Beginner", questionCount: 10 });
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="w-4 h-4" /> Create New Quiz
          </Button>
        </div>

        {/* Filters */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex gap-4">
              <div className="w-64">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-64">
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <Input placeholder="Search quizzes..." className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{quiz.topic}</h3>
                      <p className="text-sm text-gray-500">{quiz.subject}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600" onClick={() => handleStartQuiz(quiz.id)}>
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Create Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Quiz</h2>
            <Input
              placeholder="Enter topic"
              className="mb-3"
              value={newQuiz.topic}
              onChange={(e) => setNewQuiz({ ...newQuiz, topic: e.target.value })}
            />
            <Select value={newQuiz.difficulty} onValueChange={(val) => setNewQuiz({ ...newQuiz, difficulty: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="1"
              max="50"
              placeholder="Number of Questions"
              className="mt-3"
              value={newQuiz.numQuestions}
              onChange={(e) => setNewQuiz({ ...newQuiz, numQuestions: parseInt(e.target.value) })}
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateQuiz}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;

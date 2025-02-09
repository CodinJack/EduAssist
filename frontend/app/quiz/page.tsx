"use client"
import React, { useState } from 'react';
import {
  Users,
  Search,
  Clock,
  BookOpen,
  Star,
  Timer,
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
import Sidebar from '@/components/dashboard/Sidebar';

const quizzes = [
  {
    id: 1,
    title: "Introduction to React Fundamentals",
    subject: "Web Development",
    questionCount: 15,
    timeLimit: 30,
    difficulty: "Intermediate",
    dueDate: "2025-02-15",
    completions: 45,
    avgScore: 85,
  },
  {
    id: 2,
    title: "Advanced Mathematics: Calculus",
    subject: "Mathematics",
    questionCount: 20,
    timeLimit: 45,
    difficulty: "Advanced",
    dueDate: "2025-02-20",
    completions: 32,
    avgScore: 78,
  },
  {
    id: 3,
    title: "World History: Ancient Civilizations",
    subject: "History",
    questionCount: 25,
    timeLimit: 40,
    difficulty: "Beginner",
    dueDate: "2025-02-18",
    completions: 67,
    avgScore: 92,
  },
  {
    id: 4,
    title: "Physics: Quantum Mechanics",
    subject: "Science",
    questionCount: 18,
    timeLimit: 35,
    difficulty: "Advanced",
    dueDate: "2025-02-22",
    completions: 28,
    avgScore: 75,
  }
];

const QuizList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: "text-green-600 bg-green-50",
      Intermediate: "text-orange-600 bg-orange-50",
      Advanced: "text-red-600 bg-red-50"
    };
    return colors[difficulty] || "text-gray-600 bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Reuse the Sidebar component */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        collapsed ? "ml-20" : "ml-64"
      }`}>
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create New Quiz
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
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="webdev">Web Development</SelectItem>
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
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <Input 
                    placeholder="Search quizzes..." 
                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
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
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-500">{quiz.subject}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{quiz.questionCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{quiz.timeLimit} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{quiz.completions} Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{quiz.avgScore}% Avg Score</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Due {new Date(quiz.dueDate).toLocaleDateString()}
                    </div>
                    <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600">
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizList;
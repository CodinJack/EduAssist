"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flag,
  BookOpen,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Cookies from "js-cookie";

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const router = useRouter();
  const { quizId } = params;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = Cookies.get("idToken");
        if (!token) {
          console.error("No token found in cookies");
          return;
        }
  
        const response = await fetch("http://127.0.0.1:8000/auth/get_user_from_cookie", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
        setUserId(data.userID);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
  
    fetchUserId();
  }, []);
  
  useEffect(() => {
    // Fetch quiz questions from Firebase
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/get_quiz/${quizId}`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateAsIAnswer = async (questionId: string, optionId: string) => {
    if (!userId) return;

    try {
      await fetch(`/api/quizzes/update-answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, questionId, attemptedOption: optionId, userId }),
      });
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    updateAsIAnswer(questionId, optionId);
  };

  const submitQuiz = async () => {
    if (!userId) return;

    try {
      await fetch(`/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers, userId }),
      });
      router.push(`/quiz/${quizId}/result`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!questions.length) return <p>Loading...</p>;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="bg-slate-50 py-4 px-4 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">React Quiz</h1>
              <p className="text-sm text-gray-500 mt-1">Test your knowledge</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-500">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">Question {currentIndex + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${flagged[currentQuestion.id] ? "text-yellow-500" : "text-gray-400"}`}
                    onClick={() => setFlagged((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}>
                    <Flag className="w-5 h-5" />
                  </Button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{currentQuestion.question}</h2>
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, option.id)}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option.id ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"
                      }`}>
                      {selectedAnswer === option.id && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`${selectedAnswer === option.id ? "text-blue-700" : "text-gray-700"}`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex((prev) => prev - 1)}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" className="text-red-600" onClick={() => setShowExitDialog(true)}>
              Exit Quiz
            </Button>
            <Button onClick={() => (currentIndex < questions.length - 1 ? setCurrentIndex((prev) => prev + 1) : submitQuiz())}>
              {currentIndex < questions.length - 1 ? "Next" : "Submit Quiz"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

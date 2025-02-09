"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  Flag,
  BookOpen,
  Timer
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const questions = [
  {
    id: "1",
    question: "What is the main architectural pattern used in modern React applications?",
    explanation: "This pattern helps organize code and manage data flow effectively.",
    options: [
      { id: "a", text: "MVC (Model-View-Controller)" },
      { id: "b", text: "Flux/Redux Architecture", correct: true },
      { id: "c", text: "MVVM (Model-View-ViewModel)" },
      { id: "d", text: "Layered Architecture" }
    ]
  },
  {
    id: "2",
    question: "Which hook is used to perform side effects in React components?",
    explanation: "This hook is essential for data fetching and DOM manipulation.",
    options: [
      { id: "a", text: "useState" },
      { id: "b", text: "useContext" },
      { id: "c", text: "useEffect", correct: true },
      { id: "d", text: "useReducer" }
    ]
  },
  {
    id: "3",
    question: "What is the purpose of the 'key' prop in React lists?",
    explanation: "Keys help React identify which items have changed, been added, or been removed.",
    options: [
      { id: "a", text: "To style list items" },
      { id: "b", text: "For accessibility purposes" },
      { id: "c", text: "To sort list items" },
      { id: "d", text: "To help React track list items", correct: true }
    ]
  }
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const router = useRouter();

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const toggleFlag = (questionId) => {
    setFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/quiz/1/result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className=" bg-slate-50 py-4 px-4 sm:px-4 lg:px-6">
      {/* Quiz Header */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">React Fundamentals Quiz</h1>
              <p className="text-sm text-gray-500 mt-1">Test your knowledge of React concepts</p>
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

          {/* Progress Bar */}
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
                    className={`${flagged[currentQuestion.id] ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => toggleFlag(currentQuestion.id)}
                  >
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
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, option.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option.id 
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option.id && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`${
                      selectedAnswer === option.id ? 'text-blue-700' : 'text-gray-700'
                    }`}>
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
          <Button
            variant="outline"
            className="gap-2"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowExitDialog(true)}
            >
              Exit Quiz
            </Button>
            
            {currentIndex < questions.length - 1 ? (
              <Button 
                className="gap-2"
                onClick={() => setCurrentIndex(prev => prev + 1)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => router.push('/quiz/1/result')}
              >
                Submit Quiz <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit? Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => router.push('/quizzes')}
            >
              Exit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
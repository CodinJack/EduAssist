"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Timer,
  AlertCircle,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getQuizById, updateAnswer, bookmarkQuestion } from "@/services/quizService";
import {toast}  from 'react-hot-toast';

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const router = useRouter();
  const { quizId } = use(params);
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("Quiz");
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Fetch quiz questions from Firebase
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await getQuizById(quizId);
        console.log(data);
        if (data && data.questions) {
          setQuestions(data.questions);
          setQuizTitle(data.title || "Quiz");
          
          // Set timer based on quiz timeLimit
          if (data.timeLimit) {
            setTimeLeft(data.timeLimit * 60);
          } else {
            setTimeLeft(300); // Default to 5 minutes if no timeLimit specified
          }
          
          // Load any saved answers
          const savedAnswers: Record<number, string> = {};
          data.questions.forEach((question: any, index: number) => {
            if (question.attempted_option) {
              savedAnswers[index] = question.attempted_option;
            }
          });
          setAnswers(savedAnswers);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    // Only start timer when timeLeft is set and questions are loaded
    if (timeLeft <= 0 || questions.length === 0) return;
    
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
  }, [timeLeft, questions]);
  
  const handleAnswer = async (questionIndex: number, optionId: string) => {
    if (!user) return;

    // Update UI immediately
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: optionId,
    }));

    try {
      await updateAnswer(quizId, questionIndex, optionId);
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };
  
  const handleExit = () => {
    router.push(`/quiz`);
  };

  const handleBookmark = async (questionIndex: number) => {
    if (!user) return;
    
    const questionId = questions[questionIndex].id || `question_${questionIndex}`;
    const questionToBookmark = {
      ...questions[questionIndex],
      quizId,
      quizTitle
    };
    
    try {
      // Update UI immediately
      setBookmarked(prev => ({
        ...prev,
        [questionId]: !prev[questionId]
      }));
      
      await bookmarkQuestion(user.uid, questionToBookmark);
      
      toast({
        title: bookmarked[questionId] ? "Bookmark removed" : "Question bookmarked",
        description: bookmarked[questionId] 
          ? "Question removed from your bookmarks" 
          : "You can review this question later in your bookmarks",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error bookmarking question:", error);
      toast({
        title: "Error",
        description: "Failed to bookmark question. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
      
      // Revert UI state on error
      setBookmarked(prev => ({
        ...prev,
        [questionId]: !prev[questionId]
      }));
    }
  };

  const submitQuiz = () => {
    // Check if all questions are attempted
    if (Object.keys(answers).length < questions.length) {
      setShowValidationMessage(true);
      
      // Auto-hide the message after 3 seconds
      setTimeout(() => {
        setShowValidationMessage(false);
      }, 3000);
      
      return;
    }
    
    // All questions are attempted, proceed to results
    router.push(`/quiz/${quizId}/result`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-center mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6 text-center">
            We couldn't find the quiz you're looking for. It may have been removed or the ID is incorrect.
          </p>
          <Button 
            className="w-full" 
            onClick={() => router.push('/quiz')}
          >
            Return to Quiz List
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex]; 
  const questionId = currentQuestion.id || `question_${currentIndex}`;

  // Get option entries from the options object
  const optionEntries = currentQuestion.options 
    ? Object.entries(currentQuestion.options).sort((a, b) => a[0].localeCompare(b[0])) 
    : [];

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const unansweredCount = questions.length - Object.keys(answers).length;

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quizTitle}</h1>
                <p className="text-sm text-gray-500 mt-1">Test your knowledge</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
                  <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-orange-500'}`}>
                    {formatTime(timeLeft)}
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
          </CardContent>
        </Card>

        {/* Validation Message */}
        {showValidationMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 animate-fadeIn">
            <AlertCircle className="w-5 h-5" />
            <span>Please attempt all questions before submitting. {unansweredCount} question(s) remain unanswered.</span>
          </div>
        )}

        {/* Question Card */}
        <Card className="mb-6 shadow-lg border-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Question {currentIndex + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${bookmarked[questionId] ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-500"}`}
                    onClick={() => handleBookmark(currentIndex)}>
                    <Bookmark className={`w-5 h-5 ${bookmarked[questionId] ? "fill-yellow-500" : ""}`} />
                    <span className="ml-1 text-sm">
                      {bookmarked[questionId] ? "Bookmarked" : "Bookmark"}
                    </span>
                  </Button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{currentQuestion.question}</h2>
              </div>
            </div>

            <div className="space-y-4">
              {optionEntries.map(([key, value]) => (
                <button
                  key={key}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === key
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleAnswer(currentIndex, key)}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === key ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"
                      }`}>
                      {selectedAnswer === key && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`${selectedAnswer === key ? "font-medium text-blue-700" : "text-gray-700"}`}>
                      {key.toUpperCase()}: {value}
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
            disabled={currentIndex === 0} 
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="shadow-sm hover:shadow"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm"
              onClick={handleExit}
            >
              Exit Quiz
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 shadow-sm"
              onClick={() => (currentIndex < questions.length - 1 ? setCurrentIndex((prev) => prev + 1) : submitQuiz())}
            >
              {currentIndex < questions.length - 1 ? "Next" : "Submit Quiz"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
        
        {/* Progress indicators */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${idx === currentIndex 
                    ? 'bg-blue-600 text-white' 
                    : answers[idx] 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
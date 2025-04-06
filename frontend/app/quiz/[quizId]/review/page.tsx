'use client';

import React, { useEffect, useState, use, useTransition } from 'react';
import { getQuizReviewById } from '@/services/quizService';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ReviewPage = ({ params }: { params: Promise<{ quizId: string }> }) => {
  const [quizData, setQuizData] = useState(null);
  const { quizId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };
  useEffect(() => {
    getQuizReviewById(quizId).then((data) => {
      if (!data) {
        setLoading(false);
        return;
      }
      console.log("Quiz data:", data);
      setQuizData(data);
      setLoading(false);
    });
  }, [quizId]);

  const goToNextQuestion = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!quizData) return (
    <div className="text-center py-10 px-4">
      <h2 className="text-2xl font-bold text-red-600">No quiz data found</h2>
      <p className="mt-4">The requested quiz review could not be found.</p>
    </div>
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp instanceof Object && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return 'Invalid timestamp';
  };

  // Calculate progress percentage
  const progressPercentage = quizData.questions ? 
    ((currentQuestion + 1) / quizData.questions.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Review</h1>
      {isPending && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        onClick={() => handleNavigation(`/quiz/${quizId}/result`)}
                    >
                        <ArrowLeft size={18} /> Back to Results
                    </Button>
        
      {/* Quiz Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2"><span className="font-semibold">Topic:</span> {quizData.topic}</p>
            <p className="mb-2"><span className="font-semibold">Difficulty:</span> {quizData.difficulty}</p>
            <p className="mb-2"><span className="font-semibold">Completed At:</span> {formatTime(quizData.completedAt)}</p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-semibold">Score:</span> {quizData.score} / {quizData.numQuestions}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Time Limit:</span> {quizData.timeLimit} minutes
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question Navigation Counter */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousQuestion} 
          disabled={currentQuestion === 0}
          className={`flex items-center ${currentQuestion === 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>
        
        <span className="font-medium">
          Question {currentQuestion + 1} of {quizData.questions?.length || 0}
        </span>
        
        <button 
          onClick={goToNextQuestion} 
          disabled={!quizData.questions || currentQuestion >= quizData.questions.length - 1}
          className={`flex items-center ${!quizData.questions || currentQuestion >= quizData.questions.length - 1 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
        >
          Next <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Question Card */}
      {quizData.questions && quizData.questions[currentQuestion] && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            {quizData.questions[currentQuestion].text || quizData.questions[currentQuestion].question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mt-4">
              {quizData.questions[currentQuestion].options &&
                typeof quizData.questions[currentQuestion].options === "object" &&
                Object.entries(quizData.questions[currentQuestion].options).map(([key, value], index) => {
                    const selectedOption = quizData.questions[currentQuestion].attempted_option;
                    const correctOption = quizData.questions[currentQuestion].correct_answer;
                  
                    const isSelected = selectedOption === key;
                    const isCorrect = correctOption === key;
                  
                    let bgColor = "bg-white";
                    if (isSelected) {
                      bgColor = isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500";
                    } else if (isCorrect) {
                      bgColor = "bg-green-50 border-green-300";
                    }
                  
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border ${bgColor} flex items-start`}
                      >
                        <div className="mr-2 mt-0.5 flex-shrink-0">
                          {isSelected && isCorrect && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">✓</span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">✗</span>
                          )}
                          {!isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs">{String.fromCharCode(65 + index)}</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          {typeof value === 'object' ? JSON.stringify(value) : value}
                        </div>
                      </div>
                    );
                  })
                  
            }
          </div>

          {/* Explanation if available */}
          {quizData.questions[currentQuestion].explanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Explanation:</h4>
              <p className="text-blue-900">{quizData.questions[currentQuestion].explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
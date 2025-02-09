"use client";

import { useQuizStore } from "@/store/quizStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import ResultCard from "@/components/ResultCard";
import { ArrowLeft, Award, BarChart, Brain, Clock, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const correctAnswers = {
  "1": "4",
  "2": "Paris",
  "3": "Guido van Rossum",
};

const getPerformanceMessage = (percentage) => {
  if (percentage === 100) return "Perfect Score! Outstanding!";
  if (percentage >= 80) return "Excellent Work!";
  if (percentage >= 60) return "Good Job!";
  if (percentage >= 40) return "Nice Try!";
  return "Keep Practicing!";
};

const getPerformanceBadge = (percentage) => {
  if (percentage === 100) return "🏆";
  if (percentage >= 80) return "🥇";
  if (percentage >= 60) return "🥈";
  if (percentage >= 40) return "🥉";
  return "💪";
};

export default function QuizResult() {
  const router = useRouter();
  const { answers } = useQuizStore();
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [analytics, setAnalytics] = useState({
    correctCount: 0,
    incorrectCount: 0,
    percentage: 0,
    timeSpent: "2:30", // This could be tracked in real-time
    averageTimePerQuestion: "0:50"
  });

  useEffect(() => {
    let correctCount = 0;
    Object.entries(correctAnswers).forEach(([questionId, correctAnswer]) => {
      if (answers[questionId] === correctAnswer) {
        correctCount++;
      }
    });
    
    const incorrectCount = Object.keys(correctAnswers).length - correctCount;
    const percentage = (correctCount / Object.keys(correctAnswers).length) * 100;
    
    setScore(correctCount);
    setAnalytics({
      correctCount,
      incorrectCount,
      percentage,
      timeSpent: "2:30",
      averageTimePerQuestion: "0:50"
    });
    
    if (percentage >= 66) setShowConfetti(true);
  }, [answers]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/quiz')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Quizzes
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-blue-100">
              {getPerformanceMessage(analytics.percentage)} {getPerformanceBadge(analytics.percentage)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <Trophy className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{analytics.percentage}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Overall Score</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <Brain className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{analytics.correctCount}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Correct Answers</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <Clock className="w-6 h-6 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">{analytics.timeSpent}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Time Spent</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <BarChart className="w-6 h-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{analytics.averageTimePerQuestion}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Avg Time/Question</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
            <div className="space-y-4">
              {Object.entries(answers).map(([questionId, answer]) => (
                <ResultCard
                  key={questionId}
                  questionId={questionId}
                  userAnswer={answer}
                  correctAnswer={correctAnswers[questionId]}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/quiz')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Try Another Quiz
              </button>
              <button
                onClick={() => router.push('/tutorial')}
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <Brain className="w-5 h-5 mr-2" />
                Practice More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
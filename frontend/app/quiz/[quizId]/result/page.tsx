"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { ArrowLeft, Award, BarChart, Brain, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from 'js-cookie'
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

export default function QuizResult({ params }: { params: Promise<{ quizId: string }> }) {
  const router = useRouter();
  const { quizId } = use(params);

  const [quizResult, setQuizResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = Cookies.get("idToken");
        if (!token) {
          console.error("No token found in cookies");
          return;
        }
    
        // Fetch user
        const userResponse = await fetch("http://127.0.0.1:8000/auth/get_user_from_cookie/", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
    
        const user = await userResponse.json();
        if (!user.userID) {
          console.error("User ID not found in response");
          return;
        }
    
        setUserId(user.userID);  // Set userId first
        await new Promise(resolve => setTimeout(resolve, 0)); // Ensure state update  
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
  
    fetchUserId();
  }, []);
  useEffect(() => {
    const submitQuiz = async () => {
      if (!userId) return; 

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/quizzes/submit_quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            quizId,
            userId
          }),
        });
        if (!response.ok) {
          console.error("Error submitting quiz");
          return;
        }

        const resultData = await response.json();
        setQuizResult(resultData);
        
        if (resultData.score.percentage >= 80) {
          setShowConfetti(true);
        }

      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
    };

    if (quizId && userId) {
      submitQuiz();
    }
  }, [quizId, userId]);

  if (!quizResult) {
    return <p className="text-center text-gray-600 mt-10">Loading results...</p>;
  }

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
              {getPerformanceMessage(quizResult.score.percentage)} {getPerformanceBadge(quizResult.score.percentage)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <Trophy className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{quizResult.score.percentage}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Overall Score</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <Brain className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{quizResult.score.correct}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Correct Answers</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <BarChart className="w-6 h-6 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{quizResult.score.wrong}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Wrong Answers</p>
            </div>
          </div>

          {/* Wrong Tags (For Debugging) */}
          {quizResult.new_wrong_tags && quizResult.new_wrong_tags.length > 0 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-2">Areas to Improve</h2>
              <ul className="list-disc list-inside text-red-500">
                {quizResult.new_wrong_tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>
          )}

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

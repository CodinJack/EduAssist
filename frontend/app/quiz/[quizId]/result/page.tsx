"use client";

import { useState, useEffect, use, useTransition } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { 
  ArrowLeft, Award, BarChart, Brain, Trophy, Clock, Target, 
  TrendingUp, Book, CheckCircle, XCircle, BarChart2, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { submitQuiz } from "@/services/quizService";
import { useAuth } from "@/context/AuthContext";

// Performance evaluation helpers
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

// Get a color based on performance
const getPerformanceColor = (percentage) => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-blue-600";
  if (percentage >= 40) return "text-yellow-600";
  return "text-red-600";
};

export default function QuizResult({ params }: { params: Promise<{ quizId: string }> }) {
  const router = useRouter();
  const { quizId } = use(params);
  const { user } = useAuth();
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeSpent, setTimeSpent] = useState(0);
  const [averageTimePerQuestion, setAverageTimePerQuestion] = useState(0);
  const [strengthData, setStrengthData] = useState([]);
  const [weaknessData, setWeaknessData] = useState([]);  
  const [isPending, startTransition] = useTransition();
  
    const handleNavigation = (path: string) => {
      startTransition(() => {
        router.push(path);
      });
    };
  
  useEffect(() => {
    const submit = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const resultData = await submitQuiz(quizId, user.uid);
        
        // Calculate mock time data (in a real app, this would come from tracking actual time)
        const mockTimeSpent = Math.floor(Math.random() * 10) + 5; // 5-15 minutes
        setTimeSpent(mockTimeSpent);
        setAverageTimePerQuestion(mockTimeSpent * 60 / resultData.score.total);
        
        // Process analytics data
        processAnalyticsData(resultData);
        
        setQuizResult(resultData);
        
        if (resultData.score.percentage >= 80) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        }
      } catch (err) {
        console.error("Error submitting quiz:", err);
        setError("Failed to load quiz results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    submit();
  }, [quizId, user]);
  
  const processAnalyticsData = (resultData) => {
    // In a real implementation, this would analyze actual data
    // For now, we'll create mock strength/weakness data based on the score
    
    // Mock strength data (categories user did well in)
    const mockStrengths = ["Logic", "Problem Solving", "Fundamentals"];
    setStrengthData(mockStrengths.map(category => ({
      category,
      score: Math.floor(Math.random() * 20) + 80 // 80-100%
    })));
    
    // Use the actual wrong tags if available, otherwise create mock weaknesses
    if (resultData.new_wrong_tags && resultData.new_wrong_tags.length > 0) {
      setWeaknessData(resultData.new_wrong_tags.map(tag => ({
        category: tag,
        score: Math.floor(Math.random() * 40) + 20 // 20-60%
      })));
    } else {
      const mockWeaknesses = ["Advanced Topics", "Edge Cases", "Optimization"];
      setWeaknessData(mockWeaknesses.map(category => ({
        category,
        score: Math.floor(Math.random() * 40) + 20 // 20-60%
      })));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your results...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => startTransition('/quiz')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Return to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!quizResult) {
    return <p className="text-center text-gray-600 mt-10">No results found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.05} />}
      {isPending && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => startTransition('/quiz')}
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
                <p className="text-blue-100 text-lg">
                  {getPerformanceMessage(quizResult.score.percentage)} {getPerformanceBadge(quizResult.score.percentage)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 inline-flex items-center">
                  <Award className="w-8 h-8 mr-3 text-yellow-300" />
                  <div>
                    <div className="text-3xl font-bold">{Math.round(quizResult.score.percentage)}%</div>
                    <div className="text-xs text-blue-100">YOUR SCORE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-4 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-4 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'performance'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Performance Analytics
              </button>
              <button
                onClick={() => setActiveTab('strength')}
                className={`py-4 px-4 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'strength'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Strengths & Weaknesses
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`py-4 px-4 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'recommendations'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recommendations
              </button>
            </nav>
          </div>

          {/* Content Sections */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Correct</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-gray-800">{quizResult.score.correct}</span>
                      <span className="text-sm text-gray-500">
                        out of {quizResult.score.total}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-600">Wrong</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-gray-800">{quizResult.score.wrong}</span>
                      <span className="text-sm text-gray-500">
                        answers
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Time Spent</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-gray-800">{timeSpent}</span>
                      <span className="text-sm text-gray-500">minutes</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-600">Accuracy</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-gray-800">
                        {Math.round((quizResult.score.correct / quizResult.score.total) * 100)}%
                      </span>
                      <span className="text-sm text-gray-500">
                        overall
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Gauge */}
                <div className="bg-gray-50 p-6 rounded-xl mb-8">
                  <h3 className="text-lg font-semibold mb-4">Performance Assessment</h3>
                  <div className="flex justify-center">
                    {/* Simple gauge visualization */}
                    <div className="relative w-full max-w-md h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          quizResult.score.percentage >= 80 ? 'bg-green-500' :
                          quizResult.score.percentage >= 60 ? 'bg-blue-500' :
                          quizResult.score.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${quizResult.score.percentage}%` }}
                      ></div>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {Math.round(quizResult.score.percentage)}% - {getPerformanceMessage(quizResult.score.percentage)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wrong Topics */}
                {quizResult.new_wrong_tags && quizResult.new_wrong_tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Areas to Improve</h3>
                    <div className="flex flex-wrap gap-2">
                      {quizResult.new_wrong_tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Performance Analytics Tab */}
            {activeTab === 'performance' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                
                {/* Time Analysis */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Time Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Total Time Spent</div>
                      <div className="text-xl font-semibold">{timeSpent} minutes</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Avg. Time per Question</div>
                      <div className="text-xl font-semibold">{Math.round(averageTimePerQuestion)} seconds</div>
                    </div>
                  </div>
                </div>
                
                {/* Answer Distribution */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                    Answer Distribution
                  </h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div 
                        className="h-full bg-green-500 flex items-center justify-center text-white text-xs"
                        style={{ width: `${(quizResult.score.correct / quizResult.score.total) * 100}%` }}
                      >
                        {Math.round((quizResult.score.correct / quizResult.score.total) * 100)}%
                      </div>
                    </div>
                    <div className="w-16 text-sm">Correct</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div 
                        className="h-full bg-red-500 flex items-center justify-center text-white text-xs"
                        style={{ width: `${(quizResult.score.wrong / quizResult.score.total) * 100}%` }}
                      >
                        {Math.round((quizResult.score.wrong / quizResult.score.total) * 100)}%
                      </div>
                    </div>
                    <div className="w-16 text-sm">Wrong</div>
                  </div>
                </div>
                
                {/* Performance Comparison (mockup) */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Performance Comparison
                  </h4>
                  <div className="flex items-end gap-4 h-32">
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">Average</div>
                      <div className="bg-gray-300 w-8 rounded-t-md" style={{ height: '70%' }}></div>
                      <div className="text-xs font-medium mt-1">72%</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">Your Score</div>
                      <div 
                        className={`w-8 rounded-t-md ${
                          quizResult.score.percentage >= 72 ? 'bg-green-500' : 'bg-orange-500'
                        }`} 
                        style={{ height: `${(quizResult.score.percentage / 100) * 100}%` }}
                      ></div>
                      <div className="text-xs font-medium mt-1">{Math.round(quizResult.score.percentage)}%</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">Top Score</div>
                      <div className="bg-blue-500 w-8 rounded-t-md" style={{ height: '90%' }}></div>
                      <div className="text-xs font-medium mt-1">90%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses Tab */}
            {activeTab === 'strength' && (
              <div>
                {/* Strengths Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Your Strengths
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strengthData.map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-green-600 font-semibold">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Weaknesses Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <XCircle className="w-5 h-5 mr-2 text-red-600" />
                    Areas to Improve
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weaknessData.map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-red-600 font-semibold">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
                
                {/* Generated based on performance */}
                <div className="space-y-4">
                  {quizResult.score.percentage >= 80 ? (
                    <>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex">
                        <div className="mr-4 mt-1">
                          <Book className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Advanced Topics</h4>
                          <p className="text-gray-600 text-sm">
                            You're performing exceptionally well! Consider exploring advanced topics to further enhance your knowledge.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex">
                        <div className="mr-4 mt-1">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Take on Challenges</h4>
                          <p className="text-gray-600 text-sm">
                            Try more difficult quizzes to test the limits of your understanding and find areas to perfect.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex">
                        <div className="mr-4 mt-1">
                          <Brain className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Focus on Fundamentals</h4>
                          <p className="text-gray-600 text-sm">
                            Review core concepts in {weaknessData.map(w => w.category).join(', ')} to strengthen your foundation.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex">
                        <div className="mr-4 mt-1">
                          <Book className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Practice Regularly</h4>
                          <p className="text-gray-600 text-sm">
                            Schedule regular practice sessions focusing on your weaker areas to improve comprehension.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex">
                    <div className="mr-4 mt-1">
                      <BarChart2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Track Progress</h4>
                      <p className="text-gray-600 text-sm">
                        Take similar quizzes periodically to track your improvement and adjust your learning strategy accordingly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTransition(`/quiz/${quizId}/review`)}
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <Book className="w-5 h-5 mr-2" />
                Review Answers
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTransition('/quiz')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Try Another Quiz
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTransition('/tutorial')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Brain className="w-5 h-5 mr-2" />
                Practice Topics
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Share Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex justify-center"
        >
          <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm flex items-center">
            <Award className="w-4 h-4 mr-1" />
            Share your results
          </button>
        </motion.div>
      </div>
    </div>
  );
}
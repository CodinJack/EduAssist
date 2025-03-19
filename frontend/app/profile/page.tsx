"use client";
import React, { useState } from "react";
import { BarChart, List, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/Sidebar";
import Image from "next/image";

// Mock User Data
const user = {
  name: "Jai Khanna",
  email: "jai.khanna@example.com",
  profilePic: "/default.png", 
};

// Mock Quiz Data
const quizHistory = [
  { id: 1, topic: "Algorithms", score: 80 },
  { id: 2, topic: "Databases", score: 65 },
  { id: 3, topic: "Math", score: 50 },
  { id: 4, topic: "Networking", score: 75 },
  { id: 5, topic: "Data Structures", score: 40 },
];

// Calculate Stats
const totalQuizzes = quizHistory.length;
const averageScore = Math.round(
  quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
);
const weakTopics = quizHistory.filter((quiz) => quiz.score < 60);
const weakTopicsCount = weakTopics.length;

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`p-8 flex-1 transition-all ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Profile Header */}
        <div className="flex items-center gap-6 bg-white p-6 rounded-lg shadow-md">
          <Image
            src={user.profilePic}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full border border-lime-400"
            priority
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-600">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Quiz Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          {/* Total Quizzes */}
          <Card className="bg-white shadow-sm border border-lime-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <List size={20} /> Quizzes Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalQuizzes}</p>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className="bg-white shadow-sm border border-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lime-400">
                <BarChart size={20} /> Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{averageScore}%</p>
            </CardContent>
          </Card>

          {/* Number of Weak Topics */}
          <Card className="bg-white shadow-sm border border-lime-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <AlertCircle size={20} /> Weak Topics Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-semibold text-black`}>
                {weakTopicsCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz History Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz History</h2>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-blue-600">
                  <th className="pb-2">Topic</th>
                  <th className="pb-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((quiz) => (
                  <tr key={quiz.id} className="border-b">
                    <td className="py-2">{quiz.topic}</td>
                    <td className={`py-2 font-semibold ${quiz.score < 60 ? "text-red-500" : "text-green-600"}`}>
                      {quiz.score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Summary</h2>
          <Card className="bg-white shadow-sm border border-blue-600 p-6">
            <p className="text-gray-700">
              {averageScore >= 75
                ? "You're doing great! Keep up the consistency."
                : averageScore >= 50
                ? "Good job! But there's room for improvement."
                : "Your scores are low. Focus on weak topics and practice more!"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

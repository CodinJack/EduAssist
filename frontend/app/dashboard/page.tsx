"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { DashboardCard } from "@/components/dashboard/dashboardCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { username, totalQuizzes, avgScore, rank } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold drop-shadow-lg"
      >
        Welcome, {username}! 🚀
      </motion.h1>
      
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <DashboardCard title="Total Quizzes" value={totalQuizzes} />
        <DashboardCard title="Average Score" value={avgScore} />
        <DashboardCard title="Your Rank" value={rank} />
      </div>
      
      <div className="mt-10 flex flex-wrap gap-4">
        <Button onClick={() => router.push("/quiz")} className="bg-white text-black px-6 py-3 rounded-xl shadow-md text-lg">
          📜 Take a Quiz
        </Button>
        <Button onClick={() => router.push("/leaderboard")} className="bg-white text-black px-6 py-3 rounded-xl shadow-md text-lg">
          🏆 View Leaderboard
        </Button>
        <Button onClick={() => router.push("/results")} className="bg-white text-black px-6 py-3 rounded-xl shadow-md text-lg">
          📊 My Results
        </Button>
      </div>
    </div>
  );
}

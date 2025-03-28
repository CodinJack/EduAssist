"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/SideBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StudentProgress } from "@/components/dashboard/StudentProgress";
import { BookOpen, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

// ------------------------------
// MOTIVATIONAL QUOTES SECTION
// ------------------------------
const MotivationalQuotes = () => {
  const quotes = [
    "Success is not the key to happiness. Happiness is the key to success.",
    "The best way to predict the future is to create it.",
    "Don't watch the clock; do what it does. Keep going.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow-sm">
      <p className="text-blue-700 font-semibold">"{randomQuote}"</p>
    </div>
  );
};

// ------------------------------
// RECENT ACHIEVEMENTS SECTION
// ------------------------------
const RecentAchievements = () => {
  const achievements = [
    { title: "Completed 100 quizzes!", date: "March 2025" },
    { title: "Mastered 5 new topics!", date: "February 2025" },
    { title: "Studied 50+ hours this semester!", date: "January 2025" },
  ];

  return (
    <div className="p-4 bg-lime-50 border-l-4 border-lime-600 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-lime-700 mb-2">
        Recent Achievements
      </h3>
      <ul className="text-sm text-gray-700">
        {achievements.map((achieve, index) => (
          <li key={index} className="mb-1">
            ✅ {achieve.title}{" "}
            <span className="text-gray-500 text-xs">({achieve.date})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ------------------------------
// DASHBOARD PAGE COMPONENT
// ------------------------------
export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();


  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("idToken");
      const mode = Cookies.get("mode");

      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // Restrict guest mode
      const path = window.location.pathname;
      const restrictedPaths = ["/quiz", "/profile", "/leaderboard"];
      if (mode === "guest" && restrictedPaths.includes(path)) {
        toast.error("Login First to access this page");
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-black overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`relative flex-1 transition-all duration-500 ease-in-out ${
          collapsed ? "ml-20" : "ml-64"
        } p-6` }
      >
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-1">
              <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-sm">
                Dashboard
              </h1>
              <p className="text-lg text-black opacity-80">Welcome back, Student!</p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <StatsCard
              title="Quizzes taken"
              value="256"
              icon={BookOpen}
              trend={{ value: "12% vs last month", positive: true }}
              className="bg-white border border-blue-600 shadow-blue-600/30"
            />
            <StatsCard
              title="Weak topics"
              value="8"
              icon={BookOpen}
              trend={{ value: "2 new this month", positive: true }}
              className="bg-white border border-lime-300 shadow-lime-300/30"
            />
            <StatsCard
              title="Hours Studied"
              value="34"
              icon={Clock}
              trend={{ value: "18 this week", positive: true }}
              className="bg-white border border-blue-600 shadow-blue-600/30"
            />
            <StatsCard
              title="Avg. Performance"
              value="85%"
              icon={Award}
              trend={{ value: "5% vs last month", positive: true }}
              className="bg-white border border-lime-300 shadow-lime-300/30"
            />
          </motion.div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Student Progress Section */}
            <motion.div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-sm border border-blue-600 p-6 hover:shadow-lg transition-shadow duration-300">
              <StudentProgress />
            </motion.div>

            {/* Quotes & Achievements Section */}
            <motion.div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-sm border border-lime-300 p-6 hover:shadow-lg transition-shadow duration-300">
              <MotivationalQuotes />
              <div className="mt-4">
                <RecentAchievements />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

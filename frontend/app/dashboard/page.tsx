"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { UpcomingClasses } from "@/components/dashboard/UpcomingClasses";
import { StudentProgress } from "@/components/dashboard/StudentProgress";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Users, BookOpen, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-white text-black overflow-hidden">
      
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={`relative flex-1 transition-all duration-500 ease-in-out ${collapsed ? "ml-20" : "ml-64"}`}>
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-1">
              <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-sm">Dashboard</h1>
              <p className="text-lg text-black opacity-80">Welcome back, Student!</p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <StatsCard title="Total Students" value="256" icon={Users} trend={{ value: "12% vs last month", positive: true }} className="bg-white border border-blue-600 shadow-blue-600/30 " />
            <StatsCard title="Active Courses" value="8" icon={BookOpen} trend={{ value: "2 new this month", positive: true }} className="bg-white border border-lime-300 shadow-lime-300/30 " />
            <StatsCard title="Hours Taught" value="124" icon={Clock} trend={{ value: "18 this week", positive: true }} className="bg-white border border-blue-600 shadow-blue-600/30 " />
            <StatsCard title="Avg. Performance" value="85%" icon={Award} trend={{ value: "5% vs last month", positive: true }} className="bg-white border border-lime-300 shadow-lime-300/30 " />
          </motion.div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div className="lg:col-span-2 bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-sm border border-blue-600 p-6 hover:shadow-lg transition-shadow duration-300">
              <StudentProgress />
            </motion.div>
            <motion.div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-sm border border-lime-300 p-6 hover:shadow-lg transition-shadow duration-300">
              <QuickActions />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-600 p-6 hover:shadow-lg transition-shadow duration-300" >
              <ActivityTimeline />
            </motion.div>
            <motion.div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-lg border border-lime-300 p-6 hover:shadow-lg transition-shadow duration-300" >
              <UpcomingClasses />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";
import { 
  User, 
  Book, 
  Award, 
  Clock, 
  Star, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Trophy 
} from "lucide-react";

export default function StudentProfile() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const studentData = {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "September 2022",
    avatar: "/api/placeholder/200/200",
    bio: "Passionate computer science student with a keen interest in machine learning and artificial intelligence. Committed to continuous learning and personal growth.",
    stats: {
      courses: 6,
      completedCredits: 48,
      gpa: 3.8,
      totalHours: 240
    },
    recentAchievements: [
      { 
        title: "Dean's List", 
        date: "Fall 2023", 
        description: "Recognized for academic excellence with a GPA above 3.5" 
      },
      { 
        title: "AI Project Winner", 
        date: "Spring 2024", 
        description: "First place in university-wide AI innovation challenge" 
      }
    ],
    currentCourses: [
      { 
        code: "CS 301", 
        name: "Advanced Machine Learning", 
        progress: 75,
        instructor: "Dr. Alan Thompson"
      },
      { 
        code: "MATH 255", 
        name: "Statistical Methods", 
        progress: 60,
        instructor: "Prof. Sarah Klein"
      }
    ]
  };

  const TabContent = {
    overview: () => (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-blue-600 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
            <Book className="mr-3 text-blue-600" /> Academic Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Courses</span>
              <span className="font-bold">{studentData.stats.courses}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Credits</span>
              <span className="font-bold">{studentData.stats.completedCredits}</span>
            </div>
            <div className="flex justify-between">
              <span>Current GPA</span>
              <span className="font-bold text-blue-700">{studentData.stats.gpa}</span>
            </div>
            <div className="flex justify-between">
              <span>Study Hours</span>
              <span className="font-bold">{studentData.stats.totalHours}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-lime-300 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-lime-700 mb-4 flex items-center">
            <Trophy className="mr-3 text-lime-600" /> Recent Achievements
          </h3>
          {studentData.recentAchievements.map((achievement, index) => (
            <div key={index} className="mb-4 last:mb-0 border-b pb-3 last:border-b-0">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-black">{achievement.title}</h4>
                <span className="text-sm text-gray-600">{achievement.date}</span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    courses: () => (
      <div className="space-y-4">
        {studentData.currentCourses.map((course, index) => (
          <motion.div 
            key={index} 
            className="bg-white border border-blue-600 rounded-xl p-6 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-700">{course.code} - {course.name}</h3>
                <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-blue-700">{course.progress}%</span>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  };

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-black overflow-hidden">
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
              <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-sm">Student Profile</h1>
              <p className="text-lg text-black opacity-80">Personal Information & Academic Journey</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              className="md:col-span-1 bg-white border border-blue-600 rounded-xl p-6 text-center shadow-sm"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img 
                src={studentData.avatar} 
                alt={studentData.name} 
                className="w-48 h-48 rounded-full mx-auto border-4 border-blue-600 mb-4"
              />
              <h2 className="text-2xl font-bold text-blue-700">{studentData.name}</h2>
              <p className="text-gray-600 mb-4">{studentData.bio}</p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <Mail className="mr-3 text-blue-600" />
                  <span>{studentData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 text-blue-600" />
                  <span>{studentData.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-3 text-blue-600" />
                  <span>{studentData.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-3 text-blue-600" />
                  <span>Joined {studentData.joinDate}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="md:col-span-2 bg-white border border-lime-300 rounded-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex border-b">
                {['overview', 'courses'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-lg font-semibold capitalize 
                      ${activeTab === tab 
                        ? 'bg-lime-100 text-lime-700 border-b-2 border-lime-700' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {TabContent[activeTab]()}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
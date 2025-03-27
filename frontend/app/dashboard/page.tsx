"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Video, 
  Globe, 
  Star, 
  ArrowRight, 
  YouTube, 
  BookmarkIcon, 
  PenTool,
  Brain,
  CheckCircle
} from "lucide-react";

import Sidebar from "@/components/dashboard/SideBar";

// Learning Resources Component
const LearningResources = () => {
  const resources = [
    {
      platform: "YouTube",
      icon: Video,
      title: "Top Computer Science Tutorials",
      description: "Curated list of free programming tutorials",
      link: "https://www.youtube.com/playlist?list=PLBmRxydnERkzYMONS9R2VHrQZRNRVmHRX"
    },
    {
      platform: "Coursera",
      icon: BookOpen,
      title: "Data Science Beginner Courses",
      description: "Free introductory data science learning paths",
      link: "https://www.coursera.org/browse/data-science/data-analysis"
    },
    {
      platform: "edX",
      icon: Globe,
      title: "Machine Learning Fundamentals",
      description: "Comprehensive ML learning resources",
      link: "https://www.edx.org/learn/machine-learning"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <BookmarkIcon className="mr-2 text-blue-600" /> Learning Resources
        </h3>
      </div>
      <div className="space-y-4">
        {resources.map((resource, index) => {
          const PlatformIcon = resource.icon;
          return (
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer"
              key={index} 
              className="flex items-center justify-between bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <PlatformIcon className="text-blue-600 w-6 h-6" />
                <div>
                  <p className="font-semibold text-gray-800">{resource.title}</p>
                  <p className="text-xs text-gray-500">{resource.description}</p>
                </div>
              </div>
              <ArrowRight className="text-blue-600" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

// Study Recommendations Component
const StudyRecommendations = () => {
  const recommendations = [
    {
      title: "Python Programming Roadmap",
      icon: PenTool,
      description: "Step-by-step guide to mastering Python",
      difficulty: "Beginner",
      link: "https://roadmap.sh/python"
    },
    {
      title: "Web Development Essentials",
      icon: Video,
      description: "Complete webD learning path",
      difficulty: "Intermediate",
      link: "https://www.freecodecamp.org/learn/web-design/"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-md h-full">
      <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
        <Star className="mr-2 text-purple-600" /> Personalized Recommendations
      </h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon;
          return (
            <a
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index} 
              className="flex items-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
            >
              <IconComponent className="text-purple-600 mr-4 w-6 h-6" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{rec.title}</p>
                <p className="text-xs text-gray-500">{rec.description}</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {rec.difficulty}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// Motivational Section
const MotivationalSection = () => {
  const tips = [
    "Break complex topics into smaller, manageable chunks",
    "Consistency is key in learning. Study a little every day",
    "Use active recall techniques to improve memory",
    "Create a dedicated study space to minimize distractions"
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 shadow-md h-full">
      <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        <Star className="mr-2 text-green-600" /> Learning Tips
      </h3>
      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li 
            key={index} 
            className="flex items-center bg-white rounded-lg p-3 shadow-sm"
          >
            <Star className="text-green-500 mr-3 w-5 h-5" />
            <p className="text-gray-700">{tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// New Mental Wellness Section
const MentalWellnessSection = () => {
  const wellnessTips = [
    {
      title: "Mindfulness Meditation",
      description: "10-minute daily practice to reduce stress",
      icon: Brain
    },
    {
      title: "Productivity Techniques",
      description: "Improve focus and reduce burnout",
      icon: CheckCircle
    },
    {
      title: "Study-Life Balance",
      description: "Strategies for managing academic stress",
      icon: Star
    }
  ];

  return (
    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 shadow-md h-full">
      <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center">
        <Brain className="mr-2 text-pink-600" /> Mental Wellness
      </h3>
      <div className="space-y-4">
        {wellnessTips.map((tip, index) => {
          const IconComponent = tip.icon;
          return (
            <div 
              key={index} 
              className="flex items-center bg-white rounded-lg p-4 shadow-sm"
            >
              <IconComponent className="text-pink-600 mr-4 w-6 h-6" />
              <div>
                <p className="font-semibold text-gray-800">{tip.title}</p>
                <p className="text-xs text-gray-500">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-black overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`relative flex-1 transition-all duration-500 ease-in-out ${
          collapsed ? "ml-20" : "ml-64"
        } p-6`}
      >
        <div className="p-8 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-sm">
              EduAssist
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Your personal learning companion
            </p>
          </motion.div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <LearningResources />
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StudyRecommendations />
              </motion.div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MotivationalSection />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <MentalWellnessSection />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
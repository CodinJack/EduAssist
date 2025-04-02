"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/dashboard/SideBar";
import { useAuth } from "@/context/AuthContext";

const PracticePage = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const weakTags = user?user.weakTopics : [];
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };
  const handleStartPractice = async (topic: string) => {
    if (!topic) return alert("Please enter a topic!");
    handleNavigation(`/practice/${encodeURIComponent(topic)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {isPending && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      <div className={`transition-all duration-700 ${collapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Practice Topics</h1>
        </div>

        {/* Practice Form */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Create Your Practice Quiz</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Topic Input */}
              <Input
                placeholder="Enter a topic"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              />
            </div>

            <Button className="mt-4 bg-blue-600 hover:bg-blue-700"                 
                onClick={() => handleStartPractice(selectedTopic)}
            >
              Start Practice
            </Button>
          </div>

          {/* Weak Topics Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Practice Weak Topics</h2>
            <div className="flex gap-2 flex-wrap">
              {weakTags.map((tag, index) => (
                <Button
                  key={index}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                  onClick={() => handleStartPractice(tag)}
                  >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;

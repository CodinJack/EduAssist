"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, BookOpen, ChevronRight, Target, Clock, Award, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/dashboard/SideBar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deleteWeakTopic } from "@/services/practiceService";
const PracticePage = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const weakTopics = user?.weakTopics || [];
  const [isPending, startTransition] = useTransition();
  const [setUserId, userId] = useState("");
  const [suggestedTopics] = useState([
    { name: "Computer Science", icon: <Sparkles className="h-5 w-5 text-purple-500" />, description: "Algorithms, data structures, and programming concepts" },
    { name: "Mathematics", icon: <Target className="h-5 w-5 text-blue-500" />, description: "Algebra, calculus, and statistics" },
    { name: "Physics", icon: <Lightbulb className="h-5 w-5 text-yellow-500" />, description: "Mechanics, thermodynamics, and quantum physics" },
  ]);

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  const handleStartPractice = async (topic: string) => {
    if(!userId){
      toast.error("Please login first!");
      return;
    }
    if (!topic) {
      toast.error("Please enter a topic!");
      return;
    }
    await deleteWeakTopic(userId, topic);
    handleNavigation(`/practice/${encodeURIComponent(topic)}`);
  };

  useEffect(() => {
    setUserId(user.uid);
  }, [user])
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {isPending && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      
      <div className={`transition-all duration-500 ${collapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-quiz-purple mr-2" />
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-quiz-purple to-quiz-blue text-transparent bg-clip-text">
                  Practice Mode
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Introduction Card */}
          <Card className="mb-8 border-0 shadow-md bg-gradient-to-r from-quiz-purple/10 to-quiz-blue/10">
            <CardHeader>
              <CardTitle className="text-2xl">Practice Your Knowledge</CardTitle>
              <CardDescription>
                Generate custom practice sessions on any topic you want to master. 
                Enter a topic below to start practicing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Input
                  placeholder="Enter a topic (e.g., 'Machine Learning')"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  className="bg-gradient-to-r from-quiz-purple to-quiz-blue text-white px-6 py-2 h-10 animated-gradient-button w-full md:w-auto"
                  onClick={() => handleStartPractice(selectedTopic)}
                >
                  Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="">
            {/* Weak Topics Card */}
            <div className="">
              <Card className="h-full border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-quiz-purple" /> Your Weak Topics
                  </CardTitle>
                  <CardDescription>
                    Focus on these topics to improve your knowledge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {weakTopics.length > 0 ? (
                      weakTopics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 flex items-center gap-1 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                          onClick={() => handleStartPractice(topic)}
                        >
                          {topic} <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ))
                    ) : (
                      <div className="text-center w-full py-6 text-gray-500">
                        No weak topics identified yet. Start taking quizzes to see your weak areas.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Suggested Topics */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Suggested Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedTopics.map((topic, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer" 
                onClick={() => handleStartPractice(topic.name)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {topic.icon}
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm">{topic.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="ghost" 
                    className="text-quiz-purple hover:text-quiz-blue hover:bg-quiz-purple/10 p-0"
                  >
                    Start Practice <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;

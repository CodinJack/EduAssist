"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  AlertCircle, Award, BarChart, Bookmark, Calendar, 
  ChevronRight, Flame, List, Trophy, Clock 
} from "lucide-react";

import Sidebar from "@/components/dashboard/SideBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { checkAndUpdateStreak } from "@/services/streakService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProfilePage = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [error, setError] = useState(null);
    const [fixcs , setcs] = useState(0);
    const [fixms , setms] = useState(0);
    const [fixismaintained , setfixismaintained] = useState(false);
    
    const [streakInfo, setStreakInfo] = useState({
        currentStreak: 0,
        maxStreak: 0,
        streakActive: false
    });
    const { user } = useAuth();
    const router = useRouter();

    // Format date for last quiz date
    const formatDate = (timestamp) => {
        if (!timestamp) return "No data";
        
        const date = timestamp.seconds 
            ? new Date(timestamp.seconds * 1000)
            : new Date(timestamp);
            
        return date.toLocaleDateString("en-US", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
        });
    };

    // Check if streak is active (quiz completed within the last 24 hours)
    const isStreakActive = (timestamp , userData) => {
        if (!timestamp) return false;
        const currentDate = new Date();
        const lastQuizDay = new Date(timestamp);
        lastQuizDay.setHours(0, 0, 0, 0);
        
        const currentDay = new Date(currentDate);
        currentDay.setHours(0, 0, 0, 0);
        const isSameDay = lastQuizDay.getTime() === currentDay.getTime();
        
        const timeDiff = currentDay - lastQuizDay;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if(isSameDay || (daysDiff<=1)){
            return true;
        }
        else return false;
    };

    // Check streak status on component mount
    useEffect(() => {
        const fetchStreak = () => {
            try {
                if (user?.uid) {
                    // Get streak data from nested streak object if it exists, otherwise use top-level properties
                    const currentStreak = user.currentStreak || 0;
                    const maxStreak = user.maxStreak || 0;
                                                
                    // Check if streak is active
                    const lastQuizDate = user.lastQuizSubmissionDate?.seconds
                        ? new Date(user.lastQuizSubmissionDate.seconds * 1000)
                        : null;

                    const streakActive = isStreakActive(lastQuizDate , user);
                    
                    checkAndUpdateStreak(user.uid)
                        .then(result => {
                            setStreakInfo({
                                currentStreak: currentStreak,
                                maxStreak: maxStreak,
                                streakActive: streakActive
                            });
                        })
                        .catch(err => console.error("Error checking streak:", err));

                        setcs(user.currentStreak);
                        setms(user.maxStreak);
                        const checkthis = isStreakActive(lastQuizDate , user);
                        setfixismaintained(checkthis);
                }
            }catch (err) {
                console.error("Error checking streak:", err);
            }
        };
          
        fetchStreak();
    }, [user,fixms,fixcs,fixismaintained]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1 
            } 
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    // Loading state
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (!user) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-400 border-dashed rounded-full animate-spin"></div>
              <p className="text-lg text-gray-600 font-medium">Fetching your profile...</p>
            </div>
          </div>
        );
    }

    // Calculate time until streak resets
    const getTimeUntilReset = () => {
        const lastQuizTimestamp = 
            (user.streak?.lastQuizDate && user.last_quiz_date) 
                ? (user.streak.lastQuizDate.seconds > user.last_quiz_date.seconds 
                    ? user.streak.lastQuizDate 
                    : user.last_quiz_date)
                : (user.streak?.lastQuizDate || user.last_quiz_date);
    
        if (!lastQuizTimestamp) return "Complete a quiz to start your streak!";
    
        const lastQuizDate = lastQuizTimestamp.seconds 
            ? new Date(lastQuizTimestamp.seconds * 1000)
            : new Date(lastQuizTimestamp);
    
        // Normalize lastQuizDate to midnight
        lastQuizDate.setHours(0, 0, 0, 0);
    
        // Reset time is next day at midnight
        const resetTime = new Date(lastQuizDate);
        resetTime.setDate(resetTime.getDate() + 1);
    
        const now = new Date();
    
        const timeDiff = resetTime - now;
    
        if (timeDiff <= 0) return "Your streak has expired!";
    
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
        return `⏳ ${hours}h ${minutes}m left before your streak expires`;
    };
    
    
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content */}
            <div className={`p-4 md:p-8 flex-1 transition-all duration-700 ${collapsed ? "ml-16" : "ml-64"}`}>
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Profile Header */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500"
                    >
                        {user ? (
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-purple-400 ring-offset-2">
                            <Image
                                src={user.photoURL || "https://source.unsplash.com/random/200x200/?portrait"}
                                alt="Profile Picture"
                                className="object-cover w-full h-full"
                                fill
                                unoptimized
                                />
                            </div>{fixismaintained ? (
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-2">
                                    <Flame size={20} className="text-white" />
                                </div>
                                ) : (
                                <div className="absolute -bottom-2 -right-2 bg-gray-300 rounded-full p-2">
                                    <Flame size={20} className="text-gray-400 opacity-60" />
                                </div>
                                )}
                        </div>  
                        ) : (
                        <div>Loading user data...</div>
                        )}  
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                {user ? user.displayName ?? "User" : "User"}
                            </h1>
                            <p className="text-gray-500">{user.email}</p>
                            
                            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge variant="outline" className={`${fixismaintained ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700 border-gray-200'} font-medium`}>
                                                <Flame className={`w-3 h-3 mr-1 ${fixismaintained ? 'text-amber-500' : 'text-gray-500'}`} /> 
                                                Streak: {fixcs || 0} days
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent className="p-3 max-w-xs">
                                            <p>{fixismaintained ? 
                                                `Your streak is active! ${getTimeUntilReset()}` : 
                                                "Complete a quiz today to maintain your streak!"}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                    <Trophy className="w-3 h-3 mr-1" /> Best: {fixms || 0} days
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                                    <Calendar className="w-3 h-3 mr-1" /> Last Quiz: {formatDate(user.last_quiz_date)}
                                </Badge>
                            </div>
                        </div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-4 md:mt-0"
                        >
                            <button
                                onClick={() => router.push("/bookmarked")}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
                            >
                                <Bookmark size={18} /> View Bookmarks <ChevronRight size={16} />
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Streak Card */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-6"
                    >
                        <Card className="bg-white shadow-md overflow-hidden border-none hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-gray-700">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Flame size={20} className="text-amber-500" />
                                    </div>
                                    <span>Your Streak Progress</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Current Streak</p>
                                        <p className="text-3xl font-bold text-amber-600">{fixcs || 0} days</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Best Streak</p>
                                        <p className="text-3xl font-bold text-blue-600">{fixms || 0} days</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-100 h-8 rounded-full overflow-hidden relative">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min((user.currentStreak || 0) / 10 * 100, 100)}%` }}
                                    ></div>
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-semibold">
                                        {streakInfo.streakActive ? 
                                            `${getTimeUntilReset()} to continue your streak` : 
                                            "Complete a quiz today to maintain your streak!"}
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Clock size={14} />
                                        <span>Last activity: {formatDate(user.last_quiz_date)}</span>
                                    </div>
                                    <button 
                                        onClick={() => router.push("/quiz")}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors duration-300"
                                    >
                                        Take a Quiz
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quiz Performance Overview */}
                    <motion.div 
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6"
                    >
                        {/* Total Quizzes */}
                        <Card className="bg-white shadow-md overflow-hidden border-none hover:shadow-lg transition-shadow duration-300">
                            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-500 to-purple-300"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-gray-700">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <List size={20} className="text-purple-500" />
                                    </div>
                                    <span>Quizzes Attempted</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-purple-600">
                                        {user?.number_of_tests_attempted || user?.numberOfTestsAttempted || 0}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">quizzes</span>
                                </div>
                                <Progress 
                                    value={Math.min((user?.number_of_tests_attempted || 0) * 10, 100)} 
                                    className="h-1 mt-3 bg-purple-100" 
                                />
                            </CardContent>
                        </Card>

                        {/* Average Marks */}
                        <Card className="bg-white shadow-md overflow-hidden border-none hover:shadow-lg transition-shadow duration-300">
                            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-300"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-gray-700">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BarChart size={20} className="text-blue-500" />
                                    </div>
                                    <span>Average Marks</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {(user?.averageMarks || 0).toFixed(1)}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">points</span>
                                </div>
                                <Progress 
                                    value={Math.min((user?.total_marks || 0) * 10, 100)} 
                                    className="h-1 mt-3 bg-blue-100" 
                                />
                            </CardContent>
                        </Card>

                        {/* Weak Topics */}
                        <Card className="bg-white shadow-md overflow-hidden border-none hover:shadow-lg transition-shadow duration-300">
                            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-rose-500 to-rose-300"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-gray-700">
                                    <div className="p-2 bg-rose-100 rounded-lg">
                                        <AlertCircle size={20} className="text-rose-500" />
                                    </div>
                                    <span>Weak Topics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-rose-600">
                                        {user?.wrong_tags?.length || user?.weakTopics?.length || 0}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">topics</span>
                                </div>
                                <Progress 
                                    value={Math.min((user?.wrong_tags?.length || 0) * 10, 100)} 
                                    className="h-1 mt-3 bg-rose-100" 
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Weak Topics List */}
                    <motion.div 
                        variants={itemVariants}
                        className="mt-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Improvement Areas</h2>
                            <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-200">Focus Points</Badge>
                        </div>
                        
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                            {(user?.wrong_tags?.length > 0 || user?.weakTopics?.length > 0) ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {(user.wrong_tags || user.weakTopics || []).map((topic, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center gap-2 bg-gradient-to-r from-rose-50 to-white p-3 rounded-lg border border-rose-100"
                                        >
                                            <div className="min-w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                                                <span className="text-rose-500 text-sm font-semibold">{index + 1}</span>
                                            </div>
                                            <span className="text-gray-700 font-medium capitalize">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                        <Award size={28} className="text-green-500" />
                                    </div>
                                    <p className="text-gray-500">No weak topics identified yet. Keep taking quizzes!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/SideBar";
import { motion } from "framer-motion";
import { Trophy, Award } from "lucide-react";
import { getAllUsers } from "@/services/authService";

interface UserData {
  userID: string;
  email: string;
  averageMarks: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: string;
  avatar: string;
  badge: string;
}

export default function Leaderboard() {
    const [collapsed, setCollapsed] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers();
    
                if (allUsers.length) {
                    const sortedUsers = allUsers
                        .sort((a: UserData, b: UserData) => b.averageMarks - a.averageMarks) // Sort by highest marks
                        .slice(0, 10); // Get top 10 users
    
                    const users = sortedUsers.map((user: UserData, index: number) => ({
                        rank: index + 1,
                        name: user.email.split("@")[0],
                        score: user.averageMarks.toFixed(2),
                        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${user.userID}`,
                        badge: index === 0 ? "Top Performer" : index < 3 ? "Rising Star" : "Consistent Learner",
                    }));
    
                    setLeaderboardData(users);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, []);
    

    return (
        <div className="relative flex min-h-screen bg-slate-50 text-black overflow-hidden">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <main
                className={`relative flex-1 transition-all duration-500 ease-in-out ${
                    collapsed ? "ml-20" : "ml-64"
                }`}
            >
                <div className="p-8 max-w-7xl mx-auto">
                    <motion.div
                        className="flex justify-between items-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="space-y-1 mt-1">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-quiz-purple to-quiz-blue text-transparent bg-clip-text">
                            Leaderboard
                            </h1>
                        </div>    
                            <p className="text-sm font-normal bg-gradient-to-r from-quiz-purple to-quiz-blue text-transparent bg-clip-text">
                            Top Performing Students
                            </p>
                        
                        </div>
                        <div className="flex items-center space-x-4">
                            <Trophy className="bg-gradient-to-r from-quiz-purple to-quiz-blue text-transparent bg-clip-text" size={32} />
                            <span className="text-2xl font-semibold bg-gradient-to-r from-quiz-purple to-quiz-blue text-transparent bg-clip-text">
                                Performance Ranking
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-600 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="grid gap-4">
                            {loading ? (
                                <p className="text-center text-gray-500">
                                    Loading leaderboard...
                                </p>
                            ) : leaderboardData.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No users found
                                </p>
                            ) : (
                                leaderboardData.map((student) => (
                                    <motion.div
                                        key={student.rank}
                                        className="text-sm flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="text-sm flex items-center space-x-6">
                                            <span className="text-lg font-bold text-blue-700 w-12 text-center">
                                                #{student.rank}
                                            </span>
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="w-16 h-16 rounded-full border-2 border-blue-600"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-black">
                                                    {student.name}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <Award
                                                        size={16}
                                                        className="text-lime-600"
                                                    />
                                                    <span className="text-sm text-gray-600">
                                                        {student.badge}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <span className="text-2xl font-bold text-blue-700">
                                                {student.score}
                                            </span>
                                            <p className="text-xs text-gray-600">
                                                Average Marks
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
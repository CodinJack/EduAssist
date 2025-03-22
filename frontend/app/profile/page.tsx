"use client";
import React, { useState, useEffect } from "react";
import { BarChart, List, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/Sidebar";
import Image from "next/image";
import Cookies from "js-cookie";

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token"); // Get token from cookies

      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data.details.firestore_user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`p-8 flex-1 transition-all ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Profile Header */}
        <div className="flex items-center gap-6 bg-white p-6 rounded-lg shadow-md">
          <Image
            src="/default.png"
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full border border-lime-400"
            priority
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-600">{user.email}</h1>
            <p className="text-gray-600">User ID: {user.userID}</p>
          </div>
        </div>

        {/* Quiz Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Total Quizzes */}
          <Card className="bg-white shadow-sm border border-lime-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <List size={20} /> Quizzes Attempted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{user.number_of_tests_attempted}</p>
            </CardContent>
          </Card>

          {/* Total Marks */}
          <Card className="bg-white shadow-sm border border-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lime-400">
                <BarChart size={20} /> Total Marks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{user.total_marks}</p>
            </CardContent>
          </Card>

          {/* Weak Topics Count */}
          <Card className="bg-white shadow-sm border border-lime-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <AlertCircle size={20} /> Weak Topics Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-black">{user.weak_topics.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Weak Topics */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weak Topics</h2>
          <div className="bg-white shadow-sm rounded-lg p-6">
            {user.weak_topics.length > 0 ? (
              <ul className="list-disc ml-5">
                {user.weak_topics.map((topic, index) => (
                  <li key={index} className="text-red-500">{topic}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No weak topics found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

"use client";
import React, { useState, useEffect } from "react";
import { BarChart, List, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/SideBar";
import Image from "next/image";
import Cookies from "js-cookie";

import { useAuth } from "@/context/AuthContext";
const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  const authUser = user.details.auth_user;
  const firestoreUser = user.details.firestore_user;

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
            <h1 className="text-2xl font-bold text-blue-600">
              {authUser.email}
            </h1>
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
              <p className="text-2xl font-semibold">
                {firestoreUser?.number_of_tests_attempted ?? 0}
              </p>
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
              <p className="text-2xl font-semibold">
                {firestoreUser?.total_marks ?? 0}
              </p>
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
              <p className="text-2xl font-semibold text-black">
                {firestoreUser?.weak_topics?.length ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weak Topics */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weak Topics</h2>
          <div className="bg-white shadow-sm rounded-lg p-6">
            {firestoreUser?.weak_topics?.length > 0 ? (
              <ul className="list-disc ml-5">
                {firestoreUser.weak_topics.map((topic, index) => (
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

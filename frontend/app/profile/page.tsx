"use client";
import React, { useState } from "react";
import { BarChart, List, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/SideBar";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  if (!user || !user.details) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-center text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  const authUser = user?.details?.auth_user || {};
  const firestoreUser = user?.details?.firestore_user || {};

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`p-6 md:p-8 flex-1 transition-all ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-lg shadow-md">
          <Image
            src="/default.png"
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full border-2 border-lime-400"
            priority
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-blue-600">{authUser?.email ?? "No Email"}</h1>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Quizzes Attempted */}
          <Card className="bg-white shadow-sm border border-lime-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <List size={20} /> Quizzes Attempted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-800">
                {firestoreUser?.number_of_tests_attempted ?? 0}
              </p>
            </CardContent>
          </Card>

          {/* Total Marks */}
          <Card className="bg-white shadow-sm border border-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lime-500">
                <BarChart size={20} /> Total Marks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-800">
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
              <p className="text-2xl font-semibold text-red-600">
                {firestoreUser?.weak_topics?.length ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weak Topics Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weak Topics</h2>
          <div className="bg-white shadow-sm rounded-lg p-6">
            {firestoreUser?.weak_topics?.length > 0 ? (
              <ul className="list-disc ml-5 space-y-2">
                {firestoreUser.weak_topics.map((topic, index) => (
                  <li key={index} className="text-red-500 text-base">
                    {topic}
                  </li>
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

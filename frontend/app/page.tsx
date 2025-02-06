"use client";
import  Sidebar from "@/components/dashboard/Sidebar";
export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Student!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";
import { Users, BookOpen, Clock, Award } from "lucide-react";
const stats = [
  {
    title: "Total Students",
    value: "256",
    icon: Users,
    trend: { value: "12% vs last month", positive: true },
  },
  {
    title: "Active Courses",
    value: "8",
    icon: BookOpen,
    trend: { value: "2 new this month", positive: true },
  },
  {
    title: "Hours Taught",
    value: "124",
    icon: Clock,
    trend: { value: "18 this week", positive: true },
  },
  {
    title: "Avg. Performance",
    value: "85%",
    icon: Award,
    trend: { value: "5% vs last month", positive: true },
  },
];
export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <stat.icon className="w-8 h-8 text-primary-500" />
            <span
              className={`text-sm ${
                stat.trend.positive ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.trend.value}
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
          <p className="text-gray-600 text-sm">{stat.title}</p>
        </div>
      ))}
    </div>
  );
}

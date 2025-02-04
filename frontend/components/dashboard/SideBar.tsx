"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Students" },
  { icon: Calendar, label: "Schedule" },
  { icon: FileText, label: "Assignments" },
  { icon: Settings, label: "Settings" },
];
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <GraduationCap className="w-8 h-8 text-primary-500" />
        {!collapsed && (
          <span className="font-semibold text-lg text-gray-800">TeachAssist</span>
        )}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start ${
                  collapsed ? "px-2" : "px-4"
                } ${item.active ? "bg-primary-50 text-primary-500" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
    </div>
  );
}

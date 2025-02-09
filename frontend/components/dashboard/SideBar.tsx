"use client"

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  GraduationCap,
  Bell,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    active: true,
    badge: null
  },
  { 
    icon: Users, 
    label: "Students",
    badge: "23" 
  },
  { 
    icon: Calendar, 
    label: "Schedule",
    badge: "5" 
  },
  { 
    icon: FileText, 
    label: "Assignments",
    badge: "12" 
  },
  { 
    icon: Settings, 
    label: "Settings",
    badge: null 
  },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (c: boolean) => void }) {
  return (
    <div
      className={`h-screen bg-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      } fixed top-0 left-0 flex flex-col border-r border-gray-200`}
    >
      {/* Header - Fixed height for consistent alignment */}
      <div className="h-16 p-4 flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
          <GraduationCap className="w-6 h-6" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-bold text-lg truncate">
              <span className="text-lime-400">Edu</span>
              <span className="text-blue-600">Assist</span>
            </h2>
            <p className="text-xs text-gray-500">Educational Platform</p>
          </div>
        )}
      </div>

      {/* Rest of the component stays the same */}
      <div className="h-14 px-4">
        {!collapsed && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        )}
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1 py-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className={`w-full h-10 justify-start ${
                item.active 
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
                  : "hover:bg-gray-50 text-gray-600 hover:text-blue-600"
              } transition-all duration-200 relative group`}
            >
              <div className="flex items-center min-w-[2rem] justify-center">
                <item.icon className={`w-5 h-5 ${
                  item.active ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                }`} />
              </div>
              {!collapsed && (
                <div className="flex flex-1 items-center">
                  <span className={`${
                    item.active ? "font-medium" : "font-normal"
                  }`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Button>
          ))}
        </div>
      </nav>

      <div className="h-20 px-4 border-t border-gray-200">
        {!collapsed ? (
          <div className="py-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">Jai Khanna</h4>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 hover:bg-gray-100 text-gray-400"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="py-4 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        )}
      </div>

      <div className="h-14 p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full hover:bg-gray-50 text-gray-400"
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
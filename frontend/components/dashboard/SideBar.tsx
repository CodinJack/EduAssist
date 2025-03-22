"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Users,
  FileText,
  ChevronLeft,
  GraduationCap,
  Bell,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Practice", path: "/practice" },
  { icon: FileText, label: "Quizzes", path: "/quiz" },
  { icon: FileText, label: "Tutorial", path: "/tutorial" },
  { icon: Users, label: "Leaderboard", path: "/leaderboard" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const { fetchUser, logout } = useAuth(); 
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Function to fetch user data
  useEffect(() => {
    const handleUserDataFetch = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    handleUserDataFetch();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await logout(); 
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`h-screen bg-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      } fixed top-0 left-0 flex flex-col border-r border-gray-200`}
    >
      {/* Sidebar Header */}
      <div className="h-16 p-7 mt-5 flex items-center gap-3">
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

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <div className="space-y-1 py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Button
                key={item.label}
                variant={isActive ? "default" : "ghost"}
                className={`w-full h-10 justify-start ${
                  isActive
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "hover:bg-gray-50 text-gray-600 hover:text-blue-600"
                } transition-all duration-200 relative group`}
                onClick={() => router.push(item.path)}
              >
                <div className="flex items-center min-w-[2rem] justify-center">
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-600"
                    }`}
                  />
                </div>
                {!collapsed && (
                  <div className="flex flex-1 items-center">
                    <span className={isActive ? "font-medium" : "font-normal"}>
                      {item.label}
                    </span>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="h-20 px-4 border-t border-gray-200">
        {!collapsed ? (
          <div className="py-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {user ? user.email || "User" : "Loading..."}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {user ? "Student" : "Loading..."}
              </p>
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
              <User className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="h-14 p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2 text-gray-400 group-hover:text-red-600" />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>

      {/* Collapse Button */}
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

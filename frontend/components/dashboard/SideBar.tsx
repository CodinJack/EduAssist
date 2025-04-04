import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  User, 
  GraduationCap, 
  LogOut,
  BookOpen,
  Award,
  BarChart,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Practice", path: "/practice" },
  { icon: FileText, label: "Quizzes", path: "/quiz" },
  { icon: BarChart, label: "Tutorial", path: "/tutorial" },
  { icon: Award, label: "Leaderboard", path: "/leaderboard" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  const handleMouseEnter = () => {
    setCollapsed(false);
    setIsHovered(true);
  }
  
  const handleMouseLeave = () => {
    setCollapsed(true);
    setIsHovered(false);
  }

  const handleLogout = async () => {
    try {
      logout();
      handleNavigation("/")
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRestrictedNavigation = (path: string) => {
    const restrictedPaths = ["/profile", "/quiz"];
    if (!user && restrictedPaths.includes(path)) {
      toast.error("Login First");
      return;
    }
    handleNavigation(path)
  };

  // Function to determine if a menu item is active based on the current path
  const isActive = (path: string) => {
    // Use window.location for client-side route detection
    return typeof window !== 'undefined' && window.location.pathname.startsWith(path);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="h-screen fixed top-0 left-0 flex flex-col z-50 transition-all duration-75 border-r bg-gradient-to-b from-white to-gray-50 shadow-sm"
        initial={{ width: "5rem" }}
        animate={{ width: collapsed ? "5rem" : "16rem" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 mt-5 flex items-center gap-3">
          <motion.div 
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-quiz-purple to-quiz-blue text-white shadow-md"
          >
            <Brain className="w-6 h-6" />
          </motion.div>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-bold text-lg cursor-pointer" onClick={()=>{handleNavigation('/')}}>
                  <span className="bg-gradient-to-r from-quiz-purple to-quiz-blue bg-clip-text text-transparent">EduAssist</span>
                </h2>
                <p className="text-xs text-muted-foreground">Master your knowledge</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <motion.div key={item.label} whileHover={{ x: 4 }} className="relative">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full h-10 justify-start rounded-lg",
                      active 
                        ? "bg-gradient-to-r from-quiz-purple/10 to-quiz-blue/10 text-quiz-purple hover:from-quiz-purple/20 hover:to-quiz-blue/20" 
                        : "hover:bg-gray-100 text-gray-600 hover:text-quiz-purple"
                    )}
                    onClick={() => handleRestrictedNavigation(item.path)}
                  >
                    <div className="flex items-center min-w-[2rem] justify-center">
                      <item.icon className={cn(
                        "w-5 h-5", 
                        active ? "text-quiz-purple" : "text-gray-500"
                      )} />
                    </div>
                    
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div 
                          className="flex flex-1 items-center overflow-hidden"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className={active ? "font-medium ml-2" : "font-normal ml-2"}>{item.label}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {active && (
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-quiz-purple to-quiz-blue rounded-r-full"
                        layoutId="activeIndicator"
                      />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {isPending && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          </div>
        )}

        {/* User Info */}
        <div className="px-4 py-3 border-t border-gray-200">
          <AnimatePresence>
            {isHovered ? (
              <motion.div className="py-3 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-quiz-purple/20 to-quiz-blue/20 flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-quiz-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">{user ? user.email : "Guest"}</h4>
                  <p className="text-xs text-gray-500 truncate">{user ? "Active Student" : "Not logged in"}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div className="py-3 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quiz-purple/20 to-quiz-blue/20 flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-quiz-purple" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Logout Button */}
        <div className="h-14 p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center justify-start text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg" 
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2 text-gray-500" />
            <AnimatePresence>
              {isHovered && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }} 
                  animate={{ opacity: 1, width: "auto" }} 
                  exit={{ opacity: 0, width: 0 }} 
                  transition={{ duration: 0.2 }}
                >
                  {user && user.email !== "guest@example.com" ? "Log Out" : "Go back"}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;
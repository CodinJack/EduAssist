"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  User, 
  GraduationCap, 
  LogOut,
  BookOpen,
  Award,
  BarChart 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Practice", path: "/practice" },
  { icon: FileText, label: "Quizzes", path: "/quiz" },
  { icon: BarChart, label: "Tutorial", path: "/tutorial" },
  { icon: Award, label: "Leaderboard", path: "/leaderboard" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
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

  return (
    <AnimatePresence>
      <motion.div
        className="h-screen bg-white transition-all duration-75 fixed top-0 left-0 flex flex-col border-r border-border shadow-sm z-50"
        initial={{ width: "5rem" }}
        animate={{ width: collapsed ? "5rem" : "16rem" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 mt-5 flex items-center gap-3">
          <motion.div 
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white"
          >
            <GraduationCap className="w-6 h-6" />
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
                <h2 className="font-bold text-lg" onClick={()=>{handleNavigation('/')}}>
                  <span className="text-accent">Edu</span>
                  <span className="text-primary">Assist</span>
                </h2>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <motion.div key={item.label} whileHover={{ x: 4 }}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full h-10 justify-start ${
                      isActive 
                        ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" 
                        : "hover:bg-secondary text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => handleRestrictedNavigation(item.path)}
                  >
                    <div className="flex items-center min-w-[2rem] justify-center">
                      <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
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
                          <span className={isActive ? "font-medium" : "font-normal"}>{item.label}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {isActive && (
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
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
        <div className="px-4 py-3 border-t border-border">
          <AnimatePresence>
            {isHovered ? (
              <motion.div className="py-3 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{user ? user.email : "Guest"}</h4>
                  <p className="text-xs text-muted-foreground truncate">{user ? "Active Student" : "Not logged in"}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div className="py-3 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Logout Button */}
                <div className="h-14 p-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full flex items-center justify-start text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-200" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-2 text-muted-foreground" />
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}>
                        {user && user.email !== "guest@example.com" ? "Log Out" : "Go back"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
      </motion.div>
    </AnimatePresence>
  );
}

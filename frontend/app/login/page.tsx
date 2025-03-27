"use client";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuroraBackground from "@/components/ui/AuroraBackground";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const { login, register, handleGuestLogin } = useAuth();
  const router = useRouter();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(loginEmail)) {
      toast.error("Invalid Email", {
        duration: 3000,
        position : 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });
      
      return;
    }
  
    setLoginLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      localStorage.setItem("guest", "false");
        toast.success("Success!", {
          duration: 4000,
          position : 'top-right',
          style: {
            background: "green",
            color: "white",
          },
        });
        handleNavigation(`/dashboard`);
      
    } catch (error: any) { 
      toast.error('Authentication failed', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });
    } finally {
      setLoginLoading(false);
    }
  };
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(registerEmail)) {
      toast.error("Invalid Email", {
        duration: 3000,
        position : 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    if (registerPassword.length < 8) {
      toast.error("Invalid Password", {
        duration: 3000,
        position : 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });

      return;
    }

    setRegisterLoading(true);
    
    try {
      await register(registerEmail, registerPassword);
      setMessage("Registration successful! Please log in.");
      toast.success("Registration successful! Please log in.", {
        duration: 5000,
        position : 'top-right',
        style: {
          background: "green",
          color: "white",
        },
      });
      setActiveTab("login");
    } catch (error) {
      toast.error("Try with a different email!", {
        duration: 3000,
        position : 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });

    } finally {
      setRegisterLoading(false);
    }
  };

  const continueAsGuest = async () => {
    try {
      await handleGuestLogin();
      localStorage.setItem("guest", "true");
      handleNavigation('/dashboard');
    } catch (err) {
      toast.error("Guest login failed", {
        duration: 3000,
        position : 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });

    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {isPending && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      <AuroraBackground className="min-h-screen flex flex-col items-center justify-center">
        <div className="absolute top-5 left-5 z-10">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full backdrop-blur-md bg-white/10 hover:bg-blue-600 transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md px-4 z-10"
        >
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
            >
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{message}</p>
            </motion.div>
          )}
          
          <Card className="border border-white/20 shadow-xl dark:shadow-slate-950/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl overflow-hidden">
            <CardHeader className="pb-6 pt-8 flex flex-col items-center space-y-2">
              <motion.div 
                className="h-16 w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-2 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <GraduationCap className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Welcome to EduAssist</CardTitle>
              <CardDescription className="text-center max-w-xs">
                {activeTab === "login" 
                  ? "Sign in to continue your learning journey" 
                  : "Join our community of learners today"}
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-3">
                <TabsList className="grid w-full grid-cols-2 mb-4 rounded-lg h-12 bg-slate-100/80 dark:bg-slate-800/80">
                  <TabsTrigger value="login" className="rounded-md text-sm p-2">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-md text-sm p-2 ">Create Account</TabsTrigger>
                </TabsList>
              </div>
              
              <AnimatePresence mode="wait">
                <TabsContent key="login" value="login" className="m-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleLogin}>
                      <CardContent className="space-y-4 px-6">
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium block mb-1">
                            Email address
                          </label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="your@email.com" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="rounded-md border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/30"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="text-sm font-medium">
                              Password
                            </label>
                            <Link href="#" className="text-xs text-primary hover:underline">
                              Forgot password?
                            </Link>
                          </div>
                          <div className="relative">
                            <Input 
                              id="password" 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="rounded-md border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/30 pr-10"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col px-6 pt-2 pb-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button 
                            type="submit" 
                            className="w-full rounded-md h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
                            disabled={loginLoading}
                          >
                            {loginLoading ? "Signing in..." : "Sign in"}
                          </Button>
                        </motion.div>
                        
                        <div className="mt-6 w-full">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">Or continue with</span>
                            </div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6"
                          >
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="w-full border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                              onClick={continueAsGuest}
                            >
                              Continue as guest
                            </Button>
                          </motion.div>
                        </div>
                        
                        <div className="mt-6 text-sm text-center text-muted-foreground">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => setActiveTab("register")}
                          >
                            Create one now
                          </button>
                        </div>
                      </CardFooter>
                    </form>
                  </motion.div>
                </TabsContent>
                
                <TabsContent key="register" value="register" className="m-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleRegister}>
                      <CardContent className="space-y-4 px-6">
                        <div className="space-y-2">
                          <label htmlFor="register-email" className="text-sm font-medium block mb-1">
                            Email address
                          </label>
                          <Input 
                            id="register-email" 
                            type="email" 
                            placeholder="your@email.com" 
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="rounded-md border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/30"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="register-password" className="text-sm font-medium block mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <Input 
                              id="register-password" 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              className="rounded-md border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/30 pr-10"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Password must be at least 8 characters
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="terms" 
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              required
                            />
                            <label htmlFor="terms" className="text-xs text-muted-foreground">
                              I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                            </label>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex flex-col px-6 pt-2 pb-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button 
                            type="submit" 
                            className="w-full rounded-md h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
                            disabled={registerLoading}
                          >
                            {registerLoading ? "Creating account..." : "Create account"}
                          </Button>
                        </motion.div>
                        
                        <div className="mt-6 text-sm text-center text-muted-foreground">
                          Already have an account?{" "}
                          <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => setActiveTab("login")}
                          >
                            Sign in
                          </button>
                        </div>
                      </CardFooter>
                    </form>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </Card>

          <div className="mt-8 text-center text-xs text-white/60">
            <p>© {new Date().getFullYear()} EduAssist. All rights reserved.</p>
          </div>
        </motion.div>
      </AuroraBackground>
    </div>
  );
}

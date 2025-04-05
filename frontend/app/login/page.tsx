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
  const { login, register, loginWithGoogle, handleGuestLogin } = useAuth();
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
        position: 'top-right',
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
        position: 'top-right',
        style: {
          background: "green",
          color: "white",
        },
      });
      handleNavigation(`/dashboard`);
      
    } catch (error: any) { 
      console.error("Login error:", error);
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
  
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      localStorage.setItem("guest", "false");
      toast.success("Google Sign-in Successful!", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: "green",
          color: "white",
        },
      });
      handleNavigation('/dashboard');
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed", {
        duration: 3000,
        position: 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(registerEmail)) {
      toast.error("Invalid Email", {
        duration: 3000,
        position: 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    if (registerPassword.length < 8) {
      toast.error("Password must be at least 8 characters", {
        duration: 3000,
        position: 'top-right',
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
        position: 'top-right',
        style: {
          background: "green",
          color: "white",
        },
      });
      setActiveTab("login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.code === "auth/email-already-in-use" 
        ? "Email already in use" 
        : "Registration failed", {
        duration: 3000,
        position: 'top-right',
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
      toast.success("Continuing as guest", {
        duration: 3000,
        position: 'top-right',
      });
      handleNavigation('/dashboard');
    } catch (err) {
      toast.error("Guest login failed", {
        duration: 3000,
        position: 'top-right',
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-auto relative">
      {isPending && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      <AuroraBackground className=" w-full flex flex-col items-center justify-center py-32 px-4">
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
          
          <div className="border border-white/20 shadow-xl dark:shadow-slate-950/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl overflow-hidden">
            <div className="pb-6 pt-8 flex flex-col items-center space-y-2">
              <motion.div 
                className="h-16 w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-2 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <GraduationCap className="h-8 w-8 text-white" />
              </motion.div>
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Welcome to EduAssist</div>
              <div className="text-center max-w-xs">
                {activeTab === "login" 
                  ? "Sign in to continue your learning journey" 
                  : "Join our community of learners today"}
              </div>
            </div>
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-3">
                <TabsList className="grid w-full grid-cols-2 mb-4 rounded-lg h-12 bg-slate-100/80 dark:bg-slate-800/80">
                  <TabsTrigger value="login" className="rounded-md text-sm p-2">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-md text-sm p-2">Create Account</TabsTrigger>
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
                      <div className="space-y-4 px-6">
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
                      </div>

                      <div className="flex flex-col px-6 pt-4 pb-6">
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
                          
                          <div className="mt-6 space-y-3">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full border-slate-200 dark:border-slate-800 hover:bg-blue-600 dark:hover:bg-slate-800 flex items-center justify-center"
                                onClick={handleGoogleSignIn}
                              >
                                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                                  </g>
                                </svg>
                                Sign in with Google
                              </Button>
                            </motion.div>
                            
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full border-slate-200 dark:border-slate-800 hover:bg-blue-600 dark:hover:bg-slate-800"
                                onClick={continueAsGuest}
                              >
                                Continue as guest
                              </Button>
                            </motion.div>
                          </div>
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
                      </div>
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
                      <div className="space-y-4 px-6">
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
                            I agree to the‎ ‎ 
                            <Link 
                              href="https://storage.googleapis.com/eduassist-legal-docs/TermsAndServices.pdf" 
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                               Terms of Service
                            </Link> 
                            ‎ and ‎  
                            <Link 
                              href="https://storage.googleapis.com/eduassist-legal-docs/PrivacyPolicy.pdf" 
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Privacy Policy
                            </Link>
                          </label>

                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col px-6 pt-4 pb-6">
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
                      </div>
                    </form>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>

          <div className="mt-8 text-center text-xs text-white/60">
            <p>© {new Date().getFullYear()} EduAssist. All rights reserved.</p>
          </div>
        </motion.div>
      </AuroraBackground>
    </div>
  );
}

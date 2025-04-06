"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/ui/AuroraBackground";

const NotFound = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.error("404 Error: User tried to access:", pathname);
  }, [pathname]);

  return (
    <AuroraBackground>
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-white/10">

          
          {/* Content */}
          <div className="mt-14 text-center">
            <h1 className="text-7xl font-bold text-slate-900 dark:text-white mt-4 drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/80">
              404
            </h1>
            
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white/90 mt-4 drop-shadow-sm">
              Page Not Found
            </h2>
            
            <p className="mt-4 text-slate-600 dark:text-white/70">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-slate-300 dark:border-white/30 dark:text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              
              <Button 
                asChild
                className="bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm text-white"
              >
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </a>
              </Button>
            </div>
            
            <div className="mt-8 text-xs text-slate-500 dark:text-white/50">
              If you believe this is a mistake, please contact our support team.
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>

  );
};

export default NotFound;

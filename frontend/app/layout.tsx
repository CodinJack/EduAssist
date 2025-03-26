"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Toaster as Sonner} from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const inter = Inter({ subsets: ["latin"] });
// export const metadata: Metadata = {
//   title: "EduAssist",
//   description: "A modern teaching assistant platform!",
// };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <Toaster position="top-right" reverseOrder={false} />
              <Sonner />
              {children}
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>

        </body>
      </html>
    
  );
}

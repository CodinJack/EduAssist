import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "EduAssist",
  description: "A modern teaching assistant platform!",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
        <Toaster position="top-right" reverseOrder={false} />
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    
  );
}

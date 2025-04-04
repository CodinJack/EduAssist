"use client"
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <html lang="en">
      <body >
        <AuthProvider>
            {loading && <Loading />}
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

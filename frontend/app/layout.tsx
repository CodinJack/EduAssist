import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

// Metadata for the page
export const metadata = {
  title: "EduAssist",
  description: "Master topics with AI-powered quizzes, practice, and smart notes.",
  icons: {
    icon: "favicon.ico", 
    shortcut: "favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate OAuth process
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Login Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/default.png" // Change this to your app logo
            alt="App Logo"
            width={60}
            height={60}
            className="rounded-full border border-lime-400"
            priority
          />
          <h1 className="text-2xl font-bold text-blue-600 mt-2">EduAssist</h1>
          <p className="text-gray-500 text-sm">Climb your way to success</p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          <FcGoogle size={22} />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};
export default LoginPage;

"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const { login, register } = useAuth();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // For showing registration success message
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to check if password length is at least 8 characters
  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      if (isRegistering) {
        await register(formState.email, formState.password);
        setMessage("Registration successful! Please log in with the same credentials.");
        setIsRegistering(false); // Switch to login mode
      } else {
        await login(formState.email, formState.password);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setMessage("Authentication failed. Please try again.");
    }
    
    setLoading(false);
  };

  const toggleAuthMode = () => {
    setIsRegistering((prev) => !prev);
    setMessage(""); // Clear message when switching modes
  };

  // Enable form submission only if email is valid and password is long enough
  const isFormComplete =
    isValidEmail(formState.email) &&
    isValidPassword(formState.password);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left Side (Image Section) */}
      <div className="hidden lg:flex w-1/2 p-8 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 opacity-90" />

        <div className="relative w-full max-w-2xl text-white z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Design that puts <br /> experience first
              </h1>
              <p className="text-xl text-white/80 max-w-lg mt-4">
                Join our platform for a seamless experience that prioritizes simplicity, beauty, and functionality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Form Section) */}
      <div className="flex w-full lg:w-1/2 px-6 sm:px-8 md:px-12 justify-center items-center">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isRegistering ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-gray-600 mt-2">
                {isRegistering
                  ? "Join our community of designers and creators"
                  : "Sign in to access your account"}
              </p>
            </div>

            {message && <p className="text-center text-sm text-green-600">{message}</p>}

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 bg-gray-100/90 border-0 rounded-lg focus:ring-2 focus:ring-blue-500/50"
                  placeholder="you@example.com"
                  value={formState.email}
                  onChange={handleInputChange}
                />
                {!isValidEmail(formState.email) && formState.email.length > 0 && (
                  <p className="text-red-600 text-sm">Enter a valid email</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-100/90 border-0 rounded-lg focus:ring-2 focus:ring-blue-500/50"
                  placeholder="••••••••"
                  value={formState.password}
                  onChange={handleInputChange}
                />
                {formState.password.length > 0 && !isValidPassword(formState.password) && (
                  <p className="text-red-600 text-sm">Password must be at least 8 characters</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 font-medium rounded-lg bg-blue-600 text-white ${
                    !isFormComplete || loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading || !isFormComplete}
                >
                  {loading ? "Processing..." : isRegistering ? "Create account" : "Sign in"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center border-t border-gray-200 pt-4">
              <p className="text-gray-600">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
                <button className="ml-1.5 text-blue-600 font-medium hover:underline" onClick={toggleAuthMode} disabled={loading}>
                  {isRegistering ? "Sign in" : "Create account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

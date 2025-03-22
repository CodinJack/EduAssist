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
  const [formVisible, setFormVisible] = useState(true); // Prevents undefined error
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault(); // Prevents default form submission
    setLoading(true);
    try {
      if (isRegistering) {
        await register(formState.email, formState.password);
      } else {
        await login(formState.email, formState.password);
      }
      router.push("/profile");
    } catch (error) {
      console.error("Auth Error:", error);
    }
    setLoading(false);
  };

  const toggleAuthMode = () => {
    setIsRegistering((prev) => !prev);
  };

  const isFormComplete = formState.email && formState.password && (!isRegistering);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left Side (Image Section) */}
      <div className="hidden lg:flex w-1/2 p-8 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 opacity-90" />

        <div className={`relative w-full max-w-2xl text-white z-10 ${formVisible ? 'opacity-100 translate-x-0 transition-all duration-700 ease-out' : 'opacity-0 -translate-x-10'}`}>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-2">
                Premium Experience
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Design that puts <br /> experience first
              </h1>
              <p className="text-xl text-white/80 max-w-lg mt-4">
                Join our platform for a seamless experience that prioritizes simplicity, beauty, and functionality.
              </p>
            </div>

            <div className="pt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-white/10 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">Intuitive Design</h3>
                  <p className="text-white/80">Every element carefully crafted with purpose and clarity.</p>
                </div>
                <div className="p-5 rounded-xl bg-white/10 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">Thoughtful Details</h3>
                  <p className="text-white/80">Premium experience in every interaction across the platform.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Form Section) */}
      <div className="flex w-full lg:w-1/2 px-6 sm:px-8 md:px-12 justify-center items-center">
        <div className={`w-full max-w-md transition-all duration-500 ease-in-out ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isRegistering ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-gray-600 mt-2">
                {isRegistering
                  ? "Join our community of designers and creators"
                  : "Sign in to access your account"}
              </p>
            </div>

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
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 font-medium rounded-lg bg-blue-600 text-white ${!isFormComplete && !loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading || !isFormComplete}
                >
                  {loading ? "Processing..." : isRegistering ? "Create account" : "Sign in"}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-4 text-center border-t border-gray-200">
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

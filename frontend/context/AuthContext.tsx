"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, getUserData } from "../services/authService";
import Cookies from "js-cookie";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Adjust according to your firebaseConfig path

const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  handleGuestLogin: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authKey, setAuthKey] = useState(0); // 🔥 Force re-render on login

  useEffect(() => {
    console.log("AuthProvider useEffect triggered", authKey); // Debugging

    const token = Cookies.get("idToken");

    if (token) {
      getUserData()
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [authKey]);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    if (response) {
      const userData = await getUserData();
      setUser(userData);
      setAuthKey((prev) => prev + 1); // 🔥 Force re-render
    }
  };

  const register = async (email: string, password: string) => {
    const response = await registerUser(email, password);
    if (response) {
      const userData = await getUserData();
      setUser(userData);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    Cookies.remove("idToken"); // Clear cookies on logout
  };

  const handleGuestLogin = async () => {
  try {
    const result = await signInAnonymously(auth); // Make sure you're using the correct method from Firebase Auth
    console.log("Guest login successful:", result.user);
    setUser({ firebase_user: result.user, details: null });
    Cookies.set("idToken", result.user.uid, { expires: 7 });
    Cookies.set("mode", "guest", { expires: 7 });
    setAuthKey((prev) => prev + 1);
  } catch (err: any) {
    console.error("Guest login error:", err.message);
  }
};

  return (
    <AuthContext.Provider value={{ user, login, register, logout, handleGuestLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

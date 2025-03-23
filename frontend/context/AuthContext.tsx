"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, getUserData } from "../services/authService";
import Cookies from "js-cookie";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const idToken = Cookies.get("idToken");
      if (!idToken) {
        setLoading(false);
        return;
      }
      const userData = await getUserData(idToken);
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []); // ✅ Only runs ONCE when component mounts


  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    if (response) {
      const userData = await getUserData();
      setUser(userData);
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
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

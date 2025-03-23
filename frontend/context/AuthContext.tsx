"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, getUserData } from "../services/authService";
import Cookies from "js-cookie";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authKey, setAuthKey] = useState(0); // 🔥 Force re-render on login

  useEffect(() => {
      console.log("AuthProvider useEffect triggered", authKey); // Debugging

      const token = Cookies.get("idToken");

      if (token) {
          getUserData(token)
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
      setAuthKey((prev) => prev ); // 🔥 Force re-render
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
      { children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

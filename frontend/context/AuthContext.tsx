"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { 
    loginUser as loginUserService, 
    registerUser as registerUserService, 
    signInWithGoogle as signInWithGoogleService, 
    logoutUser, 
    getUserData 
} from "../services/authService";
import { auth, db, doc, setDoc } from "../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userData = await getUserData(currentUser.uid); // Fetch full user data
                setUser(userData ? { ...userData, uid: currentUser.uid } : null);
                console.log("Current user is:", userData);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const userObj = await loginUserService(email, password);
            return userObj;
        } catch (error: any) {
            console.error("Login error:", error.message);
            throw error;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            // Register user with Firebase Auth
            const userCredential = await registerUserService(email, password);
            const user = userCredential.user;
    
            // Define additional fields for Firestore
            const userData = {
                uid: user.uid,
                email: user.email,
                bookmarkedQuestions: [],
                weakTopics: [],
                averageMarks: 0,
                currentStreak: 0,
                maxStreak: 0,
                lastQuizSubmissionDate: null,
            };
    
            // Store user data in Firestore
            await setDoc(doc(db, "users", user.uid), userData);
    
            // Update state
            setUser(userData);
            return userData;
        } catch (error: any) {
            console.error("Register error:", error.message);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const userData = await signInWithGoogleService();
            // Check if user already exists in Firestore, if not create a new record
            const existingUser = await getUserData(userData.uid);
            if (!existingUser) {
                const newUserData = {
                    uid: userData.uid,
                    email: userData.email,
                    bookmarkedQuestions: [],
                    weakTopics: [],
                    averageMarks: 0,
                    currentStreak: 0,
                    maxStreak: 0,
                    lastQuizSubmissionDate: null,
                };
                await setDoc(doc(db, "users", userData.uid), newUserData);
            }
            return userData;
        } catch (error: any) {
            console.error("Google Sign-In error:", error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error: any) {
            console.error("Logout error:", error.message);
            throw error;
        }
    };

    // Add guest login functionality
    const handleGuestLogin = async () => {
        // Set a temporary guest user
        const guestUser = {
            uid: "guest-" + Math.random().toString(36).substring(2, 9),
            email: "guest@example.com",
            isGuest: true,
            bookmarkedQuestions: [],
            weakTopics: [],
            averageMarks: 0,
            currentStreak: 0,
            maxStreak: 0,
            lastQuizSubmissionDate: null,
        };
        setUser(guestUser);
        return guestUser;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            loginWithGoogle, 
            logout, 
            loading,
            handleGuestLogin 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
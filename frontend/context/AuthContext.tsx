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

// Define proper TypeScript types
interface User {
  uid: string;
  email: string | null;
  displayName?: string;
  photoURL?: string;
  isGuest?: boolean;
  bookmarkedQuestions: string[];
  weakTopics: string[];
  averageMarks: number;
  currentStreak: number;
  maxStreak: number;
  lastQuizSubmissionDate: Date | null;
  numberOfTestsAttempted : number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  handleGuestLogin: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            try {
                if (currentUser) {
                    // Fetch full user data
                    const userData = await getUserData(currentUser.uid);
                    
                    if (userData) {
                        // Important: Merge Firebase Auth user data with Firestore data
                        setUser({
                            ...userData,
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName || userData.displayName,
                            photoURL: currentUser.photoURL || userData.photoURL
                        });
                    } else {
                        // User exists in Auth but not in Firestore
                        const newUserData = {
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName || '',
                            photoURL: currentUser.photoURL || '',
                            bookmarkedQuestions: [],
                            weakTopics: [],
                            averageMarks: 0,
                            currentStreak: 0,
                            maxStreak: 0,
                            lastQuizSubmissionDate: null,
                            numberOfTestsAttempted:0,
                        };
                        
                        // Create user document in Firestore
                        await setDoc(doc(db, "users", currentUser.uid), newUserData);
                        setUser(newUserData);
                        console.log("Created new user document:", newUserData);
                    }
                } else {
                    setUser(null);
                    console.log("No user logged in");
                }
            } catch (error) {
                console.error("Error in auth state change:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const userData = await loginUserService(email, password);
            setUser(userData);
            return userData;
        } catch (error: any) {
            console.error("Login error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            setLoading(true);
            // Register user with Firebase Auth
            const userCredential = await registerUserService(email, password);
            const firebaseUser = userCredential.user;
    
            // Define additional fields for Firestore
            const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                bookmarkedQuestions: [],
                weakTopics: [],
                averageMarks: 0,
                currentStreak: 0,
                maxStreak: 0,
                lastQuizSubmissionDate: null,
                numberOfTestsAttempted:0,
            };
    
            // Store user data in Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), userData);
    
            // Update state
            setUser(userData);
            return userData;
        } catch (error: any) {
            console.error("Register error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            const userData = await signInWithGoogleService();
            setUser(userData);
            return userData;
        } catch (error: any) {
            console.error("Google Sign-In error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await logoutUser();
            setUser(null);
        } catch (error: any) {
            console.error("Logout error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Add guest login functionality
    const handleGuestLogin = async () => {
        setLoading(true);
        try {
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
                numberOfTestsAttempted:0,
            };
            setUser(guestUser);
            return guestUser;
        } finally {
            setLoading(false);
        }
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
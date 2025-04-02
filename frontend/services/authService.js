import Cookies from "js-cookie";
import { auth, googleProvider } from "../firebaseConfig";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut 
} from "firebase/auth";
import { db, doc, getDoc, setDoc } from "../firebaseConfig";

// ✅ Register User
export const registerUser = async (email, password) => {
    try {
        // Register the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store ID token in cookies
        const idToken = await userCredential.user.getIdToken();
        Cookies.set("idToken", idToken, { secure: true, sameSite: "Strict" });

        console.log("User registered successfully.");
        return userCredential; // Return the full userCredential
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

// ✅ Login User
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get ID token and store in cookies
        const idToken = await user.getIdToken();
        Cookies.set("idToken", idToken, { secure: true, sameSite: "Strict" });

        console.log("Login successful.");
        
        // Get user data from Firestore
        const userData = await getUserData(user.uid);
        return userData || user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

// ✅ Google Sign-In
export const signInWithGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;

        // Get ID token and store in cookies
        const idToken = await user.getIdToken();
        Cookies.set("idToken", idToken, { secure: true, sameSite: "Strict" });

        console.log("Google Sign-In successful.");
        
        // Check if user exists in Firestore, if not create a basic record
        const userData = await getUserData(user.uid);
        if (!userData) {
            const newUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                bookmarkedQuestions: [],
                weakTopics: [],
                averageMarks: 0,
                currentStreak: 0,
                maxStreak: 0,
                lastQuizSubmissionDate: null,
            };
            await setDoc(doc(db, "users", user.uid), newUser);
            return newUser;
        }
        
        return userData;
    } catch (error) {
        console.error("Google Sign-In error:", error);
        throw error;
    }
};

// ✅ Logout User
export const logoutUser = async () => {
    try {
        await signOut(auth);
        Cookies.remove("idToken"); // Remove token from cookies
        console.log("User logged out.");
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};

export const getUserData = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("User data not found in Firestore");
            return null;
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
};
import Cookies from "js-cookie";
import { auth, googleProvider } from "../firebaseConfig";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut 
} from "firebase/auth";
import { db, doc, getDoc, setDoc, collection, getDocs} from "../firebaseConfig";

// ✅ Register User
export const registerUser = async (email, password) => {
    try {
        // Register the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store ID token in cookies
        const idToken = await userCredential.user.getIdToken();
        Cookies.set("idToken", idToken, { 
            secure: true, 
            sameSite: "Strict", 
            expires: 1 // 1 day (24 hours)
          });
          
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
        Cookies.set("idToken", idToken, { 
            secure: true, 
            sameSite: "Strict", 
            expires: 1 // 1 day (24 hours)
          });
          
        console.log("Login successful, user ID:", user.uid);
        
        // Get user data from Firestore
        const userData = await getUserData(user.uid);
        
        if (userData) {
            // Merge auth user data with Firestore data
            return {
                ...userData,
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userData.displayName,
                photoURL: user.photoURL || userData.photoURL
            };
        } else {
            // Create a user document if it doesn't exist
            const newUserData = {
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
                isstreakmaintained:false
            };
            
            await setDoc(doc(db, "users", user.uid), newUserData);
            console.log("Created new user document for existing auth user");
            return newUserData;
        }
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
        Cookies.set("idToken", idToken, { 
            secure: true, 
            sameSite: "Strict", 
            expires: 1 // 1 day (24 hours)
          });
          
        console.log("Google Sign-In successful, user ID:", user.uid);
        
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
                isstreakmaintained:false
            };
            await setDoc(doc(db, "users", user.uid), newUser);
            console.log("Created new user document for Google auth");
            return newUser;
        }
        
        // Merge auth user data with Firestore data
        return {
            ...userData,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || userData.displayName,
            photoURL: user.photoURL || userData.photoURL
        };
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
    if (!uid) {
        console.error("No user ID provided to getUserData");
        return null;
    }
    
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
};

export const getAllUsers = async () => {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
};

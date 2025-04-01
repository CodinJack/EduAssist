import Cookies from "js-cookie";
import { auth } from "../firebaseConfig"; // ✅ Import Firebase Auth
import { createUserWithEmailAndPassword } from "firebase/auth"; 
// ✅ LOGIN FUNCTION
export const loginUser = async (email, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Allow backend to set cookies
        });

        const data = await response.json();
        if (response.ok) {
            Cookies.set("idToken", data.idToken, { secure: true, sameSite: "Strict" }); // Store token in cookie
            console.log("Login successful.");
            return data;
        } else {
            throw new Error("Login failed.");
        }
        
    } catch (error) {
        throw new Error("Error logging in.");
    }
};

// ✅ REGISTER FUNCTION
export const registerUser = async (email, password) => {
    try {
        // ✅ Sign in user and get ID token
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // alert(userCredential);
        const idToken = await userCredential.user.getIdToken();  // ✅ Get full Firebase token
        // console.log("🔥 Firebase ID Token:", idToken);
        alert("fucker");
        console.log("🔥 Firebase ID Token:", idToken);  // Debugging

        const response = await fetch("http://127.0.0.1:8000/auth/register/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`  // ✅ Send full ID token
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            console.log("✅ Registration successful:", data);
            return data;
        } else {
            throw new Error("❌ Error registering.");
        }
    } catch (error) {
        console.error("❌ Error registering:", error);
        throw new Error("Error registering.");
    }
};


export const getUserData = async () => {
    const token = Cookies.get("idToken");
    if (!token) return null;

    try {
        const response = await fetch("http://127.0.0.1:8000/auth/user/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        return await response.json();
    } catch (error) {
        throw new Error("Failed to fetch user data");
    }
};

// ✅ LOGOUT FUNCTION (Clears Cookies)
export const logoutUser = () => {
    Cookies.remove("idToken");
    console.log("User logged out.");
};

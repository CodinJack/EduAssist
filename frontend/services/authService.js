import Cookies from "js-cookie";

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
        console.log("Login Response:", data);  // Debugging

        if (response.ok) {
            Cookies.set("idToken", data.idToken, { secure: true, sameSite: "Strict" }); // Store token in cookie
            console.log("Login successful:", data);
            return data;
        } else {
            console.error("Login failed:", data);
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
};

// ✅ REGISTER FUNCTION
export const registerUser = async (email, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/auth/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Registration successful:", data);
            return data;
        } else {
            console.error("Registration failed:", data);
        }
    } catch (error) {
        console.error("Error registering:", error);
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
        console.error("Error fetching user data:", error);
        return null;
    }
};

// ✅ LOGOUT FUNCTION (Clears Cookies)
export const logoutUser = () => {
    Cookies.remove("idToken");
    console.log("User logged out.");
};

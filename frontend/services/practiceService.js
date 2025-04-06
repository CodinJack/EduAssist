import Cookies from "js-cookie";

const BASE_URL = process.env.PRODUCTION_BACKEND_URL || "http://127.0.0.1:8000";

export const createPracticeQuestions = async (topic) => {
    try {
        const idToken = Cookies.get("idToken"); // Get token
        if (!idToken) {
            console.error("❌ No idToken found in cookies!");
            throw new Error("Authentication token missing");
        }

        const response = await fetch(`${BASE_URL}/api/practice/create_practice_questions/`, {
            method: "POST",
            credentials: "include", // Ensures cookies are sent
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`, // Send token in header
            },
            body: JSON.stringify({ topic }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.questions || !Array.isArray(data.questions)) {
            throw new Error("Invalid API response format");
        }

        return data.questions.map((q) => ({
            question: q.question,
            options: Object.values(q.options),
            correct_answer: q.correct_answer,
            hint: q.hints,
            solution: q.solution,
        }));
    } catch (error) {
        console.error("Error creating practice questions:", error);
        return [];
    }
};

import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust this import based on your setup

export const deleteWeakTopic = async (userId, weakTopic) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnap.data();
    const currentWeakTopics = userData.weakTopics || [];

    // Check if the weakTopic exists
    if (!currentWeakTopics.includes(weakTopic)) {
      return { message: "Weak Topic not present — no changes made" };
    }

    // Remove the weakTopic from the array
    await updateDoc(userRef, {
      weakTopics: arrayRemove(weakTopic),
    });

    return { message: "Weak Topic deleted successfully" };
  } catch (error) {
    console.error("Error deleting Weak Topic:", error);
    throw error;
  }
};

import Cookies from "js-cookie";

const BASE_URL = process.env.PRODUCTION_BACKEND_URL || "http://127.0.0.1:8000/api/practice";

export const createPracticeQuestions = async (topic) => {
    try {
        const idToken = Cookies.get("idToken"); // Get token
        if (!idToken) {
            console.error("❌ No idToken found in cookies!");
            throw new Error("Authentication token missing");
        }

        const response = await fetch(`${BASE_URL}/create_practice_questions/`, {
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

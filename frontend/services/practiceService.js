import Cookies from "js-cookie";

const BASE_URL = process.env.PRODUCTION_BACKEND_URL || "http://127.0.0.1:8000/api/practice";

export const createPracticeQuestions = async (topic) => {
    try {
        const idToken = Cookies.get("idToken"); // Get idToken using js-cookie
        if (!idToken) {
            throw new Error("No idToken found in cookies");
        }

        const response = await fetch(`http://127.0.0.1:8000/api/practice/create_practice_questions/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
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
            options: Object.values(q.options), // Extract options as an array
            correct_answer: q.correct_answer,
            hint: q.hints,
            solution: q.solution,
        }));
    } catch (error) {
        console.error("Error creating practice questions:", error);
        return []; // Return an empty array instead of null
    }
};

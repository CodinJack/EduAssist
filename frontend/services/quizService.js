const BASE_URL = "http://127.0.0.1:8000"; // Update if your backend URL differs

// Create a new quiz
export const createQuiz = async ({ topic, difficulty, numQuestions, timeLimit, userId }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/quizzes/create_quiz`, {
      method: "POST",
      body: JSON.stringify({ topic, difficulty, numQuestions, timeLimit, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to create quiz");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

// Fetch all quizzes for a specific user
export const getAllQuizzes = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/quizzes/get_all_quizzes/`, {
      method: "GET",
      body: JSON.stringify({ "userId" : userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Fetch a specific quiz by ID
export const getQuizById = async (quizId, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/quizzes/get_quiz/${quizId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Quiz not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

// Delete a quiz by ID
export const deleteQuiz = async (quizId, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/quizzes/delete_quiz/${quizId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete quiz");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

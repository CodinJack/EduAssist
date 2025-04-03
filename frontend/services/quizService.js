import Cookies from 'js-cookie';
import { doc, collection, addDoc, getDoc, getDocs, deleteDoc, updateDoc, arrayUnion, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 

const BASE_URL = "http://127.0.0.1:8000/api/quizzes"; // For the backend API calls

// Create a new quiz - generate questions with AI and then save to Firestore
export const createQuiz = async ({ topic, difficulty, numQuestions, timeLimit, userId }) => {
  try {
    const idToken = Cookies.get("idToken"); // Get token
    if (!idToken) {
        console.error("❌ No idToken found in cookies!");
        throw new Error("Authentication token missing");
    }

    // 1. First, generate questions through the backend
    const response = await fetch(`${BASE_URL}/create_quiz`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`, // Send token in header
        },
        body: JSON.stringify({ topic, difficulty, numQuestions, timeLimit, userId }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const quizData = result.data;
    
    // 2. Now save the quiz to Firestore
    quizData.createdAt = serverTimestamp(); // Add server timestamp

    // Add quiz to the "quizzes" collection
    const quizRef = await addDoc(collection(db, "quizzes"), quizData);
    const quizId = quizRef.id;
    
    // Add the quiz ID to the user's quizzes list
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        quizzes: arrayUnion(quizId)
      });
      console.log(`Quiz ID ${quizId} added to user ${userId}'s quizzes list.`);
    } else {
      console.error(`User ${userId} not found!`);
      throw new Error("User not found");
    }

    return {
      id: quizId,
      message: "Quiz created successfully"
    };
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

// Fetch all quizzes for a specific user
export const getAllQuizzes = async (userId) => {
  try {
    const quizzesQuery = query(collection(db, "quizzes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(quizzesQuery);
    
    const quizzes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Fetch a specific quiz by ID
export const getQuizById = async (quizId) => {
  try {
    const quizRef = doc(db, "quizzes", quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      throw new Error("Quiz not found");
    }

    return {
      id: quizDoc.id,
      ...quizDoc.data()
    };
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

// Delete a quiz by ID
export const deleteQuiz = async (quizId) => {
  try {
    const quizRef = doc(db, "quizzes", quizId);
    await deleteDoc(quizRef);
    
    return { message: "Quiz deleted successfully" };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

// Update a specific answer in a quiz
export const updateAnswer = async (quizId, questionIndex, attemptedOption) => {
  try {
    const quizRef = doc(db, "quizzes", quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      throw new Error("Quiz not found");
    }

    const quizData = quizDoc.data();
    const questions = quizData.questions || [];

    if (questionIndex < 0 || questionIndex >= questions.length) {
      throw new Error("Invalid question index");
    }

    // Update only the attempted_option field
    questions[questionIndex].attempted_option = attemptedOption;
    await updateDoc(quizRef, { questions });

    return { message: "Answer updated successfully" };
  } catch (error) {
    console.error("Error updating answer:", error);
    throw error;
  }
};

// Submit a quiz and calculate score
export const submitQuiz = async (quizId, userId) => {
  try {
    // Get the quiz document
    const quizRef = doc(db, "quizzes", quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      throw new Error("Quiz not found");
    }

    const quizData = quizDoc.data();
    const questions = quizData.questions || [];
    
    const totalQuestions = questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    const wrongTags = {};

    // Check each question's attempted_option against correct_answer
    for (const question of questions) {
      const attemptedOption = question.attempted_option;
      const correctAnswer = question.correct_answer;

      if (attemptedOption === correctAnswer) {
        correctCount += 1;
      } else {
        wrongCount += 1;
        const tags = question.tags || [];
        for (const tag of tags) {
          wrongTags[tag] = (wrongTags[tag] || 0) + 1;
        }
      }
    }

    // Calculate score percentage
    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    // Update the user's statistics
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    
    // Get current stats or initialize if they don't exist
    const currentTests = userData.number_of_tests_attempted || 0;
    const currentTotalMarks = userData.total_marks || 0;
    
    // Calculate new average marks
    const newTestsCount = currentTests + 1;
    const newTotalMarks = ((currentTotalMarks * currentTests) + scorePercentage) / newTestsCount;
    const newWrongTags = Object.entries(wrongTags)
      .filter(([_, count]) => count >= 2)
      .map(([tag, _]) => tag);

    // Update user document with new stats
    await updateDoc(userRef, {
      number_of_tests_attempted: newTestsCount,
      total_marks: newTotalMarks,
      wrong_tags: newWrongTags
    });

    return {
      message: "Quiz submitted successfully",
      score: {
        correct: correctCount,
        wrong: wrongCount,
        total: totalQuestions,
        percentage: scorePercentage
      }
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
};
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { db } from '../firebaseConfig';
import { updateUserStreak } from "./streakService";
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
// Update a specific answer in a quiz
export const updateAnswer = async (quizId, questionIndex, attemptedOption) => {
  try {
    const quizRef = doc(db, "quizzes", quizId);
    const quizDoc = await getDoc(quizRef);
    
    if (!quizDoc.exists()) {
      throw new Error("Quiz not found");
    }
    
    const quizData = quizDoc.data();
    if (!quizData.questions || !quizData.questions[questionIndex]) {
      throw new Error("Question not found");
    }
    
    // Get the current question data
    const updatedQuestion = {
      ...quizData.questions[questionIndex],
      attempted_option: attemptedOption,
    };
    
    // Create a new questions array with the updated question
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    
    // Update the entire questions array
    await updateDoc(quizRef, {
      questions: updatedQuestions,
    });
    
    return { message: "Answer updated successfully" };
  } catch (error) {
    console.error("Error updating answer:", error);
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
    const questionAnalysis = [];

    // Check each question's attempted_option against correct_answer
    for (const question of questions) {
      const attemptedOption = question.attempted_option;
      const correctAnswer = question.correct_answer;
      const isCorrect = attemptedOption === correctAnswer;

      // Add to question analysis
      questionAnalysis.push({
        question: question.question,
        isCorrect,
        attemptedOption,
        correctAnswer,
        tags: question.tags || []
      });

      if (isCorrect) {
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
    const previousWrongTags = userData.wrong_tags || [];
    
    // Calculate new average marks
    const newTestsCount = currentTests + 1;
    const newTotalMarks = ((currentTotalMarks * currentTests) + scorePercentage) / newTestsCount;
    
    // Identify consistently wrong tags (appear in multiple questions)
    const significantWrongTags = Object.entries(wrongTags)
      .filter(([_, count]) => count >= 2)
      .map(([tag, _]) => tag);
    
    // Combine with previous wrong tags to track persistence
    const newWrongTags = Array.from(
      new Set([...previousWrongTags, ...significantWrongTags])
    );

    // Calculate improvement areas
    const timeSpent = quizData.timeStarted ? 
      (new Date().getTime() - quizData.timeStarted) / (1000 * 60) : null;

      

    // Update user document with new stats
    await updateDoc(userRef, {
      number_of_tests_attempted: newTestsCount,
      total_marks: newTotalMarks,
      wrong_tags: newWrongTags,
      last_quiz_date: new Date(),
      quiz_history: userData.quiz_history ? 
        [...userData.quiz_history, { 
          quizId, 
          score: scorePercentage, 
          date: new Date(),
          wrongTags: Object.keys(wrongTags)
        }].slice(-10) : 
        [{ 
          quizId, 
          score: scorePercentage, 
          date: new Date(),
          wrongTags: Object.keys(wrongTags)
        }]
    });

    // Save quiz results for future reference
    await updateDoc(quizRef, {
      completed: true,
      completedBy: userData.uid,
      completedAt: new Date(),
      score: scorePercentage,
      timeSpent: timeSpent || null
    });

    const streakResult = await updateUserStreak(userId, new Date());

    return {
      message: "Quiz submitted successfully",
      score: {
        correct: correctCount,
        wrong: wrongCount,
        total: totalQuestions,
        percentage: scorePercentage
      },
      questionAnalysis,
      new_wrong_tags: significantWrongTags,
      persistent_wrong_tags: newWrongTags,
      timeSpent,
      ...streakResult
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
};

export const bookmarkQuestion = async (userId, question) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!question) {
      throw new Error("Question data is required");
    }

    // Import necessary Firebase functions
    const { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } = await import("firebase/firestore");
    const { db } = await import("@/firebaseConfig");

    // Make sure the question has an ID
    const questionId = question.id || `${question.quizId}_q${Date.now()}`;
    const questionToSave = {
      ...question,
      id: questionId,
      bookmarkedAt: new Date().toISOString()
    };

    // Reference to the user's document
    const userRef = doc(db, "users", userId);
    
    // Check if user document exists
    const userDoc = await getDoc(userRef);
    
    // Check if this question is already bookmarked
    let isAlreadyBookmarked = false;
    if (userDoc.exists() && userDoc.data().bookmarkedQuestions) {
      isAlreadyBookmarked = userDoc.data().bookmarkedQuestions.some(
        q => q.id === questionId
      );
    }
    
    if (isAlreadyBookmarked) {
      // Remove bookmark if it exists
      await updateDoc(userRef, {
        bookmarkedQuestions: arrayRemove(questionToSave)
      });
      
      return { 
        success: true, 
        message: "Bookmark removed successfully",
        action: "removed"
      };
    } else {
      // Add bookmark
      if (!userDoc.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userRef, {
          bookmarkedQuestions: [questionToSave]
        });
      } else {
        // Update existing user document
        await updateDoc(userRef, {
          bookmarkedQuestions: arrayUnion(questionToSave)
        });
      }
      
      return { 
        success: true, 
        message: "Question bookmarked successfully",
        action: "added"
      };
    }
  } catch (error) {
    console.error("Error bookmarking question:", error);
    throw error;
  }
};
/**
 * Remove a bookmarked question for a user
 * @param {string} userId - The ID of the user
 * @param {string} questionId - The ID of the question to remove
 * @returns {Promise<object>} - Success message
 */
export const removeBookmarkedQuestion = async (userId, questionId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!questionId) {
      throw new Error("Question ID is required");
    }

    // Reference to the user's document
    const userRef = doc(db, "users", userId);
    
    // Get the current bookmarked questions
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }
    
    const userData = userDoc.data();
    const bookmarkedQuestions = userData.bookmarkedQuestions || [];
    
    // Filter out the question to remove
    const updatedBookmarks = bookmarkedQuestions.filter(
      question => question.id !== questionId
    );
    
    // Update the user document
    await updateDoc(userRef, {
      bookmarkedQuestions: updatedBookmarks
    });

    return { 
      success: true, 
      message: "Question removed from bookmarks" 
    };
  } catch (error) {
    console.error("Error removing bookmarked question:", error);
    throw error;
  }
};

/**
 * Get all bookmarked questions for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Array of bookmarked questions
 */
export const getBookmarkedQuestions = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Reference to the user's document
    const userRef = doc(db, "users", userId);
    
    // Get the user document
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return [];
    }
    
    const userData = userDoc.data();
    return userData.bookmarkedQuestions || [];
  } catch (error) {
    console.error("Error getting bookmarked questions:", error);
    throw error;
  }
};


export const clearAttemptedOptions = async (quizId) => {
  try {
    const quizRef = doc(db, "quizzes", quizId);
    const quizSnap = await getDoc(quizRef);

    if (!quizSnap.exists()) {
      throw new Error("Quiz not found.");
    }

    const quizData = quizSnap.data();
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz data.");
    }

    const updatedQuestions = quizData.questions.map((q) => ({
      ...q,
      attempted_option: "",
    }));

    await updateDoc(quizRef, {
      questions: updatedQuestions,
    });

    console.log("Cleared attempted options successfully.");
  } catch (error) {
    console.error("Error clearing attempted options:", error);
    throw error;
  }
};



export const getQuizReviewById = async (quizId) => {
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

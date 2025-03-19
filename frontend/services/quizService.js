import { db, collection, addDoc, getDocs, doc, getDoc } from "../firebaseConfig";

// Firestore collection name
const QUIZZES_COLLECTION = "quizzes";

// Create a new quiz
export const createQuiz = async ({ title, subject, questionCount, timeLimit, difficulty, dueDate }) => {
  try {
    const quizRef = await addDoc(collection(db, QUIZZES_COLLECTION), {
      title,
      subject,
      questionCount,
      timeLimit,
      difficulty,
      dueDate,
      createdAt: new Date().toISOString(),
    });
    return { id: quizRef.id, title, subject, questionCount, timeLimit, difficulty, dueDate };
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

// Fetch all quizzes
export const getAllQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, QUIZZES_COLLECTION));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Fetch a specific quiz by ID
export const getQuizById = async (id) => {
  try {
    const quizDoc = await getDoc(doc(db, QUIZZES_COLLECTION, id));
    if (quizDoc.exists()) {
      return { id: quizDoc.id, ...quizDoc.data() };
    } else {
      throw new Error("Quiz not found");
    }
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

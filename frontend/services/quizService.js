import { db, collection, addDoc, getDocs, doc, getDoc } from "./firebaseConfig";

// Collection name in Firestore
const QUIZZES_COLLECTION = "quizzes";

//Create a Quiz
export const createQuiz = async ({ topic, num_questions, difficulty }) => {
  try {
    const quizRef = await addDoc(collection(db, QUIZZES_COLLECTION), {
      topic,
      num_questions,
      difficulty,
      createdAt: new Date().toISOString(),
    });
    return { id: quizRef.id, topic, num_questions, difficulty };
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error
  }
};

//Get All Quizzes
export const getAllQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, QUIZZES_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

//Get Quiz by ID
export const getQuiz = async ({ id }) => {
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

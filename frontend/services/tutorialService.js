import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { db } from '../firebaseConfig';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export const createTutorialNotes = async ({ topic, userId }) => {
  try {
    const idToken = Cookies.get("idToken");
    if (!idToken) {
      throw new Error("Authentication token missing");
    }

    // 1. Generate notes from the backend
    const response = await fetch(`${BASE_URL}/api/tutorials/create_notes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ topic, userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const notesData = result.data;

    if (!notesData || !notesData.notes) {
      throw new Error("No notes returned from backend");
    }

    // 2. Save notes to Firestore
    const notePayload = {
      userId: notesData.userId,
      topic: notesData.topic,
      notes: notesData.notes,
      createdAt: serverTimestamp(),
    };

    const noteRef = await addDoc(collection(db, "tutorials"), notePayload);

    return {
      id: noteRef.id,
      message: "Notes created and saved successfully",
      notes: notePayload.notes
    };

  } catch (error) {
    console.error("Error creating tutorial notes:", error);
    throw error;
  }
};


// Fetch all notes created by a user
export const getAllNotesForUserId = async (userId) => {
    try {
      const notesQuery = query(
        collection(db, "tutorials"),
        where("userId", "==", userId)
      );
  
      const querySnapshot = await getDocs(notesQuery);
      const notes = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
  
      return notes;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new Error("Failed to fetch notes for this user");
    }
  };
  
  // Delete a note by its ID
export const deleteNote = async (noteId) => {
    try {
      const noteRef = doc(db, "tutorials", noteId);
      await deleteDoc(noteRef);
      return { message: "Note deleted successfully" };
    } catch (error) {
      console.error("Error deleting note:", error);
      throw new Error("Failed to delete note");
    }
  };
  

// File: services/tutorialService.js

export const searchYouTubeVideos = async (query) => {
  try {
    if (!query || !query.trim()) {
      throw new Error("Search query is required");
    }
    const idToken = Cookies.get("idToken");
    if (!idToken) {
      throw new Error("Authentication token missing");
    }

    const response = await fetch(`${BASE_URL}/api/tutorials/search_youtube`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ q:query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch YouTube videos");
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
};

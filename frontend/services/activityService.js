// This file would be saved as /services/activityService.js

import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Function to fetch quiz activity data for heatmap
export const fetchQuizActivity = async (userId) => {
  try {
    // Get user document reference
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    
    // Extract quiz history from user data
    const quizHistory = userData.quiz_history || [];
    
    // Process quiz history into a format suitable for heatmap
    // Maps dates to count of quizzes taken on that date
    const activityData = {};
    
    quizHistory.forEach(entry => {
      if (entry.date) {
        // Convert Firestore timestamp to JS Date
        const date = entry.date.seconds 
          ? new Date(entry.date.seconds * 1000)
          : new Date(entry.date);
        
        // Format date as YYYY-MM-DD for consistent keys
        const dateKey = date.toISOString().split('T')[0];
        
        // Increment count for this date
        if (activityData[dateKey]) {
          activityData[dateKey]++;
        } else {
          activityData[dateKey] = 1;
        }
      }
    });
    
    return activityData;
  } catch (error) {
    console.error("Error fetching quiz activity:", error);
    throw error;
  }
};
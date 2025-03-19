import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDrzSdSXy7AUgccQPKS_AJBZp0d52qNhhM",
    authDomain: "eduassist-9cda7.firebaseapp.com",
    projectId: "eduassist-9cda7",
    storageBucket: "eduassist-9cda7.firebasestorage.app",
    messagingSenderId: "899768269956",
    appId: "1:899768269956:web:a91e69bf5d76c5f37dd6d1",
    measurementId: "G-1JPGTJTB17"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, doc, getDoc };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // <-- Add this
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUQf3Uaa0qr6Z6S8QmDoOdTyPEWe_yHpM",
  authDomain: "vortex-e-com.firebaseapp.com",
  projectId: "vortex-e-com",
  storageBucket: "vortex-e-com.firebasestorage.app",
  messagingSenderId: "629554900683",
  appId: "1:629554900683:web:e183b24a54a8d34690754e",
  measurementId: "G-KQYYZRZCRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <-- Export it here
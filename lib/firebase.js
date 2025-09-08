import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCOSr4bPuxGUyW61fZYHtXmfBEGuOPed8g",
  authDomain: "manualink.firebaseapp.com",
  projectId: "manualink",
  storageBucket: "manualink.firebasestorage.app",
  messagingSenderId: "901394208184",
  appId: "1:901394208184:web:7551a8354426329888ab4d",
  measurementId: "G-F33Q7HZX3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
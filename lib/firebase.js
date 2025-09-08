import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFQkkdPEpGbeiqLxP07feIgD9XFsnwVwA",
  authDomain: "manualink-nx.firebaseapp.com",
  projectId: "manualink-nx",
  storageBucket: "manualink-nx.firebasestorage.app",
  messagingSenderId: "173546344681",
  appId: "1:173546344681:web:845812ae5d7c8c9df22078",
  measurementId: "G-E2ZD0J4SZK"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let auth;
let analytics;

if (typeof window !== "undefined") {
  auth = getAuth(app);
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };

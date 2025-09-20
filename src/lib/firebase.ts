// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7n5Hbqlf5ZgfePuL181TCZ_36wNKlyJ8",
  authDomain: "water-outbreak-app.firebaseapp.com",
  databaseURL: "https://water-outbreak-app-default-rtdb.firebaseio.com/",
  projectId: "water-outbreak-app",
  storageBucket: "water-outbreak-app.appspot.com",
  messagingSenderId: "392245749368",
  appId: "1:392245749368:web:59ce536b3d68dbdb68af8d",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);   // 👈 added
const auth = getAuth(app);

export { app, auth };
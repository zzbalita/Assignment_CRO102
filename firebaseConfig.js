import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHZwzrKw7UsSTwYHCowMSTfHg_j0y-Yro",
  authDomain: "flutter-840e9.firebaseapp.com",
  projectId: "flutter-840e9",
  storageBucket: "flutter-840e9.firebasestorage.app",
  messagingSenderId: "262210656625",
  appId: "1:262210656625:web:30a2299ae987f89a9dbed0",
  measurementId: "G-CB11YB1XGG",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

// Xuất các module Firestore
export { auth, app, db, collection, getDocs, query, where, doc, deleteDoc };

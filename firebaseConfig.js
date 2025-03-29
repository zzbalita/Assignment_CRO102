// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHZwzrKw7UsSTwYHCowMSTfHg_j0y-Yro",
  authDomain: "flutter-840e9.firebaseapp.com",
  projectId: "flutter-840e9",
  storageBucket: "flutter-840e9.firebasestorage.app",
  messagingSenderId: "262210656625",
  appId: "1:262210656625:web:30a2299ae987f89a9dbed0",
  measurementId: "G-CB11YB1XGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)

export {auth, app, db, collection, getDocs}
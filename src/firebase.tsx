// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlVxwjmKgBNs3LrMzS5uqdlOdanuDBNFc",
  authDomain: "fadilsweb.firebaseapp.com",
  projectId: "fadilsweb",
  storageBucket: "fadilsweb.firebasestorage.app",
  messagingSenderId: "130358463561",
  appId: "1:130358463561:web:0d743b405ad237bf530398",
  measurementId: "G-LLGPLPKS4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
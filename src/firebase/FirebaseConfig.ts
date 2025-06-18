import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyDlVxwjmKgBNs3LrMzS5uqdlOdanuDBNFc",
  authDomain: "fadilsweb.firebaseapp.com",
  projectId: "fadilsweb",
  storageBucket: "fadilsweb.firebasestorage.app",
  messagingSenderId: "130358463561",
  appId: "1:130358463561:web:0d743b405ad237bf530398",
  measurementId: "G-LLGPLPKS4M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

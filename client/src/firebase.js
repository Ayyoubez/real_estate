// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "kech-estate.firebaseapp.com",
  projectId: "kech-estate",
  storageBucket: "kech-estate.appspot.com",
  messagingSenderId: "769557735513",
  appId: "1:769557735513:web:27dba016bab9afc6c2a948",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

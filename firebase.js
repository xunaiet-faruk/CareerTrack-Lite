// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtmA-Bou1q4oyINXFQS833JYXVOccSIEc",
  authDomain: "careertrack-lite.firebaseapp.com",
  projectId: "careertrack-lite",
  storageBucket: "careertrack-lite.firebasestorage.app",
  messagingSenderId: "506299238604",
  appId: "1:506299238604:web:57ebebc615e9c7ee2b1a69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

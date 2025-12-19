// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_H",
  authDomain: "raktsarthi-b2387.firebaseapp.com",
  projectId: "raktsarthi-b2387",
  storageBucket: "raktsarthi-b2387.firebasestorage.app",
  messagingSenderId: "YOUR-SENDER_ID_H",
  appId: "YOUR_APP_ID_H",
  measurementId: "G-DT6C43P876"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure Google Provider
// Note: Cross-Origin-Opener-Policy warnings in console are expected and harmless
// They occur because Firebase uses popups for authentication
// These warnings do not affect functionality
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Always show account selection
});

export { app, analytics };
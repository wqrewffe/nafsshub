import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Firebase Configuration ---
// These variables are loaded from environment variables.
// Make sure to set them up in your execution environment.
const firebaseConfig = {
  apiKey: "AIzaSyA5Ejm2hcRQv-ZEne_1Eo7wOHw6asweg3A",
  authDomain: "nafs--hub.firebaseapp.com",
  projectId: "nafs--hub",
  storageBucket: "nafs--hub.firebasestorage.app",
  messagingSenderId: "165407273951",
  appId: "1:165407273951:web:690556f5da6ce6fe3eca6a",
  measurementId: "G-7F8R9GYM93"
};

// Initialize Firebase
// The Firebase SDK will throw a descriptive error if the configuration is invalid
// or if the environment variables are not set correctly.
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
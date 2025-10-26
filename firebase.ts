

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjp5BW5UO-UaT1ahQVXqag0sm_Nt1te-o",
  authDomain: "imtiaze-d6c9e.firebaseapp.com",
  projectId: "imtiaze-d6c9e",
  storageBucket: "imtiaze-d6c9e.appspot.com",
  messagingSenderId: "498685390009",
  appId: "1:498685390009:web:f1260dc09cc90d33ddbf60",
  measurementId: "G-8H9DBWCCFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };

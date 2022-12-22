// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq05OMl4D3ayRxL2-6vfkh6J3QpA0cNyA",
  authDomain: "tinder-app-371813.firebaseapp.com",
  projectId: "tinder-app-371813",
  storageBucket: "tinder-app-371813.appspot.com",
  messagingSenderId: "333059595705",
  appId: "1:333059595705:web:16b299e0962f6bab482a68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, db};
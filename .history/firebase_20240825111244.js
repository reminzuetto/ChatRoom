// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCByskQxED7hrEcXo3xxjBwrZfY32-amj8",
  authDomain: "chatinstant-7ca0a.firebaseapp.com",
  projectId: "chatinstant-7ca0a",
  storageBucket: "chatinstant-7ca0a.appspot.com",
  messagingSenderId: "174781222212",
  appId: "1:174781222212:web:bbe6c82073bf0863575b11",
  measurementId: "G-78Q5YQB55L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

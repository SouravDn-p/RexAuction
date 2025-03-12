// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNuXkDrmhS-kH62wqFiRE-tHDRdduB4Lw",
  authDomain: "rex-auction.firebaseapp.com",
  projectId: "rex-auction",
  storageBucket: "rex-auction.firebasestorage.app",
  messagingSenderId: "23140648733",
  appId: "1:23140648733:web:71431edf58938ba548c3f4",
  measurementId: "G-RLKWDDQY8T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

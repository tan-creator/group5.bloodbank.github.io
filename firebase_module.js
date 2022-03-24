// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-analytics.js";
import { getDatabase, ref, set, onValue, child, get } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyACSmwBun0H8a0G2NZisPo2PRmZY8KPRL4",
  authDomain: "bloodbankg5.firebaseapp.com",
  databaseURL: "https://bloodbankg5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bloodbankg5",
  storageBucket: "bloodbankg5.appspot.com",
  messagingSenderId: "59349356493",
  appId: "1:59349356493:web:e0a49294deb29ecacb7e84",
  measurementId: "G-711G5SHMFK"
});

// Initialize Firebase
const analytics = getAnalytics(firebaseConfig);
const database = getDatabase(firebaseConfig);
const auth = getAuth(firebaseConfig);

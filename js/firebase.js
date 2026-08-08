import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAt8zCadyJg2jWtSnNvVDt-BEbijKRDwNo",
    authDomain: "expense-tracker-4cf78.firebaseapp.com",
    projectId: "expense-tracker-4cf78",
    storageBucket: "expense-tracker-4cf78.firebasestorage.app",
    messagingSenderId: "868097839863",
    appId: "1:868097839863:web:401ac62e41f828aa6fb9f2",
    measurementId: "G-0SZ92TJM2T"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };

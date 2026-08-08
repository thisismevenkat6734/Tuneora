// ===============================
// TUNEORA - FIREBASE CONFIG
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCoeM5vZ7mgQYzK4-aUSRtVza_nxnpQyrM",
    authDomain: "tuneora-22483.firebaseapp.com",
    projectId: "tuneora-22483",
    storageBucket: "tuneora-22483.firebasestorage.app",
    messagingSenderId: "306207135080",
    appId: "1:306207135080:web:9c10a69875b1e73fe672dd"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firebase Authentication
const auth = getAuth(app);


// Cloud Firestore
const db = getFirestore(app);
// Firebase Storage
const storage = getStorage(app);

// Export Firebase services
export {
    app,
    auth,
    db,
    storage
};

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBlNn6VfJeN_Z51ne2aNSRxG-mN589IAsg",
    authDomain: "pink-beauty-salon.firebaseapp.com",
    projectId: "pink-beauty-salon",
    storageBucket: "pink-beauty-salon.firebasestorage.app",
    messagingSenderId: "25328599127",
    appId: "1:25328599127:web:fc435ed693934be7d56312",
    measurementId: "G-PTH859G7DW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

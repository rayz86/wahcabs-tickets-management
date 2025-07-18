import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWGn8NU7KhttdNvGu2gB6cb2zfcf5fPtY",
  authDomain: "klickmycabs.firebaseapp.com",
  projectId: "klickmycabs",
  storageBucket: "klickmycabs.firebasestorage.app",
  messagingSenderId: "295253073683",
  appId: "1:295253073683:web:594b61020f0286b3c2c4e6",
  measurementId: "G-BS4G2STJSZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA_ojRNi1aAEAy3pJaryMn8oiNFGol4-8s",
  authDomain: "carecycle-82585.firebaseapp.com",
  projectId: "carecycle-82585",
  storageBucket: "carecycle-82585.appspot.com",
  messagingSenderId: "435181593080",
  appId: "1:435181593080:web:2be614355e1360c537b60d",
  measurementId: "G-H52PWVKCRC"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);


export { app, db, auth, provider };

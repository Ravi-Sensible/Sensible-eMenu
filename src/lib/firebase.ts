import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAKlbNMfrFqLtv6Lt4A-yq0mZMT9quguyY",
  authDomain: "sconnect-pos.firebaseapp.com",
  databaseURL: "https://sconnect-pos.firebaseio.com",
  projectId: "sconnect-pos",
  storageBucket: "sconnect-pos.appspot.com",
  messagingSenderId: "815478550082",
  appId: "1:815478550082:web:fba6762c458bd519e247db",
  measurementId: "G-FXTJKV8D83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)
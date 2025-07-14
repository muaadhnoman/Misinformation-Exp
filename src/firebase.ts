import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxCw55jMlaiA4edLbgYiMBhh_u1Qc88wo",
  authDomain: "misinformation-experimen-b6d63.firebaseapp.com",
  databaseURL: "https://misinformation-experimen-b6d63-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "misinformation-experimen-b6d63",
  storageBucket: "misinformation-experimen-b6d63.firebasestorage.app",
  messagingSenderId: "26979266957",
  appId: "1:26979266957:web:699eeb82a361af634dcdc4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
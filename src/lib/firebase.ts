import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBU6W7C8QHHd3D0ZUVn_VAfzxxlC-uPuFw",
  authDomain: "bondmate-a64bc.firebaseapp.com",
  projectId: "bondmate-a64bc",
  storageBucket: "bondmate-a64bc.firebasestorage.app",
  messagingSenderId: "221502937966",
  appId: "1:221502937966:web:65caee61daecf71c5e7f7f",
  measurementId: "G-85X2Q0ZBWH"
};

// Only initialize Firebase if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
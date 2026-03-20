// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA4zw5cZqxLwzkTy2e5NiHz-tGKqk1KGdI",
  authDomain: "newstally-df03c.firebaseapp.com",
  projectId: "newstally-df03c",
  storageBucket: "newstally-df03c.appspot.com",
  messagingSenderId: "506893212961",
  appId: "1:506893212961:web:63882290195da992207260"
};

// Google Sheets config for news data
export const SHEET_ID = '1Wy6rzaCALqPLFx079nqBCDRP7dk3au5eRO4GuMwQ8Sk';
export const SHEETS_API_KEY = 'AIzaSyC8D-4bl3GDyj_--BGG1pPdO5Bz63r5iXI';
export const SHEET_NAME = 'Sheet1';
export const APP_ID = 'newstally-social';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

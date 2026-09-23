import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCMoZpO-EnZ02MYOaW11WeJVeoQ_FDJbEQ",
  authDomain: "feastiva-catering.firebaseapp.com",
  projectId: "feastiva-catering",
  storageBucket: "feastiva-catering.firebasestorage.app",
  messagingSenderId: "262003987664",
  appId: "1:262003987664:web:f1cea769850c5675a3bad5",
  measurementId: "G-K6L70DRF74"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

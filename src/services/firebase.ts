import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_WEB_CARROS_API_KEY,
  authDomain: import.meta.env.VITE_WEB_CARROS_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_WEB_CARROS_PROJECT_ID,
  storageBucket: import.meta.env.VITE_WEB_CARROS_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_WEB_CARROS_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_WEB_CARROS_APP_ID
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 

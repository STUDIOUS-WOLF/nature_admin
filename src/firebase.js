import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, push } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.Auth_Domain,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_ID,
  appId: process.env.APP_ID,
};
import "firebase/storage";

export const FIREBASE_CLIENT = firebase.default;

if (FIREBASE_CLIENT.apps.length === 0) {
  FIREBASE_CLIENT.initializeApp(firebaseConfig);
}
export const STORAGE_CLIENT = FIREBASE_CLIENT.app().storage(
  process.env.NODE_ENV === "production"
    ? process.env.STORAGE_BUCKET
    : process.env.STORAGE_BUCKET
);
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
const db = getFirestore(app);
export { db };

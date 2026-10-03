import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from "firebase/firestore";

// Baalot's Firebase web config (public identifiers, same as admin.baalot.site's
// bundle). Only used by the private /dan-tracker page; access is enforced by the
// owner-only dan_tracker/{uid} Firestore rule.
const firebaseConfig = {
  apiKey: "AIzaSyBqhEi6yKdafVAoXAy09u0YPGLOMoo79AU",
  authDomain: "baalot-661a5.firebaseapp.com",
  projectId: "baalot-661a5",
  storageBucket: "baalot-661a5.firebasestorage.app",
  messagingSenderId: "346377758910",
  appId: "1:346377758910:web:52e3010c547b0eb28696ef",
};

const fresh = getApps().length === 0;
export const app = fresh ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = fresh
  ? initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })
  : getFirestore(app);

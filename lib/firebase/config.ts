import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getStorage, FirebaseStorage } from "firebase/storage"
import { getFirestore, Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyANOxmLGz-PNCDTYKVUv_tomcFroqLVA8A",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "graddrive-e3695.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "graddrive-e3695",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "graddrive-e3695.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "721935097812",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:721935097812:web:eece464983d41da455c041",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FLDCT8LMJX"
}

// Initialize Firebase
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const auth: Auth = getAuth(app)
export const storage: FirebaseStorage = getStorage(app)
export const db: Firestore = getFirestore(app)

export default app


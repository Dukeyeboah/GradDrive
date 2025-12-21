"use client"

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "./config"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./config"

const googleProvider = new GoogleAuthProvider()
// Add additional scopes if needed
googleProvider.addScope('profile')
googleProvider.addScope('email')
// Set custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role?: "user" | "admin" | "super admin"
  createdAt?: any
  updatedAt?: any
}

/**
 * Sign in with email and password
 */
export async function signInEmailPassword(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

/**
 * Sign up with email and password
 */
export async function signUpEmailPassword(
  email: string,
  password: string,
  displayName?: string,
  role: "user" | "admin" | "super admin" = "user"
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }

    // Create user document in Firestore
    const userData: UserData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName || userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(doc(db, "users", userCredential.user.uid), userData)

    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(role: "user" | "admin" | "super admin" = "user") {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid))
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      await setDoc(doc(db, "users", user.uid), userData)
    } else {
      // Update last login and role if needed
      const updateData: any = { updatedAt: serverTimestamp() }
      if (role === "admin") {
        updateData.role = "admin"
      }
      await setDoc(
        doc(db, "users", user.uid),
        updateData,
        { merge: true }
      )
    }

    return { user, error: null }
  } catch (error: any) {
    console.error("Google sign-in error:", error)
    
    // Handle specific error cases
    let errorMessage = error.message || "An error occurred during Google sign-in"
    
    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Sign-in popup was closed. Please try again."
    } else if (error.code === "auth/popup-blocked") {
      errorMessage = "Popup was blocked by your browser. Please allow popups for this site and try again."
    } else if (error.code === "auth/cancelled-popup-request") {
      errorMessage = "Sign-in was cancelled. Please try again."
    } else if (error.code === "auth/account-exists-with-different-credential") {
      errorMessage = "An account already exists with this email. Please sign in with your existing method."
    }
    
    return { user: null, error: errorMessage }
  }
}

/**
 * Sign out
 */
export async function signOutUser() {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }
    return null
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}


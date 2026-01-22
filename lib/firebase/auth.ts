'use client';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

const googleProvider = new GoogleAuthProvider();
// Add additional scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');
// Set custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'user' | 'admin' | 'super admin';
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Sign in with email and password
 */
export async function signInEmailPassword(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpEmailPassword(
  email: string,
  password: string,
  displayName?: string,
  role: 'user' | 'admin' | 'super admin' = 'user'
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
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
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with Google using redirect (avoids COOP issues)
 */
export async function signInWithGoogle(
  role: 'user' | 'admin' | 'super admin' = 'user'
) {
  try {
    // Store role in sessionStorage for use after redirect
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('googleAuthRole', role);
    }
    // Use redirect instead of popup to avoid COOP issues
    await signInWithRedirect(auth, googleProvider);
    // Note: The actual result will be handled by getRedirectResult in AuthContext
    return { user: null, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { user: null, error: error.message || 'An error occurred during Google sign-in' };
  }
}

/**
 * Handle Google redirect result and create/update user document
 */
export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (!result) {
      return { user: null, error: null };
    }

    const user = result.user;
    
    // Get role from sessionStorage (stored before redirect)
    let role: 'user' | 'admin' | 'super admin' = 'user';
    if (typeof window !== 'undefined') {
      const storedRole = sessionStorage.getItem('googleAuthRole');
      if (storedRole === 'admin' || storedRole === 'super admin') {
        role = storedRole;
      }
      sessionStorage.removeItem('googleAuthRole');
    }

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

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
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    } else {
      // Update last login and role if needed
      const updateData: any = { updatedAt: serverTimestamp() };
      if (role === 'admin' || role === 'super admin') {
        updateData.role = role;
      }
      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });
    }

    return { user, error: null };
  } catch (error: any) {
    console.error('Google redirect error:', error);
    return { user: null, error: error.message || 'An error occurred during Google sign-in' };
  }
}

/**
 * Sign out
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

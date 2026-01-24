'use client';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
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
  role?: 'user' | 'admin' | 'super admin' | 'photographer-admin';
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
  role: 'user' | 'admin' | 'super admin' | 'photographer-admin' = 'user'
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
 * Sign in with Google using popup (like the working example)
 * Handles user creation/update immediately
 */
export async function signInWithGoogle(
  role: 'user' | 'admin' | 'super admin' | 'photographer-admin' = 'user'
) {
  try {
    // Use popup instead of redirect
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Determine role - check sessionStorage for special roles
    let finalRole: 'user' | 'admin' | 'super admin' | 'photographer-admin' =
      role;

    if (typeof window !== 'undefined') {
      const photographerVerified = sessionStorage.getItem(
        'photographerPasskeyVerified'
      );
      const adminRole = sessionStorage.getItem('adminRole');
      const adminVerified = sessionStorage.getItem('adminPasskeyVerified');

      // Override with special roles if verified
      if (
        adminRole === 'admin' ||
        adminRole === 'super admin' ||
        adminVerified === 'true'
      ) {
        finalRole = (adminRole || 'admin') as 'admin' | 'super admin';
      } else if (photographerVerified === 'true') {
        finalRole = 'photographer-admin';
      }
    }

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // New user - create with role
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: finalRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    } else {
      // Existing user - update info
      const existingData = userDoc.data() as UserData;
      const updateData: any = {
        updatedAt: serverTimestamp(),
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      // Only update role if upgrading to admin/photographer, or if current role is user/null
      if (
        finalRole === 'admin' ||
        finalRole === 'super admin' ||
        finalRole === 'photographer-admin'
      ) {
        updateData.role = finalRole;
      } else if (!existingData.role || existingData.role === 'user') {
        updateData.role = 'user';
      }
      // Otherwise keep existing role (don't downgrade admins)

      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });
    }

    return { user, error: null };
  } catch (error: any) {
    // Handle popup closed by user
    if (
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      return { user: null, error: 'Sign-in popup was closed.' };
    }

    console.error('Google sign-in error:', error);
    return {
      user: null,
      error: error.message || 'An error occurred during Google sign-in',
    };
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

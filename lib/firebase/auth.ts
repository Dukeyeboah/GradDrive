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
  deleteUser,
} from 'firebase/auth';
import { auth } from './config';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { publishGradDriverPublicProfile } from './firestore';
import { readGradDriveAccessUnlocked } from '@/lib/config/user';

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
  collegeName?: string | null;
  collegeGroup?: string | null;
  major?: string | null;
  graduationYear?: string | null;
  /** Short bio for Grad Drivers profile */
  bio?: string | null;
  /** Interests, hobbies, goals (shown in directory and profile) */
  interests?: string | null;
  /** Header image URL for profile page */
  bannerPhotoURL?: string | null;
  /** When false, profile is hidden from the Grad Drivers directory */
  directoryOptIn?: boolean | null;
  /** User finished the Grad Drivers networking onboarding */
  gradDriverProfileComplete?: boolean | null;
  /** User chose “Maybe later” on the networking prompt */
  gradDriverOnboardingDismissed?: boolean | null;
  /** True once user completed passkey-gated sign-up (existing accounts may omit) */
  hasGradDriveAccess?: boolean | null;
  /** Optional second contact email (not shown on public profile) */
  secondaryEmail?: string | null;
}

/**
 * Sign in with email and password
 */
export async function signInEmailPassword(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
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
  role: 'user' | 'admin' | 'super admin' | 'photographer-admin' = 'user',
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
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
      hasGradDriveAccess: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    } catch (firestoreErr: any) {
      try {
        await deleteUser(userCredential.user);
      } catch {
        /* ignore */
      }
      return {
        user: null,
        error:
          firestoreErr?.message ||
          'Could not save your profile. Check your connection and try again.',
      };
    }

    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export type SignInWithGoogleOptions = {
  /** @deprecated New Google accounts for role `user` require local passkey unlock instead */
  rejectNewUsers?: boolean;
};

/**
 * Sign in with Google using popup (like the working example)
 * Handles user creation/update immediately
 */
export async function signInWithGoogle(
  role: 'user' | 'admin' | 'super admin' | 'photographer-admin' = 'user',
  _options?: SignInWithGoogleOptions,
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
        'photographerPasskeyVerified',
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

    const isNewUser = !userDoc.exists();

    if (isNewUser && finalRole === 'user') {
      const passkeyOk =
        typeof window !== 'undefined' && readGradDriveAccessUnlocked();
      if (!passkeyOk) {
        try {
          await deleteUser(user);
        } catch {
          /* ignore */
        }
        return {
          user: null,
          error:
            'Access restricted. On the Grad Drive home page, choose Get access and enter your passkey, then sign in with Google again to create your account.',
          isNewUser: true,
        };
      }
    }

    if (isNewUser) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: finalRole,
        hasGradDriveAccess: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      try {
        await setDoc(doc(db, 'users', user.uid), userData);
      } catch (firestoreError: any) {
        try {
          await deleteUser(user);
        } catch {
          /* ignore */
        }
        return {
          user: null,
          error:
            firestoreError?.message ||
            'Could not complete registration. Please try again.',
          isNewUser: true,
        };
      }
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

      try {
        await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });
      } catch (firestoreError: any) {
        // Check if it's a permissions error when trying to upgrade role
        if (
          firestoreError.code === 'permission-denied' ||
          firestoreError.message?.includes('permission') ||
          firestoreError.message?.includes('insufficient permissions')
        ) {
          // User exists but can't update their role (likely trying to upgrade from 'user' to 'admin')
          if (
            existingData.role === 'user' &&
            (finalRole === 'admin' ||
              finalRole === 'super admin' ||
              finalRole === 'photographer-admin')
          ) {
            return {
              user: null,
              error: 'PERMISSION_DENIED_ROLE_UPGRADE',
              isNewUser: false,
            };
          }
        }
        // Re-throw other Firestore errors
        throw firestoreError;
      }
    }

    return { user, error: null, isNewUser };
  } catch (error: any) {
    // Handle popup closed by user
    if (
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      return {
        user: null,
        error: 'Sign-in popup was closed.',
        isNewUser: false,
      };
    }

    // Handle permission denied errors
    if (
      error.code === 'permission-denied' ||
      error.message?.includes('permission') ||
      error.message?.includes('insufficient permissions') ||
      error.message?.includes('Missing or insufficient permissions')
    ) {
      return {
        user: null,
        error: 'PERMISSION_DENIED_ROLE_UPGRADE',
        isNewUser: false,
      };
    }

    console.error('Google sign-in error:', error);
    return {
      user: null,
      error: error.message || 'An error occurred during Google sign-in',
      isNewUser: false,
    };
  }
}

/**
 * Update user profile (college, major, graduation year, etc.)
 */
export async function updateUserProfile(
  uid: string,
  data: {
    displayName?: string | null;
    collegeName?: string | null;
    collegeGroup?: string | null;
    major?: string | null;
    graduationYear?: string | null;
    bio?: string | null;
    interests?: string | null;
    photoURL?: string | null;
    bannerPhotoURL?: string | null;
    directoryOptIn?: boolean | null;
    gradDriverProfileComplete?: boolean | null;
    gradDriverOnboardingDismissed?: boolean | null;
    secondaryEmail?: string | null;
  },
) {
  try {
    const ref = doc(db, 'users', uid);
    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    await updateDoc(ref, {
      ...patch,
      updatedAt: serverTimestamp(),
    });
    await publishGradDriverPublicProfile(uid);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
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

"use client"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./config"

// Type definitions
export interface Photographer {
  id?: string
  name: string
  location: string
  description: string
  style: string
  tags: string[]
  price: number
  rating: number
  reviews: number
  verified: boolean
  email?: string
  phone?: string
  imageUrl?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Poster {
  id?: string
  name: string
  description: string
  type: string
  format: string
  downloads: number
  category?: string
  tags?: string[]
  imageUrl?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Ebook {
  id?: string
  title: string
  author: string
  description: string
  pages: number
  available: boolean
  category?: string
  isbn?: string
  thumbnailUrl?: string
  fileUrl?: string
  downloads?: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface SystemLog {
  id?: string
  action: string
  type: string
  userId: string
  userName: string
  userEmail: string
  details?: any
  timestamp: Timestamp
}

/**
 * Photographers Collection
 */
export const photographersCollection = collection(db, "photographers")

export async function getPhotographers(): Promise<Photographer[]> {
  try {
    const q = query(photographersCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Photographer[]
  } catch (error) {
    console.error("Error getting photographers:", error)
    return []
  }
}

export async function getPhotographer(id: string): Promise<Photographer | null> {
  try {
    const docRef = doc(db, "photographers", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Photographer
    }
    return null
  } catch (error) {
    console.error("Error getting photographer:", error)
    return null
  }
}

export async function addPhotographer(data: Omit<Photographer, "id" | "createdAt" | "updatedAt">): Promise<string | null> {
  try {
    const docRef = doc(photographersCollection)
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding photographer:", error)
    return null
  }
}

export async function updatePhotographer(id: string, data: Partial<Photographer>): Promise<boolean> {
  try {
    const docRef = doc(db, "photographers", id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating photographer:", error)
    return false
  }
}

export async function deletePhotographer(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "photographers", id))
    return true
  } catch (error) {
    console.error("Error deleting photographer:", error)
    return false
  }
}

/**
 * Posters Collection
 */
export const postersCollection = collection(db, "posters")

export async function getPosters(): Promise<Poster[]> {
  try {
    const q = query(postersCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Poster[]
  } catch (error) {
    console.error("Error getting posters:", error)
    return []
  }
}

export async function getPoster(id: string): Promise<Poster | null> {
  try {
    const docRef = doc(db, "posters", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Poster
    }
    return null
  } catch (error) {
    console.error("Error getting poster:", error)
    return null
  }
}

export async function addPoster(data: Omit<Poster, "id" | "createdAt" | "updatedAt" | "downloads">): Promise<string | null> {
  try {
    const docRef = doc(postersCollection)
    await setDoc(docRef, {
      ...data,
      downloads: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding poster:", error)
    return null
  }
}

export async function updatePoster(id: string, data: Partial<Poster>): Promise<boolean> {
  try {
    const docRef = doc(db, "posters", id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating poster:", error)
    return false
  }
}

export async function deletePoster(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "posters", id))
    return true
  } catch (error) {
    console.error("Error deleting poster:", error)
    return false
  }
}

/**
 * Ebooks Collection
 */
export const ebooksCollection = collection(db, "ebooks")

export async function getEbooks(): Promise<Ebook[]> {
  try {
    const q = query(ebooksCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Ebook[]
  } catch (error) {
    console.error("Error getting ebooks:", error)
    return []
  }
}

export async function getEbook(id: string): Promise<Ebook | null> {
  try {
    const docRef = doc(db, "ebooks", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Ebook
    }
    return null
  } catch (error) {
    console.error("Error getting ebook:", error)
    return null
  }
}

export async function addEbook(data: Omit<Ebook, "id" | "createdAt" | "updatedAt" | "downloads">): Promise<string | null> {
  try {
    const docRef = doc(ebooksCollection)
    await setDoc(docRef, {
      ...data,
      downloads: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding ebook:", error)
    return null
  }
}

export async function updateEbook(id: string, data: Partial<Ebook>): Promise<boolean> {
  try {
    const docRef = doc(db, "ebooks", id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating ebook:", error)
    return false
  }
}

export async function deleteEbook(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "ebooks", id))
    return true
  } catch (error) {
    console.error("Error deleting ebook:", error)
    return false
  }
}

/**
 * System Logs Collection
 */
export const logsCollection = collection(db, "systemLogs")

export async function getSystemLogs(limitCount: number = 50): Promise<SystemLog[]> {
  try {
    const q = query(logsCollection, orderBy("timestamp", "desc"), limit(limitCount))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SystemLog[]
  } catch (error) {
    console.error("Error getting system logs:", error)
    return []
  }
}

export async function addSystemLog(
  action: string,
  type: string,
  userId: string,
  userName: string,
  userEmail: string,
  details?: any
): Promise<string | null> {
  try {
    const docRef = doc(logsCollection)
    await setDoc(docRef, {
      action,
      type,
      userId,
      userName,
      userEmail,
      details,
      timestamp: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding system log:", error)
    return null
  }
}

/**
 * Users Collection
 */
export async function getUserRole(uid: string): Promise<"user" | "admin" | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      return data.role || "user"
    }
    return null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

export async function setUserRole(uid: string, role: "user" | "admin"): Promise<boolean> {
  try {
    await updateDoc(doc(db, "users", uid), {
      role,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error setting user role:", error)
    return false
  }
}


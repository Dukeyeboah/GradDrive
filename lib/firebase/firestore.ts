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
  downloads: number
  category?: string
  tags?: string[]
  imageUrl?: string
  shopifyLink?: string
  uploadedBy?: string
  uploadedByName?: string
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
  uploadedBy?: string
  uploadedByName?: string
  uploadedByEmail?: string
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
  userRole?: string
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

export async function deletePoster(id: string, imageUrl?: string): Promise<boolean> {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "posters", id))
    
    // Note: Storage deletion should be handled by the caller
    // since we need to import deleteFile from storage.ts
    // and this file should focus on Firestore operations
    
    return true
  } catch (error) {
    console.error("Error deleting poster:", error)
    return false
  }
}

/**
 * Cap Designs Collection
 */
export const capDesignsCollection = collection(db, "capDesigns")

export async function getCapDesigns(): Promise<Poster[]> {
  try {
    const q = query(capDesignsCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Poster[]
  } catch (error) {
    console.error("Error getting cap designs:", error)
    return []
  }
}

export async function getCapDesign(id: string): Promise<Poster | null> {
  try {
    const docRef = doc(db, "capDesigns", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Poster
    }
    return null
  } catch (error) {
    console.error("Error getting cap design:", error)
    return null
  }
}

export async function addCapDesign(data: Omit<Poster, "id" | "createdAt" | "updatedAt" | "downloads">): Promise<string | null> {
  try {
    const docRef = doc(capDesignsCollection)
    const designData: any = {
      ...data,
      downloads: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    // Remove undefined values
    Object.keys(designData).forEach(key => {
      if (designData[key] === undefined) {
        delete designData[key]
      }
    })
    await setDoc(docRef, designData)
    return docRef.id
  } catch (error) {
    console.error("Error adding cap design:", error)
    return null
  }
}

export async function updateCapDesign(id: string, data: Partial<Poster>): Promise<boolean> {
  try {
    const docRef = doc(db, "capDesigns", id)
    const updateData: any = { ...data, updatedAt: serverTimestamp() }
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    await updateDoc(docRef, updateData)
    return true
  } catch (error) {
    console.error("Error updating cap design:", error)
    return false
  }
}

export async function deleteCapDesign(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "capDesigns", id))
    return true
  } catch (error) {
    console.error("Error deleting cap design:", error)
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
    const ebookData: any = {
      ...data,
      downloads: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    // Remove undefined values
    Object.keys(ebookData).forEach(key => {
      if (ebookData[key] === undefined) {
        delete ebookData[key]
      }
    })
    await setDoc(docRef, ebookData)
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
  details?: any,
  userRole?: string
): Promise<string | null> {
  try {
    // If role not provided, try to get it from user document
    let role = userRole;
    if (!role) {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          role = userDoc.data().role || 'user';
        }
      } catch (e) {
        // If we can't get role, continue without it
      }
    }

    const docRef = doc(logsCollection)
    await setDoc(docRef, {
      action,
      type,
      userId,
      userName,
      userEmail,
      userRole: role || 'user',
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
export async function getUserRole(uid: string): Promise<"user" | "admin" | "super admin" | null> {
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

export async function setUserRole(uid: string, role: "user" | "admin" | "super admin"): Promise<boolean> {
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

/**
 * Analytics Functions
 */
export interface AnalyticsData {
  totalUsers: number
  totalAdmins: number
  totalDownloads: number
  photographersListed: number
  postersUploaded: number
  capDesigns: number
  recentActivity: SystemLog[]
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"))
    // Total users = only users with role "user" (excludes admins)
    const totalUsers = usersSnapshot.docs.filter(
      (doc) => {
        const role = doc.data().role;
        return !role || role === 'user';
      }
    ).length
    const totalAdmins = usersSnapshot.docs.filter(
      (doc) => doc.data().role === 'admin' || doc.data().role === 'super admin'
    ).length

    // Get total downloads from posters, ebooks, and cap designs
    const postersSnapshot = await getDocs(collection(db, "posters"))
    const ebooksSnapshot = await getDocs(collection(db, "ebooks"))
    const capDesignsSnapshot = await getDocs(collection(db, "capDesigns"))
    
    let totalDownloads = 0
    postersSnapshot.docs.forEach((doc) => {
      totalDownloads += doc.data().downloads || 0
    })
    ebooksSnapshot.docs.forEach((doc) => {
      totalDownloads += doc.data().downloads || 0
    })
    capDesignsSnapshot.docs.forEach((doc) => {
      totalDownloads += doc.data().downloads || 0
    })

    // Get photographers count
    const photographersSnapshot = await getDocs(collection(db, "photographers"))
    const photographersListed = photographersSnapshot.size

    // Get counts
    const postersUploaded = postersSnapshot.size
    const capDesigns = capDesignsSnapshot.size

    // Get recent activity (last 10 logs)
    const recentActivity = await getSystemLogs(10)

    return {
      totalUsers,
      totalAdmins,
      totalDownloads,
      photographersListed,
      postersUploaded,
      capDesigns,
      recentActivity,
    }
  } catch (error) {
    console.error("Error getting analytics:", error)
    return {
      totalUsers: 0,
      totalAdmins: 0,
      totalDownloads: 0,
      photographersListed: 0,
      postersUploaded: 0,
      capDesigns: 0,
      recentActivity: [],
    }
  }
}

// Get all users with details
export async function getAllUsers(): Promise<any[]> {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"))
    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

// Get download breakdown
export async function getDownloadBreakdown(): Promise<{
  posters: { name: string; downloads: number; id: string }[]
  ebooks: { title: string; downloads: number; id: string }[]
  capDesigns: { name: string; downloads: number; id: string }[]
}> {
  try {
    const postersSnapshot = await getDocs(collection(db, "posters"))
    const ebooksSnapshot = await getDocs(collection(db, "ebooks"))
    const capDesignsSnapshot = await getDocs(collection(db, "capDesigns"))

    const posters = postersSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      downloads: doc.data().downloads || 0,
    })).sort((a, b) => b.downloads - a.downloads)

    const ebooks = ebooksSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      downloads: doc.data().downloads || 0,
    })).sort((a, b) => b.downloads - a.downloads)

    const capDesigns = capDesignsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      downloads: doc.data().downloads || 0,
    })).sort((a, b) => b.downloads - a.downloads)

    return { posters, ebooks, capDesigns }
  } catch (error) {
    console.error("Error getting download breakdown:", error)
    return { posters: [], ebooks: [], capDesigns: [] }
  }
}


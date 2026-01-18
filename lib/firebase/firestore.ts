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
  firstName: string
  lastName?: string
  email?: string
  website?: string
  instagram?: string
  phone?: string
  address?: string
  state?: string
  status: 'contacted' | 'not-contacted' | 'interested-follow-up' | 'not-interested/no-response'
  instagramContact: boolean
  emailContact: boolean
  phoneContact: boolean
  // Legacy fields (optional for backward compatibility)
  name?: string
  location?: string
  description?: string
  style?: string
  tags?: string[]
  price?: number
  rating?: number
  reviews?: number
  verified?: boolean
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

export interface PhotographerBooking {
  id?: string
  photographerId: string
  photographerName: string
  userId: string
  userName: string
  userEmail: string
  status?: "pending" | "contacted" | "completed"
  timestamp: Timestamp
}

/**
 * Photographer Bookings Collection
 */
export const bookingsCollection = collection(db, "photographerBookings")

export async function bookPhotographer(data: Omit<PhotographerBooking, "id" | "timestamp">): Promise<boolean> {
  try {
    const docRef = doc(bookingsCollection)
    await setDoc(docRef, {
      ...data,
      status: "pending",
      timestamp: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error booking photographer:", error)
    return false
  }
}

export async function getPhotographerBookings(photographerId?: string): Promise<PhotographerBooking[]> {
  try {
    let q
    if (photographerId) {
      q = query(bookingsCollection, where("photographerId", "==", photographerId), orderBy("timestamp", "desc"))
    } else {
      q = query(bookingsCollection, orderBy("timestamp", "desc"))
    }
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PhotographerBooking[]
  } catch (error) {
    console.error("Error getting bookings:", error)
    return []
  }
}

/**
 * Photographers Collection
 */
export const photographersCollection = collection(db, "photographers")

export async function getPhotographers(statusFilter?: string): Promise<Photographer[]> {
  try {
    let q
    if (statusFilter) {
      // Try to query with orderBy, but fallback to simple query if index doesn't exist
      try {
        q = query(photographersCollection, where("status", "==", statusFilter), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]
      } catch (orderByError: any) {
        // If orderBy fails (likely missing index), try without it
        console.warn("OrderBy failed, trying without it:", orderByError)
        q = query(photographersCollection, where("status", "==", statusFilter))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]
      }
    } else {
      // Try to query with orderBy, but fallback to simple query if index doesn't exist
      try {
        q = query(photographersCollection, orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]
      } catch (orderByError: any) {
        // If orderBy fails (likely missing index), try without it
        console.warn("OrderBy failed, trying without it:", orderByError)
        const snapshot = await getDocs(photographersCollection)
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]
      }
    }
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
    const photographerData: any = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    // Remove undefined values
    Object.keys(photographerData).forEach(key => {
      if (photographerData[key] === undefined) {
        delete photographerData[key]
      }
    })
    await setDoc(docRef, photographerData)
    return docRef.id
  } catch (error) {
    console.error("Error adding photographer:", error)
    return null
  }
}

// Import photographers from JSON data
export async function importPhotographers(jsonData: any[]): Promise<{ success: number; errors: number }> {
  let success = 0
  let errors = 0

  for (const item of jsonData) {
    try {
      // Skip header rows
      if (item["First Name"] === "First Name" || item["Contact Stage"] === "Contact Stage") {
        continue
      }

      // Normalize status value - support both old and new key names
      let status = item["Contact Stage"] || item.Column1 || item.Status || "interested-follow-up"
      if (typeof status === "string") {
        status = status.toLowerCase().trim()
        // Map various status formats to our enum values
        if (status.includes("interested") && status.includes("follow")) {
          status = "interested-follow-up"
        } else if (status.includes("contacted")) {
          status = "contacted"
        } else if (status.includes("not") && status.includes("contacted")) {
          status = "not-contacted"
        } else if (status.includes("not") || status.includes("no response")) {
          status = "not-interested/no-response"
        }
      }

      // Map JSON columns to Photographer interface - support both old and new key names
      const photographerData: Omit<Photographer, "id" | "createdAt" | "updatedAt"> = {
        firstName: item["First Name"] || item.Column2 || "",
        lastName: item["Last Name"] || item.Column3 || undefined,
        email: item["Email"] || item.Column4 || undefined,
        website: item["Website"] || item.Column5 || undefined,
        instagram: item["Instagram"] || item.Column6 || undefined,
        phone: item["Phone Number"] || item["Phone"] || item.Column7 || undefined,
        address: item["Address"] || item.Column8 || undefined,
        state: item["State"] || item.Column9 || undefined,
        status: status as Photographer["status"],
        // Support both old and new key names for contact preferences
        instagramContact: item["Instagram-contact"] === true || item["Mode of Contact"] === true || item["Column 10"] === true || false,
        emailContact: item["Email-contact"] === true || item.Column11 === true || false,
        phoneContact: item["Phone-contact"] === true || item.Column12 === true || false,
      }

      // Remove empty strings and convert to undefined
      Object.keys(photographerData).forEach(key => {
        const value = photographerData[key as keyof typeof photographerData]
        if (value === "" || value === " " || value === null) {
          photographerData[key as keyof typeof photographerData] = undefined as any
        }
      })

      // Ensure firstName is not empty
      if (!photographerData.firstName) {
        console.warn("Skipping photographer with no first name:", item)
        errors++
        continue
      }

      await addPhotographer(photographerData)
      success++
    } catch (error) {
      console.error("Error importing photographer:", error, item)
      errors++
    }
  }

  return { success, errors }
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


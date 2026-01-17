import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./config"

// Type definitions (same as client version)
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

/**
 * Photographers Collection - Server Side
 */
export const photographersCollection = collection(db, "photographers")

export async function addPhotographerServer(data: Omit<Photographer, "id" | "createdAt" | "updatedAt">): Promise<string | null> {
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

// Import photographers from JSON data - Server Side
export async function importPhotographersServer(jsonData: any[]): Promise<{ success: number; errors: number }> {
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

      await addPhotographerServer(photographerData)
      success++
    } catch (error) {
      console.error("Error importing photographer:", error, item)
      errors++
    }
  }

  return { success, errors }
}


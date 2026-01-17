/**
 * Script to import photographers from JSON file to Firestore
 * 
 * Usage:
 * 1. Make sure you have Firebase initialized
 * 2. Run: npx tsx scripts/import-photographers.ts
 * 
 * Or use the import page at /admin/photographers/import
 */

import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import photographersData from "../data/photographers.json"
import { db } from "../lib/firebase/config"

interface PhotographerData {
  Column1?: string
  Column2?: string
  Column3?: string
  Column4?: string
  Column5?: string
  Column6?: string
  Column7?: string
  Column8?: string
  Column9?: string
  "Mode of Contact"?: boolean
  Column11?: boolean
  Column12?: boolean
}

interface Photographer {
  firstName: string
  lastName?: string
  email?: string
  website?: string
  instagram?: string
  phone?: string
  address?: string
  state?: string
  status: "contacted" | "not-contacted" | "interested-follow-up" | "not-interested/no-response"
  instagramContact: boolean
  emailContact: boolean
  phoneContact: boolean
}

function normalizeStatus(status: string | undefined): Photographer["status"] {
  if (!status) return "interested-follow-up"
  
  const normalized = status.toLowerCase().trim()
  if (normalized.includes("interested") && normalized.includes("follow")) {
    return "interested-follow-up"
  } else if (normalized.includes("contacted")) {
    return "contacted"
  } else if (normalized.includes("not") && normalized.includes("contacted")) {
    return "not-contacted"
  } else if (normalized.includes("not") || normalized.includes("no response")) {
    return "not-interested/no-response"
  }
  return "interested-follow-up"
}

function transformPhotographerData(item: PhotographerData): Photographer | null {
  // Skip header rows or invalid data
  if (!item.Column2 || item.Column2 === "First Name") {
    return null
  }

  const photographer: Photographer = {
    firstName: item.Column2.trim(),
    lastName: item.Column3?.trim() || undefined,
    email: item.Column4?.trim() || undefined,
    website: item.Column5?.trim() || undefined,
    instagram: item.Column6?.trim() || undefined,
    phone: item.Column7?.trim() || undefined,
    address: item.Column8?.trim() || undefined,
    state: item.Column9?.trim() || undefined,
    status: normalizeStatus(item.Column1),
    instagramContact: item["Mode of Contact"] === true || false,
    emailContact: item.Column11 === true || false,
    phoneContact: item.Column12 === true || false,
  }

  // Clean up empty strings
  Object.keys(photographer).forEach((key) => {
    const value = photographer[key as keyof Photographer]
    if (value === "" || value === " ") {
      photographer[key as keyof Photographer] = undefined as any
    }
  })

  return photographer
}

async function importPhotographers() {
  console.log("Starting photographer import...")
  console.log(`Found ${photographersData.length} records in JSON file`)

  const photographersCollection = collection(db, "photographers")
  let success = 0
  let errors = 0

  for (const item of photographersData as PhotographerData[]) {
    try {
      const photographer = transformPhotographerData(item)
      
      if (!photographer) {
        console.log("Skipping header or invalid row")
        continue
      }

      if (!photographer.firstName) {
        console.warn("Skipping photographer with no first name:", item)
        errors++
        continue
      }

      const docRef = doc(photographersCollection)
      const photographerData: any = {
        ...photographer,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Remove undefined values
      Object.keys(photographerData).forEach((key) => {
        if (photographerData[key] === undefined) {
          delete photographerData[key]
        }
      })

      await setDoc(docRef, photographerData)
      console.log(`✓ Imported: ${photographer.firstName} ${photographer.lastName || ""}`)
      success++
    } catch (error) {
      console.error("Error importing photographer:", error, item)
      errors++
    }
  }

  console.log("\n=== Import Complete ===")
  console.log(`Successfully imported: ${success}`)
  console.log(`Errors: ${errors}`)
  console.log(`Total processed: ${success + errors}`)
}

// Run the import if this file is executed directly
if (require.main === module) {
  importPhotographers()
    .then(() => {
      console.log("Import script completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Fatal error:", error)
      process.exit(1)
    })
}


"use client"

import { ref, uploadBytes, getDownloadURL, deleteObject, UploadResult } from "firebase/storage"
import { storage } from "./config"

/**
 * Upload a file to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., "posters/image.jpg", "photographers/photo.jpg")
 * @returns Download URL or error
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    console.log("📤 Starting upload to path:", path)
    const storageRef = ref(storage, path)
    console.log("📤 Storage ref created, attempting upload...")
    const snapshot = await uploadBytes(storageRef, file)
    console.log("✅ Upload successful, getting download URL...")
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log("✅ Download URL obtained:", downloadURL)
    return { url: downloadURL, error: null }
  } catch (error: any) {
    console.error("❌ Error uploading file:", error)
    console.error("❌ Error code:", error.code)
    console.error("❌ Error message:", error.message)
    console.error("❌ Full error:", JSON.stringify(error, null, 2))
    return { url: null, error: error.message }
  }
}

/**
 * Upload an image file
 * @param file - Image file
 * @param folder - Folder name (e.g., "posters", "photographers", "ebooks")
 * @param fileName - Optional custom file name, defaults to timestamp
 * @returns Download URL or error
 */
export async function uploadImage(
  file: File,
  folder: string,
  fileName?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Generate file name if not provided
    const name = fileName || `${Date.now()}_${file.name}`
    const path = `${folder}/${name}`
    return await uploadFile(file, path)
  } catch (error: any) {
    return { url: null, error: error.message }
  }
}

/**
 * Delete a file from Firebase Storage
 * @param path - Storage path to delete
 * @returns Success or error
 */
export async function deleteFile(path: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error deleting file:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Get download URL for a file
 * @param path - Storage path
 * @returns Download URL or error
 */
export async function getFileURL(path: string): Promise<{ url: string | null; error: string | null }> {
  try {
    const storageRef = ref(storage, path)
    const url = await getDownloadURL(storageRef)
    return { url, error: null }
  } catch (error: any) {
    console.error("Error getting file URL:", error)
    return { url: null, error: error.message }
  }
}

const PROFILE_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

function extensionForImage(file: File): string {
  const mime = file.type
  if (mime === "image/jpeg") return ".jpg"
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  if (mime === "image/gif") return ".gif"
  const match = file.name.match(/\.(jpe?g|png|gif|webp)$/i)
  if (match) return match[0].toLowerCase()
  return ".jpg"
}

/**
 * Upload a profile or banner image for a user. Stored under `users/{uid}/profile/…`
 * (must match Storage security rules).
 */
export async function uploadUserProfileImage(
  uid: string,
  kind: "avatar" | "banner",
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const mime = file.type || "application/octet-stream"
  if (!PROFILE_IMAGE_MIMES.has(mime)) {
    return {
      url: null,
      error: "Please choose a JPEG, PNG, WebP, or GIF image.",
    }
  }
  const maxBytes = 5 * 1024 * 1024
  if (file.size > maxBytes) {
    return { url: null, error: "Image must be 5MB or smaller." }
  }
  const ext = extensionForImage(file)
  const path = `users/${uid}/profile/${kind}_${Date.now()}${ext}`
  return uploadFile(file, path)
}


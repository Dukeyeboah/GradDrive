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
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return { url: downloadURL, error: null }
  } catch (error: any) {
    console.error("Error uploading file:", error)
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


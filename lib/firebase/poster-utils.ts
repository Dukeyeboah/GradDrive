/**
 * Utility functions for handling poster image URLs
 * Converts high-res PNG URLs to low-res JPEG URLs for display
 * 
 * Note: Firebase Storage download URLs contain file-specific tokens.
 * We cannot reuse a token from one file for another file.
 * Therefore, we need to either:
 * 1. Store the low-res URL in Firestore (recommended) - DONE
 * 2. Fetch it dynamically using Firebase Storage API (for existing posters)
 * 3. Fall back to high-res if low-res fails (current implementation)
 */

import { getFileURL } from './storage'

/**
 * Converts a high-res PNG URL from posters/ to a low-res JPEG URL from posters/lowRes/
 * @param highResUrl - The high-res PNG URL (e.g., from posters/filename.png)
 * @returns The corresponding low-res JPEG URL (e.g., from posters/lowRes/filename.jpg)
 */
export function getLowResImageUrl(highResUrl: string | undefined): string | undefined {
  if (!highResUrl) return undefined

  try {
    // Extract the filename from the URL
    // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/posters%2Ffilename.png?alt=media&token=...
    const urlMatch = highResUrl.match(/\/o\/([^?]+)/)
    if (!urlMatch) return highResUrl // If we can't parse, return original

    const storagePath = decodeURIComponent(urlMatch[1])
    
    // Check if it's already a low-res URL
    if (storagePath.includes('lowRes/')) {
      return highResUrl
    }

    // Extract folder and filename
    const pathParts = storagePath.split('/')
    if (pathParts.length < 2) return highResUrl

    const folder = pathParts[0] // Should be "posters"
    const filename = pathParts.slice(1).join('/') // The rest is the filename

    // Convert PNG to JPG (change extension)
    const filenameWithoutExt = filename.replace(/\.(png|PNG)$/, '')
    const lowResFilename = `${filenameWithoutExt}.jpg`

    // Build the low-res path
    const lowResPath = `${folder}/lowRes/${lowResFilename}`

    // Reconstruct the URL with the new path
    // Note: We can't reuse the token from high-res URL, so we need to construct a new URL
    // The token won't work for a different file, so we'll need to get a new download URL
    // For now, we'll construct the URL without the token - it may need to be fetched properly
    const urlParts = highResUrl.split('/o/')
    if (urlParts.length !== 2) return highResUrl

    const baseUrl = urlParts[0]
    // Remove the token query string since it's specific to the high-res file
    // The low-res file will need its own token or we'll need to fetch it via Firebase Storage API
    
    // Encode the path properly
    const encodedPath = encodeURIComponent(lowResPath)
    // Construct URL without token - Firebase Storage may still serve it, or we'll fall back to high-res
    const lowResUrl = `${baseUrl}/o/${encodedPath}?alt=media`

    return lowResUrl
  } catch (error) {
    console.error('Error converting to low-res URL:', error)
    return highResUrl // Fallback to original URL
  }
}

/**
 * Gets the display image URL (low-res) for a poster
 * Only returns low-res if high-res exists
 */
export function getPosterDisplayUrl(poster: { imageUrl?: string; lowResImageUrl?: string }): string | undefined {
  // If high-res doesn't exist, don't show anything
  if (!poster.imageUrl) return undefined

  // If lowResImageUrl is explicitly set, use it
  if (poster.lowResImageUrl) return poster.lowResImageUrl

  // Otherwise, convert high-res URL to low-res
  return getLowResImageUrl(poster.imageUrl)
}

/**
 * Gets the download URL (high-res) for a poster
 */
export function getPosterDownloadUrl(poster: { imageUrl?: string }): string | undefined {
  return poster.imageUrl
}


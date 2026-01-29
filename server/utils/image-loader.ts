import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * Load local image file and convert to base64 data URL
 * @param imagePath - Path relative to project root or absolute path
 * @returns base64 data URL string
 * 
 * @example
 * // From public directory
 * const logoUrl = await getLocalImageBase64('public/logo.png')
 * 
 * // From assets directory  
 * const iconUrl = await getLocalImageBase64('assets/icons/icon.svg')
 */
export async function getLocalImageBase64(imagePath: string): Promise<string | null> {
  try {
    const projectRoot = resolve(process.cwd())
    const fullPath = resolve(projectRoot, imagePath)
    
    console.log('[ImageLoader] Loading image from:', fullPath)
    
    const buffer = await readFile(fullPath)
    const mimeType = getMimeType(imagePath)
    
    if (!mimeType) {
      console.error('[ImageLoader] Unsupported image format:', imagePath)
      return null
    }
    
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    console.log(`[ImageLoader] Image loaded successfully (size: ${buffer.length} bytes)`)
    
    return dataUrl
  } catch (error) {
    console.error('[ImageLoader] Failed to load image:', imagePath, error)
    return null
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string | null {
  const ext = filePath.toLowerCase().split('.').pop()
  
  const mimeMap: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon',
  }
  
  return ext ? mimeMap[ext] || null : null
}

/**
 * Cache for loaded images to avoid repeated file reads
 */
const imageCache = new Map<string, string>()

/**
 * Get local image with caching
 */
export async function getLocalImageBase64Cached(imagePath: string): Promise<string | null> {
  if (imageCache.has(imagePath)) {
    console.log('[ImageLoader] Using cached image:', imagePath)
    return imageCache.get(imagePath)!
  }
  
  const dataUrl = await getLocalImageBase64(imagePath)
  
  if (dataUrl) {
    imageCache.set(imagePath, dataUrl)
  }
  
  return dataUrl
}

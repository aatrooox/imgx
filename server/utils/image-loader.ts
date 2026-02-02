/**
 * Load image from Nitro server assets and convert to base64 data URL
 * @param assetKey - Asset key in format: "images/logo.png" (without "assets:" prefix)
 * @returns base64 data URL string
 * 
 * @example
 * const logoUrl = await getServerAssetImageBase64('images/logo.png')
 */
export async function getServerAssetImageBase64(assetKey: string): Promise<string | null> {
  try {
    const storage = useStorage('assets:server')
    
    console.log('[ImageLoader] Loading server asset:', assetKey)
    
    const buffer = await storage.getItemRaw<Buffer>(assetKey)
    
    if (!buffer) {
      console.error('[ImageLoader] Asset not found:', assetKey)
      return null
    }
    
    const mimeType = getMimeType(assetKey)
    
    if (!mimeType) {
      console.error('[ImageLoader] Unsupported image format:', assetKey)
      return null
    }
    
     // Ensure buffer is a proper Buffer object (Nitro storage may return Uint8Array or plain object)
     const properBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
     const base64 = properBuffer.toString('base64')
     const dataUrl = `data:${mimeType};base64,${base64}`
     
     console.log('[ImageLoader] Base64 preview:', base64.substring(0, 50))
     console.log(`[ImageLoader] Asset loaded successfully (size: ${properBuffer.length} bytes, type: ${properBuffer.constructor.name})`)
    
    return dataUrl
  } catch (error) {
    console.error('[ImageLoader] Failed to load asset:', assetKey, error)
    return null
  }
}

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

const imageCache = new Map<string, string>()

/**
 * Get server asset image with caching
 */
export async function getServerAssetImageBase64Cached(assetKey: string): Promise<string | null> {
  if (imageCache.has(assetKey)) {
    console.log('[ImageLoader] Using cached asset:', assetKey)
    return imageCache.get(assetKey)!
  }
  
  const dataUrl = await getServerAssetImageBase64(assetKey)
  
  if (dataUrl) {
    imageCache.set(assetKey, dataUrl)
  }
  
  return dataUrl
}

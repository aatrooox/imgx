import type { H3Event } from 'h3'

export function isCacheEnabled(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function setCacheHeaders(event: H3Event, etag?: string): boolean {
  if (!isCacheEnabled()) {
    setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
    return false
  }

  setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
  
  if (etag) {
    setHeader(event, 'ETag', etag)
    setHeader(event, 'Last-Modified', new Date().toUTCString())
    
    const ifNoneMatch = getRequestHeader(event, 'if-none-match')
    if (ifNoneMatch === etag) {
      event.node.res.statusCode = 304
      return true
    }
  }
  
  return false
}

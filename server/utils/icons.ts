import { iconToSVG, iconToHTML } from '@iconify/utils'

interface IconData {
  body: string
  width?: number
  height?: number
  left?: number
  top?: number
}

/**
 * Get base64 icon URL for use in backgroundImage
 */
export async function getBase64IconURL(iconName: string, iconSize: number) {
  console.log('[Icons] getBase64IconURL called with:', { iconName, iconSize })
  
  const svgHTML = await getIconSVGHTML(iconName, iconSize)
  
  console.log('[Icons] getIconSVGHTML returned:', svgHTML ? 'SVG HTML (length: ' + svgHTML.length + ')' : 'null')
  
  if (!svgHTML) {
    console.log('[Icons] getBase64IconURL returning null - no SVG HTML')
    return null
  }
   
  const base64SVG = `data:image/svg+xml;base64,${Buffer.from(svgHTML, 'utf8').toString('base64')}`
  console.log('[Icons] Base64 URL generated (length:', base64SVG.length, ')')
  return base64SVG
}

export async function getIconSVGHTML(iconName: string, iconSize: number) { 
  console.log('[Icons] getIconSVGHTML called with:', { iconName, iconSize })
  
  const [prefix, iconInnerName] = iconName.split(':')
  
  console.log('[Icons] Parsed icon name - prefix:', prefix, ', iconInnerName:', iconInnerName)
  
  if (!prefix || !iconInnerName) {
    console.log('[Icons] ERROR: Invalid icon name format - missing prefix or iconInnerName')
    return null
  }

  const apiUrl = `https://api.iconify.design/${prefix}.json?icons=${iconInnerName}`
  console.log('[Icons] Fetching from:', apiUrl)
  
  // Retry logic for network issues
  const maxRetries = 3
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Icons] Fetch attempt ${attempt}/${maxRetries}`)
      
      const resData = await $fetch<any>(apiUrl, {
        timeout: 30000, // 30 second timeout
        retry: 0, // We handle retries manually
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        // Disable SSL verification if needed (only for development)
        // @ts-ignore
        agent: false
      })
      
      console.log('[Icons] API response received')
      console.log('[Icons] API response keys:', Object.keys(resData))
      
      const iconData = resData.icons?.[iconInnerName] as IconData

      if (!iconData) {
        console.log('[Icons] ERROR: Icon not found in response data')
        console.log('[Icons] Available icons:', Object.keys(resData.icons || {}))
        return null
      }

      console.log('[Icons] Icon data found')

      const sizes = {
        width: iconData.width ?? resData.width ?? 50,
        height: iconData.height ?? resData.height ?? 50
      }
      
      console.log('[Icons] Using sizes:', sizes)
      
      const renderData = iconToSVG({ ...iconData, ...sizes }, sizes)
      
      console.log('[Icons] Render data generated')

      const iconSVG = iconToHTML(renderData.body, renderData.attributes)
      
      console.log('[Icons] Generated SVG HTML (length:', iconSVG.length, ')')
      
      return iconSVG
    } catch (error: any) {
      lastError = error
      console.error(`[Icons] Fetch attempt ${attempt} failed:`, error.message)
      console.error(`[Icons] Error details:`, error)
      
      if (attempt < maxRetries) {
        const delay = attempt * 1000 // Exponential backoff: 1s, 2s, 3s
        console.log(`[Icons] Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  console.error('[Icons] All fetch attempts failed. Last error:', lastError)
  
  // Fallback: Try using native fetch if $fetch fails
  console.log('[Icons] Attempting fallback with native fetch...')
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      console.error('[Icons] Native fetch failed with status:', response.status)
      return null
    }
    
    const resData = await response.json()
    console.log('[Icons] Native fetch succeeded!')
    
    const iconData = resData.icons?.[iconInnerName] as IconData
    if (!iconData) {
      console.log('[Icons] Icon not found in fallback response')
      return null
    }
    
    const sizes = {
      width: iconData.width ?? resData.width ?? 50,
      height: iconData.height ?? resData.height ?? 50
    }
    
    const renderData = iconToSVG({ ...iconData, ...sizes }, sizes)
    const iconSVG = iconToHTML(renderData.body, renderData.attributes)
    
    console.log('[Icons] Fallback succeeded, generated SVG HTML (length:', iconSVG.length, ')')
    return iconSVG
  } catch (fallbackError) {
    console.error('[Icons] Fallback also failed:', fallbackError)
    return null
  }
}

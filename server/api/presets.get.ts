import { getAllPresets } from '~/server/utils/preset'

export default defineEventHandler(async (event) => {
  console.log('[API /api/presets] Request received')
  
  try {
    console.log('[API /api/presets] Calling getAllPresets()')
    const presets = await getAllPresets()
    console.log('[API /api/presets] getAllPresets returned:', presets.length, 'presets')

    // Add id field for frontend compatibility
    const presetsWithId = presets.map(preset => ({
      ...preset,
      id: preset.code
    }))
    
    console.log('[API /api/presets] Returning response with', presetsWithId.length, 'presets')

    return {
      success: true,
      data: presetsWithId
    }
  } catch (error) {
    console.error('[API /api/presets] Error occurred:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load presets'
    })
  }
})

import { getAllPresets } from '~/server/utils/preset'

export default defineEventHandler(async (event) => {
  try {
    const presets = await getAllPresets()

    // Add id field for frontend compatibility
    const presetsWithId = presets.map(preset => ({
      ...preset,
      id: preset.code
    }))

    return {
      success: true,
      data: presetsWithId
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load presets'
    })
  }
})

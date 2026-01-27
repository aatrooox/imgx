import { getPresetByCode } from '~/server/utils/preset'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing preset code'
    })
  }

  try {
    const preset = await getPresetByCode(code)

    if (!preset) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Preset not found'
      })
    }

    return {
      success: true,
      data: preset
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load preset'
    })
  }
})

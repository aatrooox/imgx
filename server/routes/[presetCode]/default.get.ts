import { joinURL } from 'ufo'
export default defineEventHandler(async (event) => {
  const presetCode = getRouterParam(event, 'presetCode')
  const query = getQuery(event)
  const proxyUrl = 'http://localhost:5777/api/v1/img/'
  if (!presetCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Preset code is required'
    })
  }
  const queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
  const targetUrl = joinURL(proxyUrl, presetCode, `?${queryStr}`)

  return proxyRequest(event, targetUrl)
});
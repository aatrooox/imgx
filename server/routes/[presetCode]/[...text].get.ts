import { joinURL } from 'ufo'
export default defineEventHandler(async (event) => {
  const presetCode = getRouterParam(event, 'presetCode') || ''
  const text = getRouterParam(event, 'text') || ''
  const query = getQuery(event)
  const proxyUrl = 'http://localhost:5777/api/v1/img/'
  
  const queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
  const targetUrl = joinURL(proxyUrl, presetCode as string, text as string, `?${queryStr}`)

  return proxyRequest(event, targetUrl)
});
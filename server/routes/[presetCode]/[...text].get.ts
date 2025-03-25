import { joinURL } from 'ufo'
export default defineEventHandler(async (event) => {
  const presetCode = getRouterParam(event, 'presetCode')
  const text = getRouterParam(event, 'text')
  const query = getQuery(event)
  const proxyUrl = 'http://localhost:5770/api/v1/img/'
  
  const queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
  const targetUrl = joinURL(proxyUrl, presetCode, text, `?${queryStr}`)

  return proxyRequest(event, targetUrl)
});
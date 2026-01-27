export interface Preset {
  code: string
  name: string
  description?: string
  template: string
  width: number
  height: number
  contentProps: Record<string, any>
  styleProps: Record<string, any>
  contentKeys: string
  propsSchema?: any[]
}

let presetsCache: Record<string, Preset> | null = null

export async function loadPresets(): Promise<Record<string, Preset>> {
  console.log('[loadPresets] Starting to load presets...')
  
  if (presetsCache) {
    console.log('[loadPresets] Returning cached presets, count:', Object.keys(presetsCache).length)
    return presetsCache
  }
  
  presetsCache = {}
  
  try {
    console.log('[loadPresets] Initializing storage with key: assets:presets')
    const storage = useStorage('assets:presets')
    
    console.log('[loadPresets] Getting storage keys...')
    const keys = await storage.getKeys()
    console.log('[loadPresets] Found keys:', keys)
    
    for (const key of keys) {
      console.log('[loadPresets] Processing key:', key)
      if (key.endsWith('.json')) {
        // getItem() auto-parses JSON files, no need for JSON.parse()
        const preset = await storage.getItem<Preset>(key)
        console.log('[loadPresets] Content for', key, ':', preset ? 'exists' : 'null')
        if (preset && preset.code) {
          console.log('[loadPresets] Loaded preset:', preset.code, '-', preset.name)
          presetsCache[preset.code] = preset
        }
      } else {
        console.log('[loadPresets] Skipping non-json key:', key)
      }
    }
    
    console.log('[loadPresets] Loaded presets count:', Object.keys(presetsCache).length)
    console.log('[loadPresets] Preset codes:', Object.keys(presetsCache))
  } catch (error) {
    console.error('[loadPresets] Failed to load presets:', error)
    console.error('[loadPresets] Error stack:', error instanceof Error ? error.stack : 'No stack')
  }
  
  return presetsCache
}

export async function getPresetByCode(code: string): Promise<Preset | null> {
  const presets = await loadPresets()
  return presets[code] || null
}

export async function getAllPresets(): Promise<Preset[]> {
  const presets = await loadPresets()
  return Object.values(presets)
}

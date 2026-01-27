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
  if (presetsCache) return presetsCache
  
  presetsCache = {}
  
  try {
    const storage = useStorage('assets:presets')
    const keys = await storage.getKeys()
    
    for (const key of keys) {
      if (key.endsWith('.json')) {
        const content = await storage.getItem(key)
        if (content) {
          const preset = JSON.parse(content as string) as Preset
          if (preset.code) {
            presetsCache[preset.code] = preset
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to load presets:', error)
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

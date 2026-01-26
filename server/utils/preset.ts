import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

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
  const presetsDir = join(process.cwd(), 'presets')
  
  try {
    const files = await readdir(presetsDir)
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await readFile(join(presetsDir, file), 'utf-8')
        const preset = JSON.parse(content) as Preset
        if (preset.code) {
          presetsCache[preset.code] = preset
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load presets:', error)
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

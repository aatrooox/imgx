<template>
  <div class="min-h-screen bg-[#2b2416] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题区域 -->
      <div class="text-center mb-12 relative">
        <div class="bg-[#2f2819] p-6 rounded-lg relative overflow-hidden border-b border-[#8b7355]/30">
          <h1 class="text-3xl text-[#e6c577]/90 mb-3 relative tracking-wide">
            预设图鉴
          </h1>
          <p class="text-[#a89066]/80 text-sm mb-4">搜集和预览所有可用的预设模板</p>
          <Button 
            @click="navigateTo('/')"
            class="bg-[#3c2e1c] text-[#e6c577]/90 hover:bg-[#4d3b25] px-5 py-1.5 rounded-sm text-sm tracking-wide transform hover:scale-105 transition-all duration-200 border border-[#8b7355]/30"
          >
            返回首页
          </Button>
        </div>
      </div>

      <!-- 预设列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="preset in presets" 
          :key="preset.id"
          class="relative group"
        >
          <!-- 卡片背景装饰 -->
          <div class="absolute inset-0 border-2 border-[#8b7355] bg-[#2b2416] rounded-lg transform rotate-1 opacity-50 pattern-card"></div>
          
          <!-- 主卡片 -->
          <div class="relative bg-[#3c2e1c] border-2 border-[#8b7355] rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1">
            <!-- 预设预览区域 -->
            <div class="relative aspect-[4/3] bg-[#2b2416] p-4">
              <div class="absolute inset-0 bg-gradient-to-b from-[#e6c577]/10 to-transparent"></div>
              <img 
                :src="config.public.ipxServer + preset.code + '.png'" 
                :alt="preset.name"
                class="w-full h-full object-contain"
              />
              <!-- 预设代码标签 -->
              <div class="absolute top-3 right-3 bg-[#5c4730] text-[#e6c577] text-xs  rounded-sm border border-[#8b7355] transform -rotate-3">
                {{ preset.code }}
              </div>
              <!-- 尺寸信息标签 -->
              <div class="absolute bottom-3 left-3 bg-[#2b2416]/80 text-[#a89066] text-xs px-2 py-1">
               <div class="flex gap-2">
                <div class="flex items-center rounded-sm border border-[#8b7355]/50 px-3 py-1">
                  <NuxtIcon name="material-symbols:aspect-ratio" class="mr-1 text-[#e6c577]/70" />
                  <span>{{ preset.width }} x {{ preset.height }}px</span>
                </div>
                <div class="flex items-center mt-1 rounded-sm border border-[#8b7355]/50 px-3 py-1">
                  <NuxtIcon name="material-symbols:file-copy-outline" class="mr-1 text-[#e6c577]/70" />
                  <span>约 {{ calculatePngSize(preset.width, preset.height) }}KB</span>
                </div>
               </div>
              </div>
            </div>

            <!-- 预设信息 -->
            <div class="p-4 border-t border-[#8b7355]">
              <h3 class="text-lg font-bold text-[#e6c577] mb-2">{{ preset.name }}</h3>
              <p class="text-sm text-[#a89066] mb-4">{{ preset.description }}</p>
              <div class="flex gap-3">
                <Button 
                  @click="copyPresetUrl(preset)"
                  class="flex-1 bg-[#5c4730] text-[#e6c577] hover:bg-[#6d563a] border border-[#8b7355] px-3 py-1.5 rounded-sm text-sm transform hover:scale-105 transition-all duration-200"
                >
                  <NuxtIcon name="material-symbols:content-copy-outline" class="mr-1" />
                  复制链接
                </Button>
                <Button 
                  @click="copyPresetCode(preset)"
                  class="flex-1 bg-[#5c4730] text-[#e6c577] hover:bg-[#6d563a] border border-[#8b7355] px-3 py-1.5 rounded-sm text-sm transform hover:scale-105 transition-all duration-200"
                >
                  <NuxtIcon name="material-symbols:content-copy-outline" class="mr-1" />
                  复制代码
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Preset {
  id: string
  name: string
  description: string
  code: string
  previewUrl: string
  width: number
  height: number
}

// 预设数据
const presets = ref<Preset[]>([])
const config = useRuntimeConfig()
// 获取预设列表
const getPresets = async () => {
  try {
    const res: any = await $fetch('/api/presets', {
      method: 'GET'
    })
    presets.value = res.data
  } catch (error) {
    console.error('获取预设列表失败', error)
  } finally {
  }
}
// 复制预设链接
const copyPresetUrl = async (preset: Preset) => {
  const url = `/api/v1/img/${preset.code}/`
  try {
    await navigator.clipboard.writeText(url)
    // 可以添加一个成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}
// 复制预设code
const copyPresetCode = async (preset: Preset) => {
  try {
    await navigator.clipboard.writeText(preset.code)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 计算预估PNG大小（单位：KB）
const calculatePngSize = (width: number, height: number): string => {
  // 假设每个像素平均4个字节（RGBA）
  const bytes = width * height * 4
  // PNG 的压缩率根据图像内容差异很大，这里假设压缩率为 90%
  // 对于简单的图标和 Logo，压缩效果通常很好
  const compressedBytes = bytes * 0.1
  // 转换为 KB 并保留一位小数
  const kb = (compressedBytes / 1024).toFixed(1)
  
  // 添加一个基础大小（文件头、元数据等）
  const baseSize = 0.5
  return (Number(kb) + baseSize).toFixed(1)
}

onMounted(() => {
  getPresets()
})
</script>

<style>
/* 使用更微妙的 SVG 纹理 */
/* .bg-[#2b2416] {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238b7355' fill-opacity='0.03'%3E%3Cpath d='M50 0v100M0 50h100'/%3E%3C/g%3E%3C/svg%3E");
} */

/* 保持卡片相关的样式不变 */
.pattern-card {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238b7355' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm20 20L0 0h40L20 20zm0 0L40 40H0L20 20z'/%3E%3C/g%3E%3C/svg%3E");
}

/* 移除之前的其他纹理样式 */

h1, h3 {
  font-family: "Times New Roman", serif;
  letter-spacing: 0.05em;
}
</style>
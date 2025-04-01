<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">预设效果展示</h1>
        <p class="mt-2 text-sm text-gray-600">浏览和预览所有预设模板效果</p>
        <Button @click="navigateTo('/')"> 返回首页</Button>
      </div>

      <!-- 预设网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="preset in presets" 
          :key="preset.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <!-- 预设预览区域 -->
        

          <!-- 预设信息 -->
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-medium text-gray-900">{{ preset.name }} {{ preset.code }}</h3>
              
            </div>
            <p class="text-sm text-gray-600">{{ preset.description }}</p>
            <div class="btns">
                <Button 
                variant="ghost" 
                size="sm"
                @click="copyPresetUrl(preset)"
                class="text-gray-500 hover:text-gray-700"
              >
                <NuxtIcon name="material-symbols:content-copy-outline" class="mr-1" />
                复制链接
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                @click="copyPresetCode(preset)"
                class="text-gray-500 hover:text-gray-700"
              >
                <NuxtIcon name="material-symbols:content-copy-outline" class="mr-1" />
                复制code
              </Button>
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
}

// 预设数据
const presets = ref<Preset[]>([])

// 获取预设列表
const getPresets = async () => {
  try {
    const res: any = await $fetch('/api/v1/preset/list', {
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

onMounted(() => {
  getPresets()
})
</script>
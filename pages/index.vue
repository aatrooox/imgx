<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 顶部导航 -->
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo 部分 -->
          <div class="flex items-center">
            <h1 class="text-2xl sm:text-3xl text-gray-900 font-bold">
              <SparklesText
                text="IMGX"
                :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
                :sparkles-count="5"
                class="!text-2xl sm:!text-3xl"
              />
            </h1>
            <em class="ml-2 text-xs sm:text-sm text-gray-500">v{{ config.public.appVersion }}</em>
          </div>

          <!-- GitHub 链接 -->
          <div class="flex items-center">
            <NuxtIcon 
              name="mdi:github" 
              class="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors" 
              size="1.8em" 
              @click="navigateTo('https://github.com/aatrooox/imgx', { external: true, open: { target: '_blank' } })"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- 标题区域 -->
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            预设模板画廊
          </h2>
          <p class="text-lg text-gray-600">
            选择一个模板，一行代码生成精美封面图
          </p>
        </div>

        <!-- Loading 状态 -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>

        <!-- 瀑布流布局 -->
        <div v-else class="masonry-container">
          <div 
            v-for="preset in presets" 
            :key="preset.code"
            class="masonry-item cursor-pointer group"
            @click="navigateTo(`/preset/${preset.code}`)"
          >
            <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <!-- 图片容器 -->
              <div class="relative aspect-[1200/510] bg-gray-100 overflow-hidden">
                <img 
                  :src="`${baseUrl}/${preset.code}/default`"
                  :alt="preset.name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  @error="handleImageError"
                />
                <!-- 悬停遮罩 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <!-- 代码徽章 -->
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span class="text-xs font-mono font-semibold text-purple-600">{{ preset.code }}</span>
                </div>
              </div>
              
              <!-- 信息区域 -->
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {{ preset.name }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                  {{ preset.description }}
                </p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span>{{ preset.width }} × {{ preset.height }}</span>
                  <span class="bg-gray-100 px-2 py-1 rounded">{{ preset.ratio }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && presets.length === 0" class="text-center py-20">
          <p class="text-gray-500 text-lg">暂无预设模板</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
interface Preset {
  code: string
  name: string
  description: string
  width: number
  height: number
  ratio: string
  template: string
  contentProps: any
  styleProps: any
  contentKeys: string
}

useHead({
  title: 'IMGX - 预设模板画廊',
  meta: [
    {
      name: 'description',
      content: '一行代码生成精美封面图 - 浏览所有预设模板'
    }
  ]
})

const config = useRuntimeConfig()
const baseUrl = config.public.nodeEnv !== 'development' ? 'https://imgx.zzao.club' : 'http://localhost:4573'

const loading = ref(true)
const presets = ref<Preset[]>([])

// 获取所有预设
const fetchPresets = async () => {
  try {
    const res: any = await $fetch('/api/presets', {
      method: 'GET'
    })
    presets.value = res.data || []
  } catch (error) {
    console.error('获取预设列表失败', error)
    presets.value = []
  } finally {
    loading.value = false
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="510" viewBox="0 0 1200 510"%3E%3Crect fill="%23f3f4f6" width="1200" height="510"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3E图片加载失败%3C/text%3E%3C/svg%3E'
}

onMounted(() => {
  fetchPresets()
})
</script>

<style scoped>
/* CSS 列瀑布流布局 */
.masonry-container {
  column-count: 1;
  column-gap: 1.5rem;
}

@media (min-width: 640px) {
  .masonry-container {
    column-count: 2;
  }
}

@media (min-width: 1024px) {
  .masonry-container {
    column-count: 3;
  }
}

@media (min-width: 1280px) {
  .masonry-container {
    column-count: 4;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}

/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

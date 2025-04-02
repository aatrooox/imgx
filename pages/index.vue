<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14">
          <!-- Logo 部分 -->
          <div class="flex items-center">
            <h1 class="text-2xl sm:text-3xl text-gray-900 font-bold">
              <SparklesText
                text="IMG X"
                :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
                :sparkles-count="5"
                class="!text-2xl sm:!text-3xl"
              />
            </h1>
            <em class="ml-2 text-xs sm:text-sm text-gray-500">v{{ config.public.appVersion }}</em>
          </div>

          <!-- 导航按钮 -->
          <div class="flex items-center justify-center  gap-1 sm:gap-2">
            <Button variant="ghost" class="text-sm sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-4 py-1.5" @click="navigateTo('/usage')">预设</Button>
            <Button variant="ghost" class="text-sm sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-4 py-1.5" @click="navigateTo('/playground')">开发</Button>
            <Button variant="ghost" class="text-sm sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-4 py-1.5" @click="navigateTo('/template')">模板</Button>
            <NuxtIcon name="mdi:github" class="cursor-pointer" size="1.5em" @click="navigateTo('https://github.com/aatrooox/imgx', { external: true, open: { target: '_blank' } })"/>
          </div>
        </div>
      </div>
    </nav>

    <!-- 首屏区域 -->
    <section class="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 w-full">
        <!-- 卡片式设计 -->
        <div class="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          <!-- API 展示 -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="p-3 sm:p-6">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">API 示例</h3>
              <div class="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                <pre class="text-xs sm:text-sm text-gray-100 whitespace-pre-wrap break-all"><code>GET {baseUrl}/{presetCode}/{text1}/{text2}</code></pre>
              </div>
              <div class="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                <span class="px-2 py-0.5 bg-gray-100 rounded">baseUrl: https://imgx.zzao.club</span>
                <span class="px-2 py-0.5 bg-gray-100 rounded">presetCode: 预设码</span>
                <span class="px-2 py-0.5 bg-gray-100 rounded">text: 文字内容</span>
              </div>
            </div>
          </div>

          <!-- 预览卡片 -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="p-3 sm:p-6">
              <div class="flex flex-col items-center space-y-3 sm:space-y-4">
                <div class="w-full">
                  <Input v-model="caseUrl" placeholder="请输入API" class="text-sm sm:text-base h-9"></Input>
                </div>
                <!-- 固定宽高比的图片容器 -->
                <div class="relative w-full aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    :src="downloadUrl"
                    alt="预览图"
                    class="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                    :class="{ 'opacity-0': isLoadingImg, 'opacity-100': !isLoadingImg }"
                  />
                  <div v-if="isLoadingImg" class="absolute inset-0 flex items-center justify-center bg-white/70">
                    <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500"></div>
                  </div>
                </div>
                <div class="flex gap-3 sm:gap-4 w-full">
                  <Button size="default" class="flex-1 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-9" @click="downloadUrl = caseUrl">
                    点击生成
                  </Button>
                  <Button size="default" variant="outline" class="flex-1 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-9" @click="downloadImage">
                    下载图片
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'IMGX@早早集市',
  meta: [
    {
      name: 'description',
      content: '一行代码生成封面图'
    }
  ]
})

const config = useRuntimeConfig()
const color = useColorMode()
const isDark = computed(() => color.preference === 'dark')
const shadowColor = computed(() => isDark.value ? 'white' : 'black')
// 保留原有的状态管理代码
const isLoadingImg = ref(false)
const baseUrl = config.public.nodeEnv !== 'development' ? 'https://imgx.zzao.club' : 'http://localhost:4573'

const caseUrl = ref(`${baseUrl}/015/default`)
const downloadUrl = ref('')

const downloadImage = () => {
  if (!downloadUrl.value) {
    return
  }
  // 使用 a 标签下载
  const a = document.createElement('a')
  a.href = downloadUrl.value
  a.download = 'imgx-index.png'
  a.click()
}

onMounted(() => {
  // reRandomBgColors();
  setTimeout(() => {
    // generateImage()
    downloadUrl.value = caseUrl.value
  }, 1000);
})

</script>
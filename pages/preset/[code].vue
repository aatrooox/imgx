<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 顶部导航 -->
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo 部分 -->
          <div class="flex items-center gap-4">
            <button
              @click="navigateTo('/')"
              class="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <NuxtIcon name="mdi:arrow-left" size="1.5em" />
            </button>
            <h1 class="text-2xl sm:text-3xl text-gray-900 font-bold">
              <SparklesText
                text="IMGX"
                :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
                :sparkles-count="5"
                class="!text-2xl sm:!text-3xl"
              />
            </h1>
            <em class="text-xs sm:text-sm text-gray-500">v{{ config.public.appVersion }}</em>
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
        <!-- Loading 状态 -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-500 text-lg">{{ error }}</p>
          <button
            @click="navigateTo('/')"
            class="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            返回首页
          </button>
        </div>

        <!-- 预设详情 -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 左侧：预览和基本信息 -->
          <div class="lg:col-span-2">
            <!-- 预设信息头 -->
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ preset.name }}</h1>
              <p class="text-lg text-gray-600 mb-4">{{ preset.description }}</p>
              <div class="flex items-center gap-6 text-sm text-gray-600">
                <span class="bg-gray-100 px-3 py-1 rounded">预设码: <span class="font-mono font-semibold text-purple-600">{{ preset.code }}</span></span>
                <span>{{ preset.width }} × {{ preset.height }}</span>
                <span>{{ preset.ratio }}</span>
              </div>
            </div>

            <!-- 图片预览 -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div class="relative bg-gray-100">
                <img 
                  :src="previewUrl"
                  alt="预览"
                  class="w-full h-auto"
                  :style="{ aspectRatio: `${preset.width}/${preset.height}` }"
                />
              </div>
              <div class="p-4 border-t border-gray-200">
                <div class="flex items-center gap-2">
                  <input 
                    type="text" 
                    :value="previewUrl"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    @click="copyToClipboard(previewUrl)"
                    class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <NuxtIcon name="mdi:content-copy" size="1em" />
                    复制
                  </button>
                </div>
              </div>
            </div>

            <!-- 使用示例 -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">使用示例</h3>
              
              <!-- GET 请求示例 -->
              <div class="mb-6">
                <h4 class="font-semibold text-gray-800 mb-2">GET 请求</h4>
                <div class="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <code class="text-sm font-mono text-gray-700">{{ getRequestExample }}</code>
                </div>
                <button
                  @click="copyToClipboard(getRequestExample)"
                  class="mt-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  复制示例
                </button>
              </div>

              <!-- POST 请求示例 -->
              <div class="mb-6">
                <h4 class="font-semibold text-gray-800 mb-2">POST 请求</h4>
                <p class="text-xs text-gray-600 mb-2">通过 JSON body 传递内容和样式参数，无需 URL 编码</p>
                <div class="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <code class="text-sm font-mono text-gray-700 whitespace-pre-wrap">{{ postRequestExample }}</code>
                </div>
                <button
                  @click="copyToClipboard(postRequestExample)"
                  class="mt-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  复制示例
                </button>
              </div>

              <!-- Markdown 嵌入 -->
              <div>
                <h4 class="font-semibold text-gray-800 mb-2">Markdown 嵌入</h4>
                <div class="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <code class="text-sm font-mono text-gray-700">{{ markdownExample }}</code>
                </div>
                <button
                  @click="copyToClipboard(markdownExample)"
                  class="mt-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  复制示例
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧：编辑表单 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">自定义参数</h3>

              <!-- 内容参数 -->
              <div v-if="Object.keys(contentPropsForm).length > 0" class="mb-8">
                <h4 class="font-semibold text-gray-800 mb-3 text-sm">内容参数</h4>
                <div class="space-y-3">
                  <div v-for="(value, key) in contentPropsForm" :key="`content-${key}`">
                    <label class="text-xs font-medium text-gray-700 block mb-1">{{ key }}</label>
                    <input 
                      v-model="contentPropsForm[key]"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      @input="updatePreview"
                    />
                  </div>
                </div>
              </div>

              <!-- 样式参数 -->
              <div v-if="Object.keys(stylePropsForm).length > 0" class="mb-8">
                <h4 class="font-semibold text-gray-800 mb-3 text-sm">样式参数</h4>
                <div class="space-y-3">
                  <div v-for="(value, key) in stylePropsForm" :key="`style-${key}`">
                    <label class="text-xs font-medium text-gray-700 block mb-1">{{ key }}</label>
                    <div v-if="isColorProp(key)" class="flex items-center gap-2">
                      <input 
                        v-model="stylePropsForm[key]"
                        type="color"
                        class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        @input="updatePreview"
                      />
                      <input 
                        v-model="stylePropsForm[key]"
                        type="text"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        @input="updatePreview"
                      />
                    </div>
                    <input 
                      v-else
                      v-model="stylePropsForm[key]"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      @input="updatePreview"
                    />
                  </div>
                </div>
              </div>

              <!-- 生成 URL 按钮 -->
              <button
                @click="generateCustomUrl"
                class="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                生成自定义 URL
              </button>

              <!-- 自定义 URL 显示 -->
              <div v-if="customUrl" class="mt-4 p-4 bg-purple-50 rounded-lg">
                <p class="text-xs text-gray-600 mb-2">自定义 URL:</p>
                <div class="flex items-center gap-2">
                  <input 
                    type="text" 
                    :value="customUrl"
                    readonly
                    class="flex-1 px-3 py-2 border border-purple-300 rounded-lg bg-white text-xs font-mono overflow-hidden text-ellipsis"
                  />
                  <button
                    @click="copyToClipboard(customUrl)"
                    class="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <NuxtIcon name="mdi:content-copy" size="0.9em" />
                  </button>
                </div>
              </div>
            </div>
          </div>
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
  contentProps: Record<string, any>
  styleProps: Record<string, any>
  contentKeys: string
}

useHead({
  title: 'IMGX - 预设编辑器',
  meta: [
    {
      name: 'description',
      content: '编辑和自定义 IMGX 预设'
    }
  ]
})

const config = useRuntimeConfig()
const route = useRoute()
const baseUrl = config.public.nodeEnv !== 'development' ? 'https://imgx.zzao.club' : 'http://localhost:4573'

const loading = ref(true)
const error = ref('')
const preset = ref<Preset | null>(null)
const contentPropsForm = ref<Record<string, any>>({})
const stylePropsForm = ref<Record<string, any>>({})
const customUrl = ref('')
const previewUrl = ref('')
const copied = ref(false)

// 获取预设详情
const fetchPreset = async () => {
  try {
    loading.value = true
    error.value = ''
    const code = route.params.code as string
    const res: any = await $fetch(`/api/presets/${code}`)
    preset.value = res.data
    
    // 初始化表单
    contentPropsForm.value = { ...preset.value.contentProps }
    stylePropsForm.value = { ...preset.value.styleProps }
    
    previewUrl.value = `${baseUrl}/api/${code}/default`
  } catch (err: any) {
    error.value = err.data?.message || '获取预设失败，请检查预设码是否正确'
    console.error('获取预设失败', err)
  } finally {
    loading.value = false
  }
}

// 生成预览 URL
const generatePreviewUrl = () => {
  if (!preset.value) return
  const code = preset.value.code
  
  // 构建 URL 路径 - 从 contentKeys 中提取内容参数
  const contentKeys = preset.value.contentKeys.split(',').map((k: string) => k.trim())
  const contentParts = contentKeys.map((key: string) => contentPropsForm.value[key] || preset.value!.contentProps[key] || '').filter((v: string) => v)
  
  const pathPart = contentParts.length > 0 ? `/${contentParts.join('/')}` : '/default'
  
  // 构建查询参数 - 从 styleProps 中提取样式参数
  const queryParams = new URLSearchParams()
  Object.entries(stylePropsForm.value).forEach(([key, value]) => {
    if (value !== preset.value!.styleProps[key]) {
      queryParams.append(key, String(value))
    }
  })
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  return `${baseUrl}/api/${code}${pathPart}${queryString}`
}

// 更新预览
const updatePreview = () => {
  previewUrl.value = generatePreviewUrl()
}

// 检查是否为颜色属性
const isColorProp = (key: string): boolean => {
  return key.toLowerCase().includes('color') || key.toLowerCase().includes('bg')
}

// 生成自定义 URL
const generateCustomUrl = () => {
  customUrl.value = generatePreviewUrl()
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败', err)
  }
}

// 生成 GET 请求示例
const getRequestExample = computed(() => {
  if (!preset.value) return ''
  return `GET ${generatePreviewUrl()}`
})

// 生成 POST 请求示例
const postRequestExample = computed(() => {
  if (!preset.value) return ''
  const payload = {
    ...contentPropsForm.value,
    ...stylePropsForm.value,
    format: 'png',
    download: false
  }
  return `POST ${baseUrl}/api/${preset.value.code}
Content-Type: application/json

${JSON.stringify(payload, null, 2)}`
})

// 生成 Markdown 嵌入示例
const markdownExample = computed(() => {
  if (!preset.value) return ''
  return `![${preset.value.name}](${generatePreviewUrl()})`
})

onMounted(() => {
  fetchPreset()
})
</script>

<style scoped>
/* 响应式布局 */
@media (max-width: 1024px) {
  .sticky {
    position: static !important;
  }
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

/* 平滑过渡 */
.transition-all {
  transition: all 0.3s ease;
}
</style>

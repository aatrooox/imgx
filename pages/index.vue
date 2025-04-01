<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl text-gray-900 font-bold">
              IMG<span class="text-blue-500">X</span>
            </h1>
          </div>
          <!-- 修改导航栏按钮颜色为浅色主题 -->
          <div class="flex items-center space-x-4">
            
            <Button variant="ghost" class="text-gray-700 hover:text-gray-900 hover:bg-gray-100" @click="navigateTo('/usage')">预设广场</Button>
            <Button variant="ghost" class="text-gray-700 hover:text-gray-900 hover:bg-gray-100" @click="navigateTo('/playground')">Playground</Button>
            <Button variant="ghost" class="text-gray-700 hover:text-gray-900 hover:bg-gray-100" @click="navigateTo('/template')">模板管理</Button>
            <a 
              href="https://github.com/2.0gnak/imgx-nuxt" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-gray-700 hover:text-gray-900"
            >
              <Icon name="mdi:github" class="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- 首屏区域 - 占满整个屏幕 -->
    <section class="h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <!-- 卡片式设计 -->
        <div class="space-y-8">
          <!-- 上方：API 展示 -->
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="p-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">API 示例</h3>
              <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre class="text-sm text-gray-100"><code>GET {baseUrl}/{presetCode}/{text1}/{text2}</code></pre>
              </div>
              <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span class="px-2 py-1 bg-gray-100 rounded">baseUrl: https://imgx.zzao.club</span>
                <span class="px-2 py-1 bg-gray-100 rounded">presetCode: 预设码</span>
                <span class="px-2 py-1 bg-gray-100 rounded">text: 文字内容</span>
              </div>
            </div>
          </div>

          <!-- 下方：预览卡片 -->
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-2xl mx-auto">
            <div class="p-8">
              <div class="flex flex-col items-center space-y-6">
                <div class="w-full">
                  <Input v-model="caseUrl" placeholder="请输入API"></Input>
                </div>
                <div class="relative rounded-xl overflow-hidden shadow-lg w-full min-h-[200px] bg-gray-100">
                  <img 
                    :src="downloadUrl"
                    alt="预览图"
                    class="w-full h-full object-contain transition-opacity duration-300"
                    :class="{ 'opacity-0': isLoadingImg, 'opacity-100': !isLoadingImg }"
                  />
                  <div v-if="isLoadingImg" class="absolute inset-0 flex items-center justify-center bg-white/70">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                </div>
                <div class="flex gap-4">
                  <Button size="lg" class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" @click="navigateTo('/usage')">
                    更多预设
                  </Button>
                  <Button size="lg" variant="outline" @click="downloadUrl = caseUrl">
                    点击生成
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
// 保留原有的脚本部分
import { getParsedBgColor, templates, type TemplateCode } from '@/lib/template';
import { sizes, type SizeCode } from '~/lib/sizes';
import { getParsedContent } from '../lib/content';
import { getSafeComponentProps } from '../lib/params';

useHead({
  title: 'IMGX@早早集市',
  meta: [
    {
      name: 'description',
      content: '一行代码生成封面图'
    }
  ]
})


// 保留原有的状态管理代码
const preset = ref<SizeCode>('001')
const template = ref<TemplateCode>('001')
const isFirstOnTop = ref(true)
const isLoadingImg = ref(false)
const isCenter = ref(false)
const isHighRatio = ref(false)
const baseUrl = process.env.NODE_ENV !== 'development' ? 'https://imgx.zzao.club' : 'http://localhost:4573'
// 强调色
const accentFontColor = ref('0088a9');

const customColor = ref<GradientColors>(['7a24d6', '88e524'])

const caseUrl = ref(`${baseUrl}/008/吾身所立，即是幽都/幽都/秦凤青?titleSize=60`)
const downloadUrl = ref('')


const ratio = computed(() => {
  return isHighRatio.value ? 2 : 1
})

watch([template, preset, ratio, customColor, accentFontColor, isCenter], () => {
  switchPerviewCard(true)
})

const switchPerviewCard = (flag?: boolean) => {
  isFirstOnTop.value = flag ?? !isFirstOnTop.value;
}

onMounted(() => {
  // reRandomBgColors();
  setTimeout(() => {
    // generateImage()
    downloadUrl.value = caseUrl.value
  }, 1000);
})

</script>
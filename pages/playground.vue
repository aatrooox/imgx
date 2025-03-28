<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">{{ `<DevOnly>Playground</DevOnly>` }}</h1>
        <p class="mt-2 text-sm text-gray-600">用于预览和复制模板，你可以按照注释信息随意修改 playground.vue 的代码</p>
        <p class="mt-2 text-sm text-red-600">
            注意1：每个 div 都需要显式声明 flex 布局，以适应 satori 的规范
        </p>
        <p class="mt-2 text-sm text-red-600">
            注意2：最外层 div 需设置为 w-full h-full，satori生成 svg时，会根据传入的宽高来设置图片大小
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center space-x-4 mb-8">
        <Button @click="copyTemplate" variant="outline" class="flex items-center">
          <NuxtIcon slot="icon" name="material-symbols:content-copy-outline" size="1.2em" class="mr-1" />
          复制 Template
        </Button>
        <Button @click="copyProps" variant="outline" class="flex items-center">
          <NuxtIcon slot="icon" name="material-symbols:content-copy-outline" size="1.2em" class="mr-1" />
          复制 Props
        </Button>
        <Button @click="navigateTo('/')" variant="outline" class="flex items-center">
          <NuxtIcon slot="icon" name="material-symbols:home-outline" size="1.2em" class="mr-1" />
          返回首页
        </Button>
        <Button 
          @click="navigateToTemplate" 
          variant="outline" 
          class="flex items-center"
        >
          <NuxtIcon slot="icon" name="material-symbols:add-circle-outline" size="1.2em" class="mr-1" />
          使用当前组件去新增模板
        </Button>
        <Button @click="navigateTo('/playground', { open: { target: '_blank'}  })" variant="outline">去新增模板</Button>
      </div>

      <!-- 预览区域 -->
      <div class="bg-white shadow rounded-lg p-6">
        <!-- 宽高输入框 -->
        <div class="flex space-x-4 mb-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">宽度:</label>
            <input 
              v-model="previewWidth" 
              type="number" 
              min="100"
              class="w-24 h-9 rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-500">px</span>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">高度:</label>
            <input 
              v-model="previewHeight" 
              type="number" 
              min="100"
              class="w-24 h-9 rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-500">px</span>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">锁定比例:</label>
            <input 
              v-model="maintainRatio" 
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">背景色:</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model="bgColor[0]" 
                type="color"
                class="w-9 h-9 rounded-md border border-gray-300 p-0 cursor-pointer"
              />
              <span class="text-sm text-gray-500">{{ bgColor[0] }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="bgColor[1]" 
                type="color"
                class="w-9 h-9 rounded-md border border-gray-300 p-0 cursor-pointer"
              />
              <span class="text-sm text-gray-500">{{ bgColor[1] }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">文字颜色:</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model="textColor" 
                type="color"
                class="w-9 h-9 rounded-md border border-gray-300 p-0 cursor-pointer"
              />
              <span class="text-sm text-gray-500">{{ textColor }}</span>
            </div>
          </div>
        </div>

        <!-- 颜色助手 -->
        <div class="flex space-x-4 mt-4">
          <div v-for="(colors, index) in adjacentColors" :key="'adjacent-' + index" class="flex flex-col">
            <div class="w-24 h-6 rounded-md cursor-pointer transition-transform hover:scale-105"
              :style="{ backgroundImage: `linear-gradient(to right, #${colors[0]}, #${colors[1]})` }"
              @click="applyColors(colors)">
            </div>
          </div>

          <div v-for="(colors, index) in complementaryColors" :key="'complementary-' + index" class="flex flex-col">
            <div class="w-24 h-6 rounded-md cursor-pointer transition-transform hover:scale-105"
              :style="{ backgroundImage: `linear-gradient(to right, #${colors[0]}, #${colors[1]})` }"
              @click="applyColors(colors)">
            </div>
          </div>

          <div v-for="(colors, index) in monochromaticColors" :key="'monochromatic-' + index" class="flex flex-col">
            <div class="w-24 h-6 rounded-md cursor-pointer transition-transform hover:scale-105"
              :style="{ backgroundImage: `linear-gradient(to right, #${colors[0]}, #${colors[1]})` }"
              @click="applyColors(colors)">
            </div>
          </div>

          <div v-for="(colors, index) in achromaticColors" :key="'achromatic-' + index" class="flex flex-col">
            <div class="w-24 h-6 rounded-md cursor-pointer transition-transform hover:scale-105"
              :style="{ backgroundImage: `linear-gradient(to right, #${colors[0]}, #${colors[1]})` }"
              @click="applyColors(colors)">
            </div>
          </div>
          <Button @click="refreshColors">刷新</Button>
        </div>
        
        <!-- TODO 下方的注释不要删除，否则会影响复制功能，请在以下两个注释之间添加需要调试的模板代码 -->
         <!-- 注意事项： 每个 div 都需要显式声明 flex 布局，以适应 satori 的规范 -->
        <div class="relative rounded-xl overflow-hidden shadow-lg" :style="{ width: `${previewWidth}px`, height: `${previewHeight}px` }">
          <!-- 以下是实际需要调试的内容 -->
          <div class="w-full h-full flex items-center justify-center transition-all duration-300"
            :style="{  backgroundImage: `linear-gradient(to right, ${bgColor[0]}, ${bgColor[1]})`, fontFamily: 'YouSheBiaoTiHei' }">
            <div class="flex w-full justify-center items-center text-[60px] font-bold" :style="{ color: textColor }">{{ title }}</div>
          </div>
          <!-- 以上是实际需要调试的内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, ref, computed, watch } from 'vue'
import { randomAdjacentGradientColors, randomComplementaryGradientColors, randomGradientColors } from '~/utils/color'

definePageMeta({
  middleware: (to, from) => {
    if (process.env.NODE_ENV !== 'development') {
     return abortNavigation('此页面仅在开发环境下使用')
    }
  }
})
// 检查是否在开发环境
// const config = useRuntimeConfig()
// if (process.env.NODE_ENV !== 'development') {
//   navigateTo('/')
// }

// 将所有属性集中在一个reactive对象中
// TODO 此对象服务于复制功能 必填
const propsObj = reactive({
  bgColor: ['#ffffff', '#2b2b2b'],
  title: 'Hello World',
  textColor: '#000000'
})

// 预览区域宽高设置
const previewWidth = ref(800)
const previewHeight = ref(400)
const maintainRatio = ref(true)
const initialAspectRatio = computed(() => previewWidth.value / previewHeight.value)
const fixedAspectRatio = ref(initialAspectRatio.value)

// 监听宽高变化，保持比例
watch(previewWidth, (newWidth) => {
  if (maintainRatio.value) {
    previewHeight.value = Math.round(newWidth / fixedAspectRatio.value)
  }
})

watch(previewHeight, (newHeight) => {
  if (maintainRatio.value) {
    previewWidth.value = Math.round(newHeight * fixedAspectRatio.value)
  }
})

// 监听锁定状态变化
watch(maintainRatio, (newVal) => {
  if (newVal) {
    // 重新锁定时，使用当前的宽高比
    fixedAspectRatio.value = previewWidth.value / previewHeight.value
  }
})

// 使用toRefs将reactive对象的属性转换为独立的refs
// TODO 此解构操作也服务于复制功能 必填
const {
    bgColor,
    title,
    textColor
} = toRefs(propsObj)

// 获取模板内容
const getTemplateContent = async () => {
  try {
    const response: any = await $fetch('/api/playground/copy', {
      method: 'POST',
      body: {
        action: 'template'
      }
    })
    
    if (response.success && response.data) {
      return response.data
    } else {
      throw new Error(response.error || '无法提取模板代码')
    }
  } catch (error) {
    console.error('获取模板内容失败:', error)
    throw error
  }
}

// 复制模板内容
const copyTemplate = async () => {
  try {
    const templateContent = await getTemplateContent()
    await navigator.clipboard.writeText(templateContent)
    alert('模板内容已复制到剪贴板')
  } catch (error) {
    alert('复制模板失败，请查看控制台')
  }
}

// 跳转到模板页面
const navigateToTemplate = async () => {
  try {
    const templateContent = await getTemplateContent()
    // 使用 useState 存储数据
    const templateState = useState('templateData', () => ({
      template: templateContent,
      props: JSON.stringify(propsObj, null, 2),
      width: previewWidth.value,
      height: previewHeight.value
    }))
    // 跳转到模板页面，并添加edit参数
    await navigateTo('/template?edit=true')
  } catch (error) {
    console.error('跳转失败:', error)
    alert('跳转失败，请查看控制台')
  }
}

// 复制 Props 内容
const copyProps = async () => {
  await navigator.clipboard.writeText(JSON.stringify(propsObj, null, 2))
  alert('Props 内容已复制到剪贴板')
}

// 颜色助手相关
const showColorHelper = ref(false)

// 生成各种风格的颜色
const adjacentColors = ref(randomGradientColors('adjacent', 2, 'light'))
const complementaryColors = ref(randomGradientColors('complementary', 2, 'light'))
const monochromaticColors = ref(randomGradientColors('monochromatic', 2, 'light'))
const achromaticColors = ref(randomGradientColors('adjacent', 2, 'pure'))

console.log(adjacentColors.value)
// 应用颜色
const applyColors = (colors: [string, string]) => {
  bgColor.value = [`#${colors[0]}`, `#${colors[1]}`]
}

// 定期刷新颜色选项
const refreshColors = () => {
  adjacentColors.value = randomGradientColors('adjacent', 2, 'light')
  complementaryColors.value = randomGradientColors('complementary', 2, 'light')
  monochromaticColors.value = randomGradientColors('monochromatic', 2, 'light')
  achromaticColors.value = randomGradientColors('adjacent', 2, 'pure')
}

</script> 
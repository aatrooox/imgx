<script lang="ts" setup>
import { renderToString } from 'vue/server-renderer'
import type { AllowedComponentProps, VNodeProps } from 'vue'
import { createSSRApp, h } from 'vue'
import type { SchemaItem } from '~/components/SchemaEditor.vue'

interface Template {
  id: string
  name: string
  propsSchema: SchemaItem[]
  width?: number
  height?: number
}

interface PresetProps {
  [key: string]: any
}

interface PreviewResponse {
  data: string
}

const templateId = ref('')
const templateOptions = ref<Template[]>([])
const presetProps = reactive<PresetProps>({})
const presetName = ref('')
const presetDesc = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const scale = ref(1)

// 添加尺寸相关的状态
const width = ref(0)
const height = ref(0)
const isLocked = ref(true)
const initialAspectRatio = ref(1)

// 添加本地schema状态
const localSchema = ref<SchemaItem[]>([])

const curTemplate = computed(() => {
  const template = templateOptions.value.find(item => item.id === templateId.value)
  const schema = template?.propsSchema ?? []

  // 更新本地schema
  if (schema.length > 0 && localSchema.value.length === 0) {
    localSchema.value = JSON.parse(JSON.stringify(schema))
  }

  schema.forEach(item => {
      if (item.isMultiple) {
        if (item.separator) {
          presetProps[item.key] = item.values?.concat(item.default).join(item.separator)
        } else {
          presetProps[item.key] = item.values?.concat(item.default)
        }
      } else {
        presetProps[item.key] = item.default
    }
    
  })
  return template
})

const propsSchema = computed(() => {
  return curTemplate.value?.propsSchema ?? []
})

// 监听 localSchema 变化，更新 presetProps
watch(localSchema, (newSchema) => {
  if (newSchema.length > 0) {
    newSchema.forEach(item => {
      if (item.key in presetProps) {
        if (item.isMultiple) {
            if (item.separator) {
              presetProps[item.key] = item.values?.concat(item.default).join(item.separator)
            } else {
              presetProps[item.key] = item.values?.concat(item.default)
            }
          } else {
            presetProps[item.key] = item.default
          }
      }
    })
  }
}, { deep: true })

const previewHtml = ref()
const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'size': defineAsyncComponent(() => import('~/components/preset/Size.vue')),
  'content': defineAsyncComponent(() => import('~/components/preset/Content.vue')),
  'color': defineAsyncComponent(() => import('~/components/preset/Color.vue')),
  'default': defineAsyncComponent(() => import('~/components/preset/Content.vue')),
}

// 监听模板变化，初始化尺寸
watch(curTemplate, (template) => {
  if (template) {
    width.value = template.width || 600
    height.value = template.height || 400
    initialAspectRatio.value = width.value / height.value
  }
})

// 更新尺寸的方法
const updateDimensions = (newWidth: number) => {
  width.value = newWidth
  if (isLocked.value) {
    // 按比例更新高度
    height.value = Math.round(newWidth / initialAspectRatio.value)
  }
}

const updateHeight = (newHeight: number) => {
  height.value = newHeight
  if (isLocked.value) {
    // 按比例更新宽度
    width.value = Math.round(newHeight * initialAspectRatio.value)
  }
}

// 计算宽高比
const aspectRatio = computed(() => {
  return width.value / height.value
})

const createPreset = async () => {
  if (!presetName.value) {
    errorMessage.value = '请输入预设名称'
    return
  }

  if (!curTemplate.value) {
    errorMessage.value = '请选择一个模板'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const params = {
      name: presetName.value,
      width: width.value,
      height: height.value,
      description: presetDesc.value,
      userId: localStorage.getItem('userId') || '',
      templateId: curTemplate.value.id
    }

    const keys = Object.keys(presetProps);

    const contentProps: { [key: string]: any } = {}
    const styleProps: { [key: string]: any } = {}
    // 获取schema
    const schema = curTemplate.value.propsSchema;

    for (const key of keys) {
      const item = schema.find(item => item.key === key);
      if (!item) continue;

      if (item.type === 'content') {
        contentProps[key] = presetProps[key];
      } else {
        styleProps[key] = presetProps[key];
      }
    }

    const res = await $fetch('/api/v1/preset/create', {
      method: 'POST',
      body: {
        ...params,
        contentProps,
        styleProps
      },
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      },
    })

    successMessage.value = '预设创建成功'
    console.log(`创建预设成功`, res)
  } catch (error) {
    errorMessage.value = '创建预设失败，请稍后再试'
    console.error('创建预设失败', error)
  } finally {
    isLoading.value = false
  }
}

const getTemplates = async () => {
  isLoading.value = true
  try {
    const res: any = await $fetch('/api/v1/template/list', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      },
    })

    templateOptions.value = res.data
  } catch (error) {
    errorMessage.value = '获取模板列表失败'
    console.error('获取模板列表失败', error)
  } finally {
    isLoading.value = false
  }
}

const genPreview = async () => {
  if (!curTemplate.value) {
    errorMessage.value = '请先选择一个模板'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch<PreviewResponse>('/api/v1/preset/preview', {
      method: 'POST',
      body: {
        id: curTemplate.value.id,
        props: presetProps,
        width: width.value,
        height: height.value
      },
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      },
    })

    previewHtml.value = res.data
  } catch (error) {
    errorMessage.value = '生成预览失败，请稍后再试'
    console.error('生成预览失败', error)
  } finally {
    isLoading.value = false
  }
}

watch(presetProps, (val) => {
  console.log(`val`, val)
})

onMounted(() => {
  getTemplates()
})

const previewDimensions = computed(() => {
  const baseWidth = curTemplate.value?.width || 600
  const baseHeight = curTemplate.value?.height || 400
  return {
    width: baseWidth * scale.value,
    height: baseHeight * scale.value
  }
})

const adjustScale = (newScale: number) => {
  scale.value = Math.max(0.5, Math.min(2, newScale))
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">预设管理</h1>
          <p class="mt-2 text-sm text-gray-600">创建和管理您的图像预设</p>
        </div>
        <Button @click="navigateTo('/template')" variant="outline" class="flex items-center gap-2">
          <span class="i-heroicons-arrow-left-circle h-5 w-5"></span>
          返回模板市场
        </Button>
      </div>

      <!-- 消息提示 -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <div v-if="successMessage" class="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
        <p class="text-sm text-green-600">{{ successMessage }}</p>
      </div>

      <!-- 主要内容区域 -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- 模板选择 -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">选择模板</h2>
          <Select v-model="templateId" class="w-full max-w-md">
            <SelectTrigger>
              <SelectValue placeholder="选择一个模板" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="option in templateOptions" :value="option.id">
                  {{ option.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div v-if="curTemplate" class="grid grid-cols-1 gap-6">
          <!-- 预览区域 -->
          <div class="p-6 bg-white border-b border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">预览效果</h2>
              <Button @click="genPreview" variant="outline" :disabled="isLoading || !curTemplate">
                {{ isLoading ? '生成中...' : '生成预览' }}
              </Button>
            </div>

            <div class="flex justify-center items-center min-h-[500px] bg-gray-50 rounded-lg p-8" v-if="previewHtml">
              <div class="flex flex-col items-center gap-4">
                <img v-if="previewHtml" :src="`data:image/svg+xml;charset=utf-8,${encodeURIComponent(previewHtml)}`"
                  :style="{
                    width: previewDimensions.width + 'px',
                    height: previewDimensions.height + 'px',
                  }" class="max-w-full object-contain shadow-lg" alt="预览图" />
                <div class="flex items-center gap-4">
                  <Button variant="outline" size="sm" @click="adjustScale(scale - 0.1)">
                    <span class="i-heroicons-minus-circle h-4 w-4"></span>
                  </Button>
                  <span class="text-sm text-gray-600">{{ Math.round(scale * 100) }}%</span>
                  <Button variant="outline" size="sm" @click="adjustScale(scale + 0.1)">
                    <span class="i-heroicons-plus-circle h-4 w-4"></span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- 编辑区域 -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <!-- 原有的属性编辑器和保存区域代码 -->
            <div class="p-6 border-r border-gray-200 lg:col-span-2">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">属性编辑器</h2>

              <!-- 添加尺寸调整部分 -->
              <div class="bg-gray-50 p-4 rounded-md mb-6">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="font-medium text-gray-900">尺寸设置</h3>
                    <p class="text-sm text-gray-500">调整预设的宽度和高度</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex items-center gap-2">
                    <div 
                      class="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                      @click="isLocked = !isLocked"
                    >
                      <NuxtIcon 
                        :name="isLocked ? 'material-symbols:lock' : 'material-symbols:lock-open'" 
                        size="1.4em"
                        :class="isLocked ? 'text-blue-500' : 'text-gray-500'"
                      />
                    </div>
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">宽度</label>
                      <Input 
                        type="number" 
                        v-model="width" 
                        @input="updateDimensions(Number($event.target.value))"
                        min="100" 
                        max="2000" 
                        step="10" 
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">高度</label>
                    <Input 
                      type="number" 
                      v-model="height" 
                      @input="updateHeight(Number($event.target.value))" 
                      min="100"
                      max="2000" 
                      step="10" 
                    />
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <SchemaEditor v-model="localSchema" :readonly="true" />
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">预设名称</label>
                <Input v-model="presetName" placeholder="请输入预设名称" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">预设描述</label>
                <Input v-model="presetDesc" placeholder="请输入预设描述（可选）" />
              </div>

              <Button @click="createPreset" class="w-full" :disabled="isLoading || !presetName || !curTemplate">
                {{ isLoading ? '保存中...' : '保存此预设' }}
              </Button>
            </div>
          </div>
        </div>

        <!-- 未选择模板时的提示 -->
        <div v-if="!curTemplate && templateOptions.length > 0" class="p-12 text-center">
          <div class="text-gray-400 mb-4">
            <span class="i-heroicons-document-text h-12 w-12 mx-auto"></span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">请选择一个模板</h3>
          <p class="text-gray-500">从上方下拉菜单中选择一个模板来开始创建预设</p>
        </div>

        <!-- 加载中或无模板时的提示 -->
        <div v-if="isLoading && templateOptions.length === 0" class="p-12 text-center">
          <div class="animate-spin text-gray-400 mb-4">
            <span class="i-heroicons-arrow-path h-12 w-12 mx-auto"></span>
          </div>
          <h3 class="text-lg font-medium text-gray-900">正在加载模板...</h3>
        </div>

        <div v-if="!isLoading && templateOptions.length === 0" class="p-12 text-center">
          <div class="text-gray-400 mb-4">
            <span class="i-heroicons-exclamation-circle h-12 w-12 mx-auto"></span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无可用模板</h3>
          <p class="text-gray-500 mb-4">请先创建模板或联系管理员</p>
          <Button @click="navigateTo('/template')" variant="outline">
            前往创建模板
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可能需要的额外样式 */
</style>
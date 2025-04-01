<script setup lang="ts">
import { defineAsyncComponent, computed, onMounted, watch } from 'vue'

export interface SchemaItem {
  key: string
  name: string
  type: string
  default: any
  description?: string
  required?: boolean
  values?: string[] // 用于存储多值
  separator?: string // 分隔符
  isMultiple?: boolean // 是否支持多值
  sort?: number // 添加排序字段
}

const props = defineProps<{
  modelValue: SchemaItem[]
  readonly?: boolean // 添加 readonly 属性
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SchemaItem[]]
}>()

// 初始化排序值
onMounted(() => {
  initializeSortValues()
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  // 如果有新的 content 类型项目没有排序值，需要初始化
  const contentItemsWithoutSort = newValue.some((item, index) => 
    item.type === 'content' && item.sort === undefined
  )
  
  if (contentItemsWithoutSort) {
    initializeSortValues()
  }
}, { deep: true })

// 初始化排序值的方法
const initializeSortValues = () => {
  const newItems = [...props.modelValue]
  let hasChanges = false
  
  newItems.forEach((item, index) => {
    if (item.type === 'content' && item.sort === undefined) {
      item.sort = index
      hasChanges = true
    }
  })
  
  if (hasChanges) {
    emit('update:modelValue', newItems)
  }
}

const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'size': defineAsyncComponent(() => import('~/components/preset/Size.vue')),
  'content': defineAsyncComponent(() => import('~/components/preset/Content.vue')),
  'color': defineAsyncComponent(() => import('~/components/preset/Color.vue')),
  'image': defineAsyncComponent(() => import('~/components/preset/Content.vue')),
  'default': defineAsyncComponent(() => import('~/components/preset/Content.vue')),
}



// 更新 schema 项
const updateSchemaItem = (index: number, field: keyof SchemaItem, value: any) => {
  const newItems = [...props.modelValue]
  
  // 特殊处理类型变更
  if (field === 'type') {
    if (value === 'content' && !newItems[index].sort) {
      // 如果变为 content 类型且没有排序值，设置默认排序值
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        sort: index
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      }
    }
  } else {
    // 普通字段更新
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
  }
  
  emit('update:modelValue', newItems)
}

// 添加多值
const addValue = (index: number) => {
  const newItems = [...props.modelValue]
  if (!newItems[index].values) {
    newItems[index].values = []
  }
  newItems[index].values?.push(newItems[index].default)
  emit('update:modelValue', newItems)
}

// 删除多值
const removeValue = (itemIndex: number, valueIndex: number) => {
  const newItems = [...props.modelValue]
  newItems[itemIndex].values?.splice(valueIndex, 1)
  emit('update:modelValue', newItems)
}

// 更新多值
const updateValue = (itemIndex: number, valueIndex: number, value: string) => {
  const newItems = [...props.modelValue]
  if (!newItems[itemIndex].values) {
    newItems[itemIndex].values = []
  }
  newItems[itemIndex].values![valueIndex] = value
  emit('update:modelValue', newItems)
}


// 校验 sort 值是否有重复
const validateSorts = computed(() => {
  const contentItems = props.modelValue.filter(item => item.type === 'content')
  const sortValues = contentItems.map(item => item.sort ?? 0)
  
  // 找出所有重复的排序值
  const duplicateSorts = sortValues.filter((value, index, self) => 
    self.indexOf(value) !== index
  )
  
  // 找出具有重复排序值的项的索引
  const duplicateIndices: number[] = []
  
  props.modelValue.forEach((item, index) => {
    if (item.type === 'content' && duplicateSorts.includes(item.sort ?? 0)) {
      duplicateIndices.push(index)
    }
  })
  
  return duplicateIndices
})

// 更新排序值
const updateSort = (index: number, value: number) => {
  updateSchemaItem(index, 'sort', value)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-between items-center mb-2">
      <label class="block text-sm font-medium text-gray-700">Schema 配置</label>
    </div>
    
    <div class="space-y-3">
      <div v-for="(item, index) in modelValue" :key="index" class="bg-gray-50 p-4 rounded-md">
        <!-- 顶部：属性键和操作按钮 -->
        <div class="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500">属性键：</span>
            <code class="text-xs bg-gray-100 px-2 py-0.5 rounded">{{ item.key }}</code>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <Switch
                :checked="item.required"
                @update:checked="(val) => updateSchemaItem(index, 'required', val)"
                :disabled="readonly"
              />
              <span class="text-xs text-gray-600">必填</span>
            </div>
            <div class="flex items-center space-x-2" v-if="item.type !== 'image'">
              <Switch
                :checked="item.isMultiple"
                @update:checked="(val) => updateSchemaItem(index, 'isMultiple', val)"
                :disabled="readonly"
              />
              <span class="text-xs text-gray-600">多值</span>
            </div>
            
          </div>
        </div>

        <!-- 主要属性：名称、类型、描述在一行 -->
        <div class="grid grid-cols-12 gap-3 mb-3">
          <div class="col-span-4">
            <Input 
              v-model="item.name" 
              placeholder="属性名称" 
              class="h-8 w-full"
              :disabled="readonly"
            />
          </div>
          <div class="col-span-3">
            <Select 
              v-model="item.type" 
              class="h-8"
              :disabled="readonly"
            >
              <SelectTrigger class="h-8">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="content">内容</SelectItem>
                <SelectItem value="size">尺寸</SelectItem>
                <SelectItem value="color">颜色</SelectItem>
                <SelectItem value="image">图片</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="col-span-5">
            <Input 
              v-model="item.description" 
              placeholder="属性描述（可选）" 
              class="h-8 w-full text-xs"
              :disabled="readonly"
            />
          </div>
        </div>

        <!-- 排序字段（仅对 content 类型显示） -->
        <div class="mb-3" v-if="item.type === 'content'">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-700">排序值</label>
              <Input
                :value="item.sort"
                @input="(e: Event) => updateSchemaItem(index, 'sort', parseInt((e.target as HTMLInputElement).value))"
                type="number"
                :disabled="readonly" 
                class="h-8 w-20 text-xs"
                :class="{ 'border-red-500': validateSorts.includes(index) }"
              />
            </div>
            <div v-if="validateSorts.includes(index)" class="text-xs text-red-500">
              排序值重复，请修改
            </div>
          </div>
        </div>

        <!-- 默认值和多值设置 -->
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="flex items-center space-x-2 shrink-0" v-if="item.isMultiple">
              <label class="text-xs font-medium text-gray-700">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <div class="relative flex items-center">
                        分隔符
                        <NuxtIcon name="material-symbols:info-outline" size="1.2em" class="ml-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>有分隔符意味着按字符串传值，没分隔符会按数组传值</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </label>
              <Input 
                v-model="item.separator" 
                placeholder="分隔符" 
                class="h-7 w-16 text-xs"
                :disabled="readonly"
              />
            </div>
            <div class="flex items-center space-x-2 shrink-0">
              <label class="text-xs font-medium text-gray-700">默认值</label>
              <component 
                :is="componentMap[item.type] || componentMap['default']" 
                v-model="item.default"
              />
            </div>

            <!-- 多值设置 -->
            <template v-if="item.isMultiple">
              <div class="flex items-center gap-2 overflow-x-auto py-1">
                <div 
                  v-for="(value, valueIndex) in item.values" 
                  :key="valueIndex" 
                  class="flex items-center gap-1 bg-white rounded p-1.5 shrink-0"
                >
                  <component 
                    :is="componentMap[item.type]" 
                    v-model="item.values![valueIndex]"
                  />
                  <div 
                    v-if="!readonly"
                    class="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                    @click="removeValue(index, valueIndex)"
                  >
                    <NuxtIcon name="material-symbols:delete-outline" size="1.4em" />
                  </div>
                </div>
              </div>
              <div 
                class="flex items-center justify-center h-8 px-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                @click="addValue(index)"
              >
                <NuxtIcon name="material-symbols:add-circle-outline" size="1.2em" class="mr-1" />
                添加值
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 
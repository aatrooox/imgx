<script setup lang="ts">
import type { SchemaItem } from '~/components/SchemaEditor.vue'

const templateStr = ref('')
const props = ref('')
const username = ref()
const templateName = ref('模板名称')
const password = ref()
const schema = ref<SchemaItem[]>([])
const width = ref(0)
const height = ref(0)

// 添加模板列表相关状态
const templates = ref<any[]>([])
const isEditing = ref(false) // 控制是否显示编辑器
const isCreateMode = ref(true) // 控制是新增还是编辑模式
const currentTemplateId = ref('')

// 登录相关状态
const isLoggedIn = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 获取模板列表
const getTemplates = async () => {
  isLoading.value = true
  try {
    const res: any = await $fetch('/api/v1/template/list', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      },
    })
    templates.value = res.data
  } catch (error) {
    errorMessage.value = '获取模板列表失败'
    console.error('获取模板列表失败', error)
  } finally {
    isLoading.value = false
  }
}

// 编辑模板
const editTemplate = (template: any) => {
  isEditing.value = true
  isCreateMode.value = false
  currentTemplateId.value = template.id
  templateName.value = template.name
  templateStr.value = template.template
  props.value = JSON.stringify(template.props, null, 2)
  schema.value = template.propsSchema
  width.value = template.width
  height.value = template.height
}

// 新建模板
const createNewTemplate = () => {
  isEditing.value = true
  isCreateMode.value = true
  currentTemplateId.value = ''
  templateName.value = '模板名称'
  templateStr.value = ''
  props.value = ''
  schema.value = []
  width.value = 0
  height.value = 0
}

// 重置表单
const resetForm = () => {
  isEditing.value = false
  isCreateMode.value = true
  currentTemplateId.value = ''
  templateName.value = '模板名称'
  templateStr.value = ''
  props.value = ''
  schema.value = []
  width.value = 0
  height.value = 0
}

// 检查是否已登录
onMounted(() => {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  if (token && userId) {
    isLoggedIn.value = true
    getTemplates()
  }
})

watch(schema, (newVal) => {
  console.log(`schema`, newVal)
})

const login = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const res: any = await $fetch('/api/v1/user/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      },
    })

    const token = res.data.token
    const userId = res.data.user.id
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    console.log(`登录`, res)
    isLoggedIn.value = true
    getTemplates()
  } catch (error) {
    errorMessage.value = '登录失败，请检查用户名和密码'
    console.error('登录失败', error)
  } finally {
    isLoading.value = false
  }
}

const regist = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const res = await $fetch('/api/v1/user/regist', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      },
    })

    console.log(`注册`, res)
    errorMessage.value = '注册成功，请登录'
  } catch (error) {
    errorMessage.value = '注册失败，请稍后再试'
    console.error('注册失败', error)
  } finally {
    isLoading.value = false
  }
}

const createTemplate = async () => {
  if (!templateStr.value || !props.value || !schema.value) {
    errorMessage.value = '请填写完整的模板信息'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  
  let propsObj
  try {
    const jsonStr = props.value
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
      .replace(/'/g, '"')
    
    propsObj = JSON.parse(jsonStr)
  } catch (e) {
    errorMessage.value = 'Props 格式错误，请检查'
    console.error(`转换失败`, e)
    isLoading.value = false
    return 
  }

  const contents = schema.value.filter(item => item.type === 'content');
  const contentKeys = contents.sort((a, b) => (a.sort || 0) - (b.sort || 0)).map(item => item.key);
  
  try {
    const url = isCreateMode.value ? '/api/v1/template/create' : '/api/v1/template/update'
    const method = 'POST'
    
    const res = await $fetch(url, {
      method,
      body: {
        id: currentTemplateId.value,
        name: templateName.value,
        width: width.value,
        height: height.value,
        template: templateStr.value,
        props: propsObj,
        propsSchema: schema.value,
        contentKeys: contentKeys,
        userId: localStorage.getItem('userId') || ''
      },
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      },
    })

    console.log(`保存模板`, res)
    successMessage.value = isCreateMode.value ? '模板创建成功' : '模板更新成功'
    errorMessage.value = ''
    
    // 重置表单并刷新列表
    resetForm()
    getTemplates()
  } catch (error) {
    errorMessage.value = isCreateMode.value ? '创建模板失败，请稍后再试' : '更新模板失败，请稍后再试'
    console.error('保存模板失败', error)
  } finally {
    isLoading.value = false
  }
}

const generateSchema = async () => {
  if (!templateStr.value) {
    errorMessage.value = '请先输入模板内容'
    return
  }
  
  let propsObj
  try {
    const jsonStr = props.value
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // 处理键名
      .replace(/'/g, '"') // 将单引号替换为双引号
    
    propsObj = JSON.parse(jsonStr)
  } catch (e) {
    errorMessage.value = 'Props 格式错误，请检查'
    console.error(`转换失败`, e)
    isLoading.value = false
    return 
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const res:any = await $fetch('/api/v1/template/schema/gen', {
      method: 'POST',
      body: {
        props: propsObj,
      },
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      },
    })

    // 将返回的 schema 数据转换为我们需要的格式
    schema.value = res.data.map((item: any) => ({
      ...item,
      key: item.key || '',
      name: item.name || item.key || '',
      type: item.type || 'content',
      default: item.default || '',
      required: item.required || true,
      description: item.description || '',
      values: item.values || [],
      separator: item.separator || ''
    }))
    
    successMessage.value = 'Schema 生成成功'
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = '生成失败，请检查模板内容'
    console.error('生成失败', error)
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  isLoggedIn.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">模板管理系统</h1>
        <p class="mt-2 text-sm text-gray-600">创建和管理您的图像模板</p>
      </div>
      
      <!-- 消息提示 -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>
      
      <div v-if="successMessage" class="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
        <p class="text-sm text-green-600">{{ successMessage }}</p>
      </div>

      <!-- 登录/注册表单 -->
      <div v-if="!isLoggedIn" class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">用户登录</h2>
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
            <Input 
              id="username"
              v-model="username" 
              placeholder="请输入用户名" 
              class="mt-1 w-full"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <Input 
              id="password"
              v-model="password" 
              placeholder="请输入密码" 
              type="password"
              class="mt-1 w-full"
            />
          </div>
          <div class="flex space-x-4">
            <Button 
              @click="login" 
              :disabled="isLoading"
              class="flex-1"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </Button>
            <Button 
              @click="regist" 
              :disabled="isLoading"
              variant="outline"
              class="flex-1"
            >
              {{ isLoading ? '注册中...' : '注册' }}
            </Button>
          </div>
        </div>
      </div>
      
      <!-- 模板创建表单 -->
      <div v-if="isLoggedIn" class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">{{ isCreateMode ? '创建新模板' : '编辑模板' }}</h2>
          <div class="flex space-x-4">
            <Button @click="navigateTo('/preset')" variant="outline">新增预设</Button>
            <Button @click="logout" variant="destructive">退出登录</Button>
          </div>
        </div>

        <!-- 模板列表 -->
        <div v-if="!isEditing" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">模板列表</h3>
            <Button @click="createNewTemplate" variant="outline" size="sm">
              <NuxtIcon slot="icon" name="material-symbols:add-circle-outline" size="1.2em" class="mr-1" />
              新建模板
            </Button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="template in templates" 
              :key="template.id"
              class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              @click="editTemplate(template)"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ template.name }}</h4>
                <span class="text-xs text-gray-500">{{ template.width }}x{{ template.height }}</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ template.description || '暂无描述' }}</p>
            </div>
          </div>
        </div>

        <!-- 编辑表单 -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 左侧：模板内容和属性 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">模板名称</label>
                <Input v-model="templateName" placeholder="请输入模板名称" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">模板内容 (HTML/Vue)</label>
                <Textarea 
                  v-model="templateStr" 
                  placeholder="输入模板 HTML 内容" 
                  class="min-h-[200px]"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Props 数据 (JSON)</label>
                <Textarea 
                  v-model="props" 
                  placeholder="输入 props 数据，例如: { color: '#ff0000', text: '示例文本' }" 
                  class="min-h-[150px]"
                />
              </div>
            </div>
            
            <!-- 右侧：尺寸和操作按钮 -->
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">宽度 (px)</label>
                  <PresetSize v-model="width" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">高度 (px)</label>
                  <PresetSize v-model="height" />
                </div>
              </div>
              
              <div class="flex flex-col space-y-3 pt-4">
                <Button 
                  @click="generateSchema" 
                  :disabled="isLoading || !templateStr"
                  variant="outline"
                >
                  {{ isLoading ? '生成中...' : '生成 Schema' }}
                </Button>
                
                <div class="flex space-x-3">
                  <Button 
                    @click="resetForm" 
                    variant="outline"
                    class="flex-1"
                  >
                    取消
                  </Button>
                  <Button 
                    @click="createTemplate" 
                    :disabled="isLoading || !templateStr || !props || !schema"
                    class="flex-1"
                  >
                    {{ isLoading ? '保存中...' : '保存模板' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Schema 编辑器 -->
          <div v-if="schema && schema.length > 0" class="mt-8 border-t border-gray-200 pt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Schema 配置</h3>
              <Button 
                @click="generateSchema" 
                variant="outline"
                size="sm"
              >
                <span class="i-heroicons-arrow-path h-4 w-4 mr-1"></span>
                重新生成
              </Button>
            </div>
            <SchemaEditor v-model="schema" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
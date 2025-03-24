<script lang="ts" setup>
import { renderToString } from 'vue/server-renderer'
import type { AllowedComponentProps, VNodeProps } from 'vue'
import { createSSRApp, h } from 'vue'

const templateId = ref('')
const templateOptions = ref([])
const presetProps = reactive({})
const presetName = ref('')
const presetDesc = ref('')
const curTemplate = computed(() => {
  const template = templateOptions.value.find(item => item.id === templateId.value)
  const schema = template?.propsSchema ?? []
  schema.forEach( item => {
    presetProps[item.key] = presetProps[item.key] ?? item.default
  })
  return template
})

const propsSchema = computed(() => {
  return curTemplate.value?.propsSchema ?? []
})

const previewHtml = ref()
const componentMap = {
  'size': defineAsyncComponent(() => import('~/components/preset/Size.vue')),
  'content': defineAsyncComponent(() => import('~/components/preset/Content.vue')),
  'color': defineAsyncComponent(() => import('~/components/preset/Color.vue')),
  'default': defineAsyncComponent(() => import('~/components/preset/Content.vue')),
}

const getPreviewHtml = async (template, props) => {
  try {
     // 创建一个简单的组件，使用传入的模板和props
     const component = {
      template,
      props: Object.keys(props),
      setup() {
        return props;
      }
    };

    // 创建 Vue 应用 （Vue实例）
    const app = createSSRApp(component, props);
    // 渲染为 HTML 字符串
    const html = await renderToString(app);

    return html
  } catch (err) {
    console.error(err)
    return ''
  }
}

const createPreset = async () => {
  const params = {
    name: presetName.value,
    description: presetDesc.value,
    userId: localStorage.getItem('userId') || '',
    templateId: curTemplate?.value.id
  }

  const keys = Object.keys(presetProps);

  const contentProps = {}
  const styleProps = {}
  // 获取schema
  const schema = curTemplate?.value.propsSchema;

  for (const key of keys) {
    const item = schema.find( item => item.key === key);
    if (item.type === 'content') {
      contentProps[key] = presetProps[key];
    } else {
      styleProps[key] = presetProps[key];
    }
  }

  console.log(`params`, {
    ...params, contentProps, styleProps
  })

}
const getTemplates = async () => {
  const res:any = await $fetch('/api/v1/template/list', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    },
  })

  templateOptions.value = res.data

  
}

const genPreview = async () => {
  const res = await $fetch('/api/v1/preset/preview', {
    method: 'POST',
    body: {
      id: curTemplate.value.id,
      props: presetProps
    },
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    },
  })

  previewHtml.value = res.data
}
watch(presetProps, (val) => {
  console.log(`val`, val)
})

onMounted(() => {
  getTemplates()
})
</script>
<template>
  <div class="p-8"> 
    <Button @click="navigateTo('/template')">模板市场</Button>
    <Select v-model="templateId">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="选择一个模板" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <!-- <SelectLabel>预设</SelectLabel> -->
            <SelectItem v-for="option in templateOptions" :value="option.id">
              {{ option.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    {{ propsSchema }}

    <div class="w-full text-xl font-bold">Schema编辑器</div>

    <template v-for="config in propsSchema">
      <div>
        <div>{{ config.name }}[{{ config.key }}] <span class="text-zinc-600 text-sm">{{  config.description  }}</span></div>
        <component :is="componentMap[config.type] || componentMap['default']" v-model="presetProps[config.key]"></component>
      </div>
    </template>

    <Button @click="genPreview">预览</Button>
    <div :style="{
      width: curTemplate?.width + 'px',
      height: curTemplate?.height + 'px',
    }">
      <div class="w-full h-full" v-html="previewHtml"></div>
    </div>

    <Input v-model="presetName"></Input>
    <Input v-model="presetDesc"></Input>
    <Button @click="createPreset">保存此预设</Button>
    <!-- <PresetTextarea></PresetTextarea>
    <PresetColor></PresetColor>
    <PresetSize></PresetSize> -->
  </div>
</template>
<style scoped>
</style>
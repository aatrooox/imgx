<template>
  <div
    class="flex flex-col gap-4 pt-1 items-center h-screen w-full overflow-y-auto transition-all duration-300 ease-in-out px-8">
    <div class="title flex justify-center items-end mt-8">
      <SparklesText text="IMG X" :colors="{ first: '#9E7AFF', second: '#FE8BBB' }" :sparkles-count="10" class="" />
      <em class="ml-2 text-zinc-400">v{{ config.public.appVersion }}</em>
    </div>
    <div class="options flex gap-4 w-full max-w-xl">
      <!-- 预设选择 -->
      <Select v-model="preset">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="选择一个预设" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <!-- <SelectLabel>预设</SelectLabel> -->
            <SelectItem value="001">
              1200x630
            </SelectItem>
            <SelectItem value="002">
              500x500
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select v-model="template">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="选择一个模板" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <!-- <SelectLabel>预设</SelectLabel> -->
            <SelectItem v-for="option in templateOptions" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <InteractiveHoverButton class="w-36" text="切换" @click="switchPerviewCard(!isFirstOnTop)" />
      <InteractiveHoverButton class="w-36" text="生成图片" @click="generateImage" />

    </div>

    <div class="w-full flex justify-center">
      <IInput placeholder="输入内容" container-class="w-full max-w-xl" class="h-12" v-model="text"></IInput>
    </div>

    <div>
    </div>
    <div class="toggle-box relative w-full max-w-xl">
      <div class="img-preview w-full max-w-xl absolute transition-all duration-500" v-if="generateUrl"
        :class="{ 'z-10': !isFirstOnTop, 'delay-200': !isFirstOnTop }" :style="getCardStyle(!isFirstOnTop)">
        <a :href="generateUrl" :download="`imgx-${preset}-${template}.png`">
          <img :src="generateUrl" alt="">
        </a>
      </div>
      <div class="w-full max-w-xl h-auto absolute transition-all duration-500"
        :class="{ 'z-10': isFirstOnTop, 'delay-200': isFirstOnTop }" :style="getCardStyle(isFirstOnTop)">
        <ClientOnly>
          <PreviewWraper :presetCode="preset">
            <component :is="curComponent" :title="text"></component>
            <!-- <ImgTemplate1 :title="text"></ImgTemplate1> -->
          </PreviewWraper>
        </ClientOnly>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>
import { templates } from './lib/template';
const isFirstOnTop = ref(true)
const firstCardZIndex = ref(true)

const templateOptions = computed(() => {
  return Object.keys(templates).map(key => ({
    value: key,
    label: `模板-${key}`
  }))
})


const config = useRuntimeConfig();

type Perset = '001' | '002';

const preset = ref<Perset>('001')
const template = ref<'001' | '002'>('001')
const text = ref('')
const generateUrl = ref('')
const curComponent = computed(() => {
  return templates[template.value]
})

const getCardStyle = (isTop: boolean) => ({
  transform: isTop
    ? 'translateY(0) translateX(0) scale(1)'
    : 'translateY(50px) translateX(30px) scale(0.95)',
  opacity: isTop ? 1 : 0.6
})

watch([template, preset], () => {
  generateUrl.value = '';
  isFirstOnTop.value = true;
})

const switchPerviewCard = (flag?: boolean) => {
  isFirstOnTop.value = flag ?? !isFirstOnTop.value;
}

const generateImage = async () => {
  generateUrl.value = `/api/img/${preset.value}/${template.value}/${text.value}`
  switchPerviewCard(false)
}
</script>

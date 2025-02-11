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
        <SelectTrigger class="w-[150px]">
          <SelectValue placeholder="选择一个预设" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <!-- <SelectLabel>预设</SelectLabel> -->
            <SelectItem v-for="option in presetOptions" :value="option.value">
              {{ option.label }}
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

      <InteractiveHoverButton class="w-20 text-sm" text="切换" @click="switchPerviewCard(!isFirstOnTop)" />
      <InteractiveHoverButton class="w-36" text="查看图片" @click="generateImage" />

    </div>

    <div class="w-full flex justify-center">
      <IInput placeholder="输入内容" container-class="w-full max-w-xl" class="h-12" v-model="text"></IInput>
    </div>

    <div>
    </div>
    <div class="toggle-box relative w-full max-w-xl">
      <div class="img-preview box-border max-w-xl absolute transition-all duration-500" v-if="generateUrl"
        :class="{ 'z-10': !isFirstOnTop, 'delay-200': !isFirstOnTop }" :style="getCardStyle(!isFirstOnTop)">
        <a :href="generateUrl" :download="`imgx-${preset}-${template}.png`" ref="imgDownloadRef">
          <!-- <img alt="imgx" ref="imgRef"> -->
        </a>
        <BorderBeam class="box-border" :size="200" :duration="2" :delay="9" :border-width="5" v-if="isLoadingImg" />
      </div>
      <div class="w-full max-w-xl h-auto absolute transition-all duration-500 cursor-pointer"
        :class="{ 'z-10': isFirstOnTop, 'delay-200': isFirstOnTop }" :style="getCardStyle(isFirstOnTop)"
        @click="switchPerviewCard(true)">
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
import { templates, type TemplateCode } from '@/lib/template';
import { presets, type PresetCode } from '@/lib/preset';
const isFirstOnTop = ref(true)
const isLoadingImg = ref(true)
const imgDownloadRef = ref()

const templateOptions = computed(() => {
  return Object.keys(templates).map(key => ({
    value: key,
    label: `模板-${key}`
  }))
})

const presetOptions = computed(() => {
  return Object.keys(presets).map((key) => ({
    value: key,
    label: `尺寸-${key}-${presets[key as PresetCode].desc}`
  }))
})

const config = useRuntimeConfig();

const preset = ref<PresetCode>('001')
const template = ref<TemplateCode>('001')
const text = ref('最新最全的[Nuxt]实战教程+blog.zzao.club')
const generateUrl = ref(``)
const curComponent = computed(() => {
  return templates[template.value]
})
function loadedImg() {
  console.log(` 加载完毕`,)
}
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
  const img = new Image();
  isLoadingImg.value = true
  generateUrl.value = `/api/img/${preset.value}/${template.value}/${text.value}`
  img.src = generateUrl.value;
  img.onload = () => {
    console.log(`加载完成`);
    isLoadingImg.value = false
    imgDownloadRef.value.innerHTML = '';
    imgDownloadRef.value.appendChild(img);
  }

  img.onerror = () => {
    console.log(`加载失败`);
    isLoadingImg.value = false
    isFirstOnTop.value = true
  }



  switchPerviewCard(false)


}

onMounted(() => {
  setTimeout(() => {
    generateImage()
  }, 1000);
})
</script>

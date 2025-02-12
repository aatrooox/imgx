<template>
  <div
    class="flex flex-col gap-4 pt-1 items-center h-screen w-full overflow-y-auto transition-all duration-300 ease-in-out px-8 pb-8">
    <div class="title flex justify-center items-end mt-8">
      <!-- <SparklesText text="IMG X" :colors="{ first: '#9E7AFF', second: '#FE8BBB' }" :sparkles-count="10" class="" /> -->
      <h1 class="text-balance text-4xl font-extrabold leading-none tracking-tighter">
        IMG
        <LineShadowText class="italic" :shadow-color="'black'">
          X
        </LineShadowText>
      </h1>
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
    </div>
    <div class="bgColor-selector w-full max-w-xl flex gap-2">
      <div v-for="color in bgColors" class="rounded-full w-[30px] h-[30px] cursor-pointer"
        :class="{ 'border-4 border-black': color[0] === customColor[0] }"
        :style="{ backgroundImage: `linear-gradient(to right, #${color[0]}, #${color[1]})` }"
        @click="customColor = color">
      </div>
    </div>
    <div class="options w-full max-w-xl flex gap-2">
      <div class="flex items-center space-x-2">
        <Switch id="airplane-mode" v-model:checked="isCenter" />
        <Label for="airplane-mode">全部居中</Label>
      </div>
      <div class="flex items-center space-x-2">
        <Switch id="airplane-mode" v-model:checked="isHighRatio" />
        <Label for="airplane-mode">高清</Label>
      </div>
      <Button @click="generateImage">
        生成图片
      </Button>
    </div>
    <div class="tip w-full max-w-xl text-sm">
      现阶段<strong>API</strong>还在频繁调整中，建议<strong>下载图片进行使用</strong>
    </div>
    <div class="api w-full max-w-xl text-sm text-zinc-500 underline">
      {{ generateUrl }}
    </div>
    <div class="w-full flex justify-center">
      <IInput placeholder="输入内容" container-class="w-full max-w-xl" class="h-16" v-model="text"></IInput>
    </div>

    <div>
    </div>
    <div class="toggle-box relative w-full max-w-xl">
      <div class="img-preview box-border max-w-xl transition-all duration-500" v-if="generateUrl"
        :class="{ 'z-10': !isFirstOnTop, 'delay-200': !isFirstOnTop }" :style="getCardStyle(!isFirstOnTop)">
        <a :href="generateUrl" :download="`imgx-${preset}-${template}-@x${ratio}.png`" ref="imgDownloadRef">
          <!-- <img alt="imgx" ref="imgRef"> -->
        </a>
        <BorderBeam class="box-border" :size="200" :duration="2" :delay="9" :border-width="5" v-if="isLoadingImg" />
      </div>
      <!-- <div class="max-w-[90%] h-auto absolute transition-all duration-500 cursor-pointer"
        :class="{ 'z-10': isFirstOnTop, 'delay-200': isFirstOnTop }" :style="getCardStyle(isFirstOnTop)"
        @click="switchPerviewCard(true)">
        <ClientOnly>
          <PreviewWraper :presetCode="preset" :ratio="ratio">
            <component :is="curComponent" :title="text" :fontSize="ratio * presets[preset].fontSize" :center="isCenter">
            </component>
          </PreviewWraper>
        </ClientOnly>
      </div> -->
    </div>

    <!-- <div class="w-full max-w-xl mt-[250px]">
      <p>
        <span class="font-bold">API [GET]:</span>
        <a class="text-blue-500"
          href="https://imgx.zzao.club/api/img/001/001/[Nuxt实战]从入门到放弃系列+点击就送屠龙宝刀?bgColor=292a3a-536976&accentColor=0088a9&color=ffffff">https://imgx.zzao.club/api/img/001/001/[Nuxt实战]从入门到放弃系列+点击就送屠龙宝刀?bgColor=292a3a-536976&accentColor=0088a9&color=ffffff</a>
      </p>
      <p class="text-sm mt-4 text-zinc-500"> 参数说明：颜色色值传 HEX 格式, bgColor（背景颜色）支持两个颜色渐变，以短横线 - 分割</p>

    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { templates, type TemplateCode } from '@/lib/template';
import { presets, type PresetCode } from '@/lib/preset';
const isFirstOnTop = ref(true)
const isLoadingImg = ref(true)
const isCenter = ref(false)
const isHighRatio = ref(false)
const imgDownloadRef = ref()


const bgColors = ref([
  ['ff7e5f', 'feb47b'],
  ['4facfe', '00f2fe'],
  ['a18cd1', 'fbc2eb'],
  ['43e97b', '38f9d7'],
  ['606c88', '3f4c6b'],
  ['ff0844', 'ffb199'],
  ['89f7fe', '66a6ff'],
  ['f6d365', 'fda085'],
  ['30cfd0', '330867'],
  ['ff758c', 'ff7eb3']
])

const customColor = ref<string[]>(bgColors.value[0])

useHead({
  title: 'IMGX@早早集市',
  meta: [
    {
      name: 'description',
      content: '一行代码生成封面图'
    }
  ]

})
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
const ratio = computed(() => {
  return isHighRatio.value ? 2 : 1
})
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

watch([template, preset, ratio], () => {
  // generateUrl.value = '';
  // isFirstOnTop.value = true;
  // generateImage()
})

const switchPerviewCard = (flag?: boolean) => {
  isFirstOnTop.value = flag ?? !isFirstOnTop.value;
}

const generateImage = async () => {
  const img = new Image();
  isLoadingImg.value = true
  generateUrl.value = `/api/img/${preset.value}/${template.value}/${text.value}?ratio=${ratio.value}&center=${isCenter.value ? 1 : 0}&bgColor=${customColor.value[0]}-${customColor.value[1]}`
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

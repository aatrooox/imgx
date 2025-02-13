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
    <div class="options flex items-center gap-4 w-full max-w-xl">

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
      <!-- 是否居中 -->
      <div
        class="icon-btn cursor-pointer w-[30px] h-[30px] border flex justify-center items-center box-border p-1 rounded-lg"
        :class="{ 'bg-zinc-800': isCenter }" @click="isCenter = !isCenter">
        <NuxtIcon name="material-symbols:recenter-rounded" size="1.5em" mode="svg"
          :style="{ color: isCenter ? 'white' : '#27272a' }"></NuxtIcon>
      </div>
      <!-- 是否是 2 倍图 -->
      <NuxtIcon class="cursor-pointer"
        :name="isHighRatio ? 'material-symbols:high-quality' : 'material-symbols:high-quality-outline'" size="2em"
        mode="svg" @click="isHighRatio = !isHighRatio"></NuxtIcon>
    </div>
    <div class="bgColor-selector w-full max-w-xl flex gap-2">
      <div v-for="color in bgColors" class="rounded-full w-[30px] h-[30px] cursor-pointer"
        :class="{ 'border-4 border-black': color[0] === customColor[0] }"
        :style="{ backgroundImage: `linear-gradient(to right, #${color[0]}, #${color[1]})` }"
        @click="customColor = color">
      </div>
      <Button variant="secondary" size="sm" @click="reRandomBgColors">随机</Button>
    </div>
    <div class="bgColor-selector w-full max-w-xl flex items-center gap-2">
      <div class="font-bold px-2 cursor-pointer" :style="{ color: '#ffffff', backgroundColor: '#000000' }"
        @click="setFixedFontColor('ffffff')">IMGX</div>
      <div class="font-bold px-2 cursor-pointer" :style="{ color: '#000000', backgroundColor: '#ffffff' }"
        @click="setFixedFontColor('000000')">IMGX</div>
      <div class="font-bold px-2 cursor-pointer"
        :style="{ backgroundImage: `linear-gradient(to right, #${customColor[0]}, #${customColor[1]})`, color: `#${curstomFontColor}` }"
        @click="setFixedFontColor(randomHexColor())">随机基础色</div>

      <div class="font-bold px-2 cursor-pointer"
        :style="{ backgroundImage: `linear-gradient(to right, #${customColor[0]}, #${customColor[1]})`, color: `#${accentFontColor}` }"
        @click="setAccentFontColor(randomHexColor())">随机强调色</div>
    </div>
    <div class="options w-full max-w-xl flex gap-2">
      <div class="flex items-center space-x-2">
        <Switch id="airplane-mode-3" v-model:checked="isRelativeWithBgColors" />
        <Label for="airplane-mode-3" class="font-bold px-2"
          :style="{ backgroundImage: `linear-gradient(to right, #${customColor[0]}, #${customColor[1]})`, color: `#${curstomFontColor}` }">IMGX</Label>
      </div>
      <Button size="sm" @click="generateImage">
        生成图片
      </Button>
    </div>
    <div class="w-full max-w-xl">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Tips！</AccordionTrigger>
          <AccordionContent>
            <div class="flex flex-wrap gap-2 items-center mb-2">
              <div class="flex items-center gap-2">
                <NuxtIcon name="material-symbols:recenter-rounded" size="2em" mode="svg"></NuxtIcon> 是否居中
              </div>
              <div class="flex items-center gap-2">
                <NuxtIcon name="material-symbols:high-quality" size="2em" mode="svg"></NuxtIcon>是否高清
              </div>
              <div class="flex">
                <div class="font-bold px-2"
                  :style="{ backgroundImage: `linear-gradient(to right, #${customColor[0]}, #${customColor[1]})`, color: `#${curstomFontColor}` }">
                  IMGX</div>
                <div>自动随机文字颜色！(跟随背景色)</div>
              </div>
            </div>
            <div class="tip text-sm mb-1">
              现阶段<strong class="text-cyan-500">API</strong>还在频繁调整中，建议<strong class="text-cyan-500">下载图片进行使用</strong>
            </div>
            <div class="tip w-full max-w-xl text-sm mb-2">
              <strong class="text-cyan-500">预览时</strong>文字位置展示和实际图片<strong class="text-cyan-500">有差异</strong>，建议<strong
                class="text-cyan-500">仅用来调整配色和预览排版</strong>
            </div>
            <div class="api w-full text-sm text-zinc-500 underline">
              API演示( <strong class="text-cyan-500">点击生成后的链接</strong>)：<a :href="generateUrl" target="_blank">{{
                generateUrl }}</a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <div class="w-full flex justify-center">
      <IInput placeholder="输入内容" container-class="w-full max-w-xl" class="h-20 text-lg" v-model="text"></IInput>
    </div>

    <div>
    </div>
    <div class="toggle-box relative w-full max-w-xl">
      <div class="img-preview box-border absolute max-w-xl transition-all duration-500" v-if="generateUrl"
        :class="{ 'z-10': !isFirstOnTop, 'delay-200': !isFirstOnTop }" :style="getCardStyle(!isFirstOnTop)">
        <a :href="generateUrl" :download="`imgx-${preset}-${template}-@x${ratio}.png`" ref="imgDownloadRef">
          <!-- <img alt="imgx" ref="imgRef"> -->
        </a>
        <BorderBeam class="box-border" :size="200" :duration="2" :delay="9" :border-width="5" v-if="isLoadingImg" />
      </div>
      <div class="w-full max-w-xl h-auto absolute transition-all duration-500 cursor-pointer"
        :class="{ 'z-10': isFirstOnTop, 'delay-200': isFirstOnTop }" :style="getCardStyle(isFirstOnTop)"
        @click="switchPerviewCard(true)">
        <ClientOnly>
          <PreviewWraper :presetCode="preset">
            <component :is="curComponent" :title="text" :center="isCenter" :bgColor="customColor!.join('-')"
              :color="`#${curstomFontColor}`" :accentColor="`#${accentFontColor}`">
            </component>
          </PreviewWraper>
        </ClientOnly>
      </div>
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
// 是否跟随背景色自动变化
const isRelativeWithBgColors = ref(true)
// 固定颜色，没勾选自动时，用这个颜色
const fixedFontColor = ref('000000')
// 强调色
const accentFontColor = ref('0088a9');

const bgColors = ref<Array<GradientColors>>()
const customColor = ref<GradientColors>(['7a24d6', '88e524'])

// 自定义颜色？
const curstomFontColor = computed(() => {
  return isRelativeWithBgColors.value ? getGradientTextColor(customColor.value as GradientColors) : fixedFontColor.value
})

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
const setFixedFontColor = (color: string) => {
  fixedFontColor.value = color
}
const setAccentFontColor = (color: string) => {
  accentFontColor.value = color
}
const getCardStyle = (isTop: boolean) => ({
  transform: isTop
    ? 'translateY(0) translateX(0) scale(1)'
    : 'translateY(50px) translateX(30px) scale(0.95)',
  opacity: isTop ? 1 : 0.6
})

watch([template, preset, ratio, customColor, isCenter], () => {
  switchPerviewCard(true)
})

const switchPerviewCard = (flag?: boolean) => {
  isFirstOnTop.value = flag ?? !isFirstOnTop.value;
}

const generateImage = async () => {
  const img = new Image();
  isLoadingImg.value = true
  generateUrl.value = `/api/img/${preset.value}/${template.value}/${text.value}?ratio=${ratio.value}&center=${isCenter.value ? 1 : 0}&bgColor=${customColor.value[0]}-${customColor.value[1]}&color=${curstomFontColor.value}&accentColor=${accentFontColor.value}`
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

const reRandomBgColors = () => {
  bgColors.value = [
    // 互补色 ： 活力
    randomGradientColors('complementary'),
    randomGradientColors('complementary'),
    randomGradientColors('adjacent'),
    randomGradientColors('adjacent'),
    randomGradientColors('monochromatic'),
    randomGradientColors('monochromatic'),

  ]

  customColor.value = bgColors.value[0]
}

onMounted(() => {
  reRandomBgColors();
  setTimeout(() => {
    generateImage()
  }, 1000);
})
</script>

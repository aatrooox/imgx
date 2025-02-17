<script setup lang="ts">
import { getParsedText, getParsedBgColor } from '~/lib/template';
const {
  title = 'IMGX',
  bgColor = 'f6d365-fda085',
  color = '#000000',
  accentColor = '#0088a9',
  center = false,
  fontSize = 30,
  fontFamily = 'YouSheBiaoTiHei',
  padding = '30px',
  bgImage = 'linear-gradient(to right, transparent, transparent)',
  textWrapBgColor = 'transparent',
  textWrapShadow = 'none',
  textWrapPadding = '0px',
  textWrapRounded = 'none'
} = defineProps<{
  title?: string,
  bgColor?: string | null,
  bgImage?: string | null,
  color?: string,
  accentColor?: string,
  center?: boolean
  fontSize?: number
  fontFamily?: string
  icon?: string
  iconSize?: number
  padding?: string
  textWrapBgColor?: string
  textWrapShadow?: string
  textWrapPadding?: string
  textWrapRounded?: string
}>()


</script>

<template>
  <div class="w-full h-full flex items-center justify-center transition-all duration-300"
    :style="{ backgroundColor: bgColor ?? 'transparent', backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', color: color, fontSize: fontSize + 'px', padding: padding, fontFamily: fontFamily }">
    <div
      :class="[`text-wrap flex w-full h-full rounded-${textWrapRounded} shadow-${textWrapShadow}`, center && 'justify-center items-center']"
      :style="{ backgroundColor: textWrapBgColor, padding: textWrapPadding }">
      <div class="flex flex-col w-full">
        <template v-for="text in title.split('+')">
          <div class="font-bold flex" :class="{ 'justify-center': center }">
            <div class="flex"
              :style="{ width: `${iconSize}px`, height: `${iconSize}px`, backgroundImage: `url(${icon})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }"
              v-if="icon">
            </div>
            <!-- <span>{{ text }}</span> -->
            <template v-for="(part, index) in getParsedText(text)" :key="index">
              <span class="flex" v-if="part.type === 'emoji'"
                :style="{ width: (iconSize || fontSize) + 'px', height: (iconSize || fontSize) + 'px', backgroundImage: `url(${part.url})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }"></span>
              <span class="text-nowrap" v-else :style="{ color: part.type === 'accent' ? (accentColor || '') : '' }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
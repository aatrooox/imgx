<script setup lang="ts">
import { getParsedText, getParsetBgColor } from '~/lib/template';
const {
  title = 'IMGX',
  bgColor = 'f6d365-fda085',
  color = '#000000',
  accentColor = '#0088a9',
  center = false,
  fontSize = 30
} = defineProps<{
  title?: string,
  bgColor?: string,
  color?: string,
  accentColor?: string,
  center?: boolean
  fontSize?: number
  icon?: string
  iconSize?: number
}>()


</script>

<template>
  <div class="w-full h-full flex items-center justify-center p-8"
    :style="{ ...getParsetBgColor(bgColor), color: color, fontSize: fontSize + 'px' }">
    <div class="text-wrap flex w-full h-full" :class="{ 'justify-center': center, 'items-center': center }">
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
                :style="{ width: part.type === 'emoji' ? (iconSize || fontSize) + 'px' : 'auto', height: part.type === 'emoji' ? (iconSize || fontSize) + 'px' : 'auto', backgroundImage: `url(${part.url})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }"></span>
              <span class="text-nowrap" v-else :style="{ color: part.type === 'accent' ? accentColor : '' }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
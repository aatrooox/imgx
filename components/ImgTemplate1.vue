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
}>()


</script>

<template>
  <div class="w-full h-full flex items-center justify-center p-8"
    :style="{ ...getParsetBgColor(bgColor), color: color, fontSize: fontSize + 'px' }">
    <div class="text-wrap flex w-full h-full" :class="{ 'justify-center': center, 'items-center': center }">
      <div class="flex flex-col w-full">
        <template v-for="text in title.split('+')">
          <div class="font-bold flex" :class="{ 'justify-center': center }">
            <!-- <span>{{ text }}</span> -->
            <template v-for="(part, index) in getParsedText(text)" :key="index">
              <span :style="{ color: part.isTag && accentColor || '' }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getParsedText, getParsetBgColor } from '~/lib/template';
const {
  title = 'IMGX',
  bgColor = 'rgba(243,244,212)',
  color = '#000000',
  accentColor = '#FF340A',
  center = true
} = defineProps<{
  title?: string,
  bgColor?: string,
  color?: string,
  accentColor?: string,
  center?: boolean
}>()


</script>

<template>
  <div class="w-full h-full flex items-center justify-center  p-8"
    :style="{ ...getParsetBgColor(bgColor), color: color }">
    <div class="flex items-center w-full h-full">
      <div class="flex flex-col w-full">
        <template v-for="text in title.split('+')">
          <div class="text-3xl font-black flex" :class="{ 'justify-center': center }">
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
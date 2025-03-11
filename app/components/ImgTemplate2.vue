<script setup lang="ts">
import { getParsedText } from '~/lib/template';
const {
  title = 'IMGX',
  bgColor = 'rgba(0, 0, 0, 0.2)',
  accentColor = '#000'
} = defineProps<{
  title?: string,
  bgColor?: string,
  accentColor?: string
}>()

</script>

<template>
  <div class="w-full h-full flex items-center justify-center p-8" :style="{ backgroundColor: bgColor }">
    <div class="flex items-center justify-center w-full h-full">
      <div class="flex flex-col">
        <template v-for="text in title.split('+')">
          <div class="text-3xl font-black flex justify-center">
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
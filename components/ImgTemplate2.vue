<script setup lang="ts">
const {
  title = 'IMGX',
  content = 'AI图片生成器',
  author = 'IMGX',
  date = '2023-07-01'
} = defineProps<{
  title?: string
  content?: string
  author?: string
  date?: string
}>()

</script>

<template>
  <div class="w-full h-full overflow-hidden rounded-lg shadow-2xl flex flex-col items-center justify-center p-8"
    style="background-image: linear-gradient(to right, #9b59b6, #f1c40f);">
    <div class="flex flex-col items-center justify-center text-white">
      <div class="text-7xl font-bold mb-4" style="color: white;">{{ title }}</div>
      <div class="text-4xl text-center mb-8" style="color: white;">{{ content }}</div>
      <div class="flex justify-between w-full text-sm">
        <div style="color: white;">作者：{{ author }}</div>
        <div style="color: white;">日期：{{ date }}</div>
      </div>
    </div>
  </div>
</template>
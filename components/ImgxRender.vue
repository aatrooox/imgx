<script setup lang="ts">
const {
  title = 'IMGX',
} = defineProps<{
  title?: string
}>()

</script>

<template>
  <div class="w-full h-full flex items-start justify-start border-blue-500 border-[12px] bg-gray-50 p-8">
    <div class="flex items-start justify-start h-full">
      <div class="flex flex-col justify-between w-full h-full'">
        <template v-for="text in title.split('+')">
          <div class="text-7xl font-black">
            {{ text }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
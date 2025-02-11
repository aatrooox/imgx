<script setup lang="ts">
const {
  title = 'IMGX',
} = defineProps<{
  title?: string
}>()

</script>

<template>
  <div class="w-full h-full flex items-center justify-center border-red-500 border-[12px] bg-gray-50 p-8">
    <div class="flex items-center justify-center w-full h-full">
      <div class="flex flex-col gap-8">
        <template v-for="text in title.split('+')">
          <div class="text-7xl font-black flex justify-center">
            <span>{{ text }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
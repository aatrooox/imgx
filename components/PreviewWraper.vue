<script lang="ts" setup>
import { sizes, type SizeCode } from '~/lib/sizes';

const { SizeCode = '001', ratio = 1 } = defineProps<{ SizeCode?: SizeCode, ratio?: number | string }>()
const previewRef = ref();
const scale = ref(1);
const exportWidth = computed(() => {
  // width 和 height 为导出时的真实像素值
  // 在预览显示时，保持比例即可
  const { width, fontSize } = sizes[SizeCode];
  return width * +ratio
})

const exportHeight = computed(() => {
  // width 和 height 为导出时的真实像素值
  // 在预览显示时，保持比例即可
  const { fontSize, height } = sizes[SizeCode];
  return height * +ratio
})

const setScale = () => {
  const realWidth = previewRef.value?.getBoundingClientRect().width;
  console.log(`previewRef`, previewRef.value);
  if (realWidth) {
    const _realWidth = parseInt(realWidth)
    scale.value = (_realWidth / exportWidth.value) > 1 ? 1 : _realWidth / exportWidth.value
    console.log(`scale`, scale.value)
    // previewRef.value.style.height = `${height}px`
  }
}

watch(exportWidth, () => {
  setScale()
})

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    setScale()
  })
})

</script>
<template>
  <div class="transform flex justify-center items-center relative w-full" ref="previewRef">
    <div class="scale-wraper origin-top-left absolute left-0 top-0 font-[YouSheBiaoTiHei]" :style="{
      scale: `${scale}`,
      width: exportWidth + 'px',
      height: exportHeight + 'px',
    }">
      <Transition name="fade" mode="out-in">
        <slot></slot>
      </Transition>
      <!-- <BorderBeam :size="600" :duration="2" :delay="9" :border-width="10" /> -->
      <div class="absolute bottom-0 right-0 bg-cyan-500 text-white text-lg box-border px-2 py-1">{{ `
        <预览 />` }}
      </div>

    </div>
  </div>
</template>
<style scoped></style>
<script lang="ts" setup>
type PresetCode = '001' | '002';
const { presetCode = '001' } = defineProps<{ presetCode?: PresetCode }>()
const previewRef = ref();
const config = useAppConfig();
const scale = ref(1);
const exportWidth = computed(() => {
  // width 和 height 为导出时的真实像素值
  // 在预览显示时，保持比例即可
  const { width, height } = config.presetConfig[presetCode];
  return width
})

const exportHeight = computed(() => {
  // width 和 height 为导出时的真实像素值
  // 在预览显示时，保持比例即可
  const { width, height } = config.presetConfig[presetCode];
  return height
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
  <div class="transform flex justify-center items-center relative" ref="previewRef">
    <div class="scale-wraper w-full origin-top-left absolute left-0 top-0 font-[YouSheBiaoTiHei]" :style="{
      scale: `${scale}`,
      width: exportWidth + 'px',
      height: exportHeight + 'px',
    }">
      <Transition name="fade" mode="out-in">
        <slot></slot>
      </Transition>
      <!-- <BorderBeam :size="600" :duration="2" :delay="9" :border-width="10" /> -->
    </div>
  </div>
</template>
<style scoped></style>
<script lang="ts" setup>
import { PATTERN_BACKGROUND_DIRECTION, PATTERN_BACKGROUND_VARIANT, PATTERN_BACKGROUND_SPEED } from '@/components/ui/pattern-background'
</script>
<template>
  <div>
    <PatternBackground
      :animate="true"
      :direction="PATTERN_BACKGROUND_DIRECTION.TopRight"
      :variant="PATTERN_BACKGROUND_VARIANT.Dot"
      class="fixed h-full w-full -z-10"
      :speed="PATTERN_BACKGROUND_SPEED.Slow"
    >
    </PatternBackground>  
    <slot></slot>
  </div>
</template>
<style scoped>
</style>
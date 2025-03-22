<script setup lang="ts">
import type { componentBaseProps } from '~/lib/content'
const {
  content = [],
  bgColor = '',

  colors = ['#000000'],
  accentColors = ['#0088a9'],
  aligns = ['justify-start'], // 横向对齐方式
  fontSizes = ['30px'],
  verticalAligns = ['center'],

  fontFamily = 'YouSheBiaoTiHei',
  padding = '30px',
  bgImage = 'linear-gradient(to right, transparent, transparent)',
  textWrapBgColor = 'transparent',
  textWrapShadow = 'none',
  textWrapPadding = '0px',
  textWrapRounded = 'none'
} = defineProps<componentBaseProps>()


</script>

<template>
  <div class="w-full h-full flex items-center justify-center transition-all duration-300"
    :style="{ backgroundColor: bgColor ?? 'transparent', backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', padding: padding, fontFamily: fontFamily }">
    <div :class="[`text-wrap flex w-full h-full rounded-${textWrapRounded} shadow-${textWrapShadow}`]"
      :style="{ backgroundColor: textWrapBgColor, padding: textWrapPadding , justifyContent: verticalAligns[0] ?? 'center' }">
      <div class="flex flex-col w-full">
        <template v-for="(line, index) in content">
          <div :class="['font-bold flex', aligns[index]]" :style="{ color: colors[index], fontSize: fontSizes[index] }">
            <template v-for="(text, index) in line" :key="index">
              <span class="flex" v-if="text.type === 'emoji'"
                :style="{ width: iconSizes && iconSizes[index] + 'px', height: iconSizes && iconSizes[index] + 'px', backgroundImage: `url(${text.base64URL})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }"></span>
              <span class="text-nowrap" v-else
                :style="{ color: text.type === 'accent' ? (accentColors[index] || '') : '' }">
                {{ text.text }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
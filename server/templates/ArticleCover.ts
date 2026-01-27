export const ArticleCoverTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ backgroundColor: bgColor ?? 'transparent', backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', padding: padding, fontFamily: fontFamily }">
  <div class="flex items-center w-full h-full"
    :style="{ backgroundColor: textWrapBgColor, padding: textWrapPadding }">
    <div class="flex flex-col w-full">
      <template v-for="(line, lineIdx) in content" :key="lineIdx">
        <div :class="['flex font-bold', aligns[lineIdx]]" 
          :style="{ color: colors[lineIdx], fontSize: fontSizes[lineIdx] }">
          <template v-for="(part, partIdx) in line" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ width: fontSizes[lineIdx], height: fontSizes[lineIdx], backgroundImage: \`url(\${part.base64URL})\`, backgroundSize: '100% 100%' }"></span>
            <span v-else class="text-nowrap"
              :style="{ color: part.type === 'accent' ? accentColors[lineIdx] : '' }">
              {{ part.text }}
            </span>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>`

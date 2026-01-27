export const CleanTitleTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ backgroundColor: bgColor ?? 'transparent', backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', padding: padding, fontFamily: fontFamily }">
  <div class="flex items-center w-full h-full"
    :style="{ backgroundColor: textWrapBgColor, padding: textWrapPadding, justifyContent: verticalAligns[0] ?? 'center' }">
    <div class="flex flex-col w-full">
      <template v-for="(line, lineIdx) in content" :key="lineIdx">
        <div :class="['flex font-bold flex-wrap', aligns[lineIdx]]" 
          :style="{ color: colors[lineIdx], fontSize: fontSizes[lineIdx], lineHeight: '1.3' }">
          <template v-for="(part, partIdx) in line" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ width: fontSizes[lineIdx], height: fontSizes[lineIdx], backgroundImage: \`url(\${part.base64URL})\`, backgroundSize: '100% 100%' }"></span>
            <span v-else-if="part.type === 'accent'" class="flex"
              :style="{ color: colors[lineIdx], backgroundColor: accentColors[lineIdx] || '#4CAF50', padding: '4px 8px', margin: '0 4px', borderRadius: '4px' }">
              {{ part.text }}
            </span>
            <span v-else class="flex">
              {{ part.text }}
            </span>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>`

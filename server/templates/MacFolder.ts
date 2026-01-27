export const MacFolderTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ backgroundColor: bgColor, padding: padding, fontFamily: fontFamily }">
  <div class="flex flex-col items-center w-full h-full justify-center">
    <div class="flex items-center" :style="{ width: '180px', height: '30px', marginBottom: '-2px', position: 'relative' }">
      <div :style="{ width: '180px', height: '30px', backgroundColor: folderTopColor, borderRadius: '8px 8px 0 0', position: 'absolute', top: '0', left: '0' }"></div>
      <div class="flex" :style="{ gap: '6px', position: 'relative', zIndex: '1', paddingLeft: '12px' }">
        <div :style="{ width: '10px', height: '10px', backgroundColor: '#ff5f56', borderRadius: '50%', display: 'flex' }"></div>
        <div :style="{ width: '10px', height: '10px', backgroundColor: '#ffbd2e', borderRadius: '50%', display: 'flex' }"></div>
        <div :style="{ width: '10px', height: '10px', backgroundColor: '#27c93f', borderRadius: '50%', display: 'flex' }"></div>
      </div>
    </div>
    <div class="flex items-center justify-center" 
      :style="{ width: '85%', height: '70%', backgroundColor: folderColor, borderRadius: '12px', padding: '60px' }">
      <div class="flex flex-col w-full items-center">
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
  </div>
  <div class="flex"
    :style="{ position: 'absolute', bottom: '24px', right: '32px', fontSize: '18px', color: watermarkColor, opacity: '0.6' }">
    imgx
  </div>
</div>`

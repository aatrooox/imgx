export const WeChatCoverTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ 
    backgroundColor: bgColor ?? '#FFFFFF', 
    backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', 
    fontFamily: fontFamily,
    position: 'relative'
  }">
  
  <!-- Border decoration -->
  <div class="flex"
    :style="{
      position: 'absolute',
      top: padding ?? '60px',
      left: padding ?? '60px',
      right: padding ?? '60px',
      bottom: padding ?? '60px',
      border: (borderWidth ?? 8) + 'px solid ' + (borderColor ?? '#333333'),
      borderRadius: (borderRadius ?? 0) + 'px'
    }">
  </div>

  <!-- Top-left icon -->
  <div v-if="topLeftIcon" class="flex"
    :style="{
      position: 'absolute',
      top: padding ?? '60px',
      left: padding ?? '60px',
      width: (iconSizes?.[0] ?? 60) + 'px',
      height: (iconSizes?.[0] ?? 60) + 'px',
      backgroundImage: \`url(\${topLeftIcon})\`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }">
  </div>

  <!-- Bottom-right icon -->
  <div v-if="bottomRightIcon" class="flex"
    :style="{
      position: 'absolute',
      bottom: padding ?? '60px',
      right: padding ?? '60px',
      width: (iconSizes?.[1] ?? 60) + 'px',
      height: (iconSizes?.[1] ?? 60) + 'px',
      backgroundImage: \`url(\${bottomRightIcon})\`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }">
  </div>

  <!-- Main content area -->
  <div class="flex items-center w-full h-full"
    :style="{ 
      backgroundColor: textWrapBgColor ?? 'transparent', 
      padding: textWrapPadding ?? '0px',
      margin: padding ?? '60px'
    }">
    <div class="flex flex-col w-full">
      <template v-for="(line, lineIdx) in content" :key="lineIdx">
        <div :class="['flex font-bold', aligns?.[lineIdx] ?? 'justify-center']" 
          :style="{ 
            color: colors?.[lineIdx] ?? '#000000', 
            fontSize: fontSizes?.[lineIdx] ?? '120px'
          }">
          <template v-for="(part, partIdx) in line" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ 
                width: fontSizes?.[lineIdx] ?? '120px', 
                height: fontSizes?.[lineIdx] ?? '120px', 
                backgroundImage: \`url(\${part.base64URL})\`, 
                backgroundSize: '100% 100%' 
              }">
            </span>
            <span v-else class="text-nowrap flex"
              :style="{ 
                color: part.type === 'accent' ? (accentColors?.[lineIdx] ?? colors?.[lineIdx] ?? '#000000') : '' 
              }">
              {{ part.text }}
            </span>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>`

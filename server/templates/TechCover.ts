export const TechCoverTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ 
    backgroundColor: bgColor ?? '#000000', 
    backgroundImage: bgImage ?? 'linear-gradient(160deg, #1a1a1a 0%, #000000 50%, #0a0a0a 100%)', 
    fontFamily: fontFamily,
    position: 'relative'
  }">
  
  <!-- Outer border decoration (elegant gold frame) -->
  <div class="flex"
    :style="{
      position: 'absolute',
      top: padding ?? '60px',
      left: padding ?? '60px',
      right: padding ?? '60px',
      bottom: padding ?? '60px',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '0px'
    }">
  </div>

  <!-- Inner border decoration (subtle accent line) -->
  <div class="flex"
    :style="{
      position: 'absolute',
      top: '68px',
      left: '68px',
      right: '68px',
      bottom: '68px',
      border: '1px solid rgba(212, 175, 55, 0.15)',
      borderRadius: '0px'
    }">
  </div>

  <!-- Top-left corner decoration -->
  <div class="flex"
    :style="{
      position: 'absolute',
      top: padding ?? '60px',
      left: padding ?? '60px',
      width: '50px',
      height: '50px',
      borderTop: '2px solid #D4AF37',
      borderLeft: '2px solid #D4AF37'
    }">
  </div>

  <!-- Top-right corner decoration -->
  <div class="flex"
    :style="{
      position: 'absolute',
      top: padding ?? '60px',
      right: padding ?? '60px',
      width: '50px',
      height: '50px',
      borderTop: '2px solid #D4AF37',
      borderRight: '2px solid #D4AF37'
    }">
  </div>

  <!-- Bottom-left corner decoration -->
  <div class="flex"
    :style="{
      position: 'absolute',
      bottom: padding ?? '60px',
      left: padding ?? '60px',
      width: '50px',
      height: '50px',
      borderBottom: '2px solid #D4AF37',
      borderLeft: '2px solid #D4AF37'
    }">
  </div>

  <!-- Bottom-right corner decoration -->
  <div class="flex"
    :style="{
      position: 'absolute',
      bottom: padding ?? '60px',
      right: padding ?? '60px',
      width: '50px',
      height: '50px',
      borderBottom: '2px solid #D4AF37',
      borderRight: '2px solid #D4AF37'
    }">
  </div>

  <!-- Main content area -->
  <div class="flex flex-col items-center justify-center w-full h-full"
    :style="{ 
      padding: padding ?? '60px',
      paddingBottom: '120px'
    }">
    <div class="flex flex-col"
      :style="{
        maxWidth: '95%',
        maxHeight: '70%',
        width: '100%'
      }">
      <template v-for="(line, lineIdx) in content" :key="lineIdx">
        <div :class="['flex flex-wrap font-bold', aligns?.[lineIdx] ?? 'justify-center']" 
          :style="{ 
            color: colors?.[lineIdx] ?? '#FFFFFF', 
            fontSize: fontSizes?.[lineIdx] ?? '100px',
            marginBottom: lineIdx < content.length - 1 ? '16px' : '0px',
            letterSpacing: '2px',
            lineHeight: '1.3',
            gap: '4px',
            wordBreak: 'break-word',
            textWrap: 'wrap'
          }">
          <template v-for="(part, partIdx) in line" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ 
                width: fontSizes?.[lineIdx] ?? '100px', 
                height: fontSizes?.[lineIdx] ?? '100px', 
                backgroundImage: \`url(\${part.base64URL})\`, 
                backgroundSize: '100% 100%' 
              }">
            </span>
             <span v-else-if="part.type === 'accent'" class="whitespace-nowrap flex"
              :style="{ 
                color: accentColors?.[lineIdx] ?? '#D4AF37',
                padding: '0px 12px'
              }">
              {{ part.text }}
            </span>
             <span v-else class="whitespace-nowrap flex">
              {{ part.text }}
            </span>
          </template>
        </div>
      </template>
    </div>
  </div>

  <!-- IMGX Watermark at bottom center -->
  <div class="flex items-center justify-center w-full"
    :style="{
      position: 'absolute',
      bottom: '90px',
      left: '0',
      right: '0',
      color: 'rgba(212, 175, 55, 0.5)',
      fontSize: '20px',
      fontWeight: '500',
      letterSpacing: '6px',
      fontFamily: fontFamily
    }">
    IMGX
  </div>

</div>`

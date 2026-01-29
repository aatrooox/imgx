export const TicketCardTemplate = `<div class="w-full h-full flex"
  :style="{ 
    backgroundColor: bgColor ?? '#2C3E50',
    fontFamily: fontFamily,
    alignItems: 'center',
    justifyContent: 'center',
    padding: padding ?? '40px'
  }">
  
  <!-- Ticket container (white card) -->
  <div class="flex"
    :style="{
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: '32px',
      overflow: 'visible',
      flexDirection: 'row',
      position: 'relative'
    }">
    
    <!-- Left: Square Image Area (510x510) -->
    <div class="flex"
      :style="{
        width: '510px',
        height: '100%',
        flexShrink: '0',
        backgroundColor: '#F5F5F5',
        borderRight: '3px dashed rgba(0, 0, 0, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }">
      <!-- LOGO Placeholder -->
      <div class="flex"
        :style="{
          color: 'rgba(0, 0, 0, 0.15)',
          fontSize: '48px',
          fontWeight: '300',
          letterSpacing: '8px'
        }">
        LOGO
      </div>
    </div>
    
    <!-- Top semicircle notch (covers dashed line) -->
    <div class="flex"
      :style="{
        position: 'absolute',
        left: '507px',
        top: '-20px',
        width: '40px',
        height: '40px',
        backgroundColor: bgColor ?? '#2C3E50',
        borderRadius: '50%'
      }">
    </div>
    
    <!-- Bottom semicircle notch (covers dashed line) -->
    <div class="flex"
      :style="{
        position: 'absolute',
        left: '507px',
        bottom: '-20px',
        width: '40px',
        height: '40px',
        backgroundColor: bgColor ?? '#2C3E50',
        borderRadius: '50%'
      }">
    </div>

    <!-- Center: Content Area -->
    <div class="flex"
      :style="{
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        gap: '50px',
        borderRight: '3px dashed rgba(0, 0, 0, 0.2)'
      }">
      
      <!-- Account Name (Title) -->
      <div class="flex"
        :style="{
          fontSize: fontSizes?.[0] ?? '72px',
          fontWeight: '700',
          color: colors?.[0] ?? '#1a1a1a',
          letterSpacing: '2px'
        }">
        <template v-for="(part, partIdx) in content[0]" :key="partIdx">
          <span v-if="part.type === 'emoji'" class="flex"
            :style="{ 
              width: fontSizes?.[0] ?? '72px', 
              height: fontSizes?.[0] ?? '72px', 
              backgroundImage: \`url(\${part.base64URL})\`, 
              backgroundSize: '100% 100%' 
            }">
          </span>
          <span v-else class="text-nowrap flex"
            :style="{ 
              color: part.type === 'accent' ? (accentColors?.[0] ?? '#E67E22') : '' 
            }">
            {{ part.text }}
          </span>
        </template>
      </div>

      <!-- Info Row: Date | Progress | Article Count (Horizontal, Minimal Style) -->
      <div class="flex"
        :style="{
          flexDirection: 'row',
          alignItems: 'center',
          gap: '60px',
          fontSize: '20px',
          fontWeight: '400',
          color: '#666666'
        }">
        
        <!-- Date Info -->
        <div v-if="content[1]" class="flex"
          :style="{
            gap: '6px',
            alignItems: 'baseline'
          }">
          <template v-for="(part, partIdx) in content[1]" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ 
                width: '20px', 
                height: '20px', 
                backgroundImage: \`url(\${part.base64URL})\`, 
                backgroundSize: '100% 100%' 
              }">
            </span>
            <span v-else class="text-nowrap flex"
              :style="{ 
                fontSize: part.type === 'accent' ? '14px' : '20px',
                color: part.type === 'accent' ? '#999999' : '#666666'
              }">
              {{ part.text }}
            </span>
          </template>
        </div>
        
        <!-- Progress Bar with Percentage -->
        <div v-if="content[2]" class="flex"
          :style="{
            flexDirection: 'column',
            gap: '8px',
            flex: '1',
            maxWidth: '300px'
          }">
          <!-- Progress bar -->
          <div class="flex"
            :style="{
              width: '100%',
              height: '8px',
              backgroundColor: '#E0E0E0',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative'
            }">
            <!-- Green progress indicator (dynamic width based on percentage) -->
            <div class="flex"
              :style="{
                width: \`\${(() => {
                  const percentText = content[2].find(p => p.text && p.text.includes('%'))?.text || '0%';
                  const match = percentText.match(/\\d+/);
                  return match ? match[0] : '0';
                })()}%\`,
                height: '100%',
                backgroundColor: '#4CAF50'
              }">
            </div>
          </div>
          <!-- Progress text -->
          <div class="flex"
            :style="{
              fontSize: '16px',
              color: '#888888',
              gap: '4px'
            }">
            <template v-for="(part, partIdx) in content[2]" :key="partIdx">
              <span v-if="part.type === 'emoji'" class="flex"
                :style="{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundImage: \`url(\${part.base64URL})\`, 
                  backgroundSize: '100% 100%' 
                }">
              </span>
              <span v-else class="text-nowrap flex"
                :style="{ 
                  color: part.type === 'accent' ? '#4CAF50' : '#888888',
                  fontWeight: part.type === 'accent' ? '600' : '400'
                }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </div>
        
        <!-- Article Count -->
        <div v-if="content[3]" class="flex"
          :style="{
            fontSize: '20px',
            fontWeight: '400',
            color: '#666666',
            gap: '4px'
          }">
          <template v-for="(part, partIdx) in content[3]" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ 
                width: '20px', 
                height: '20px', 
                backgroundImage: \`url(\${part.base64URL})\`, 
                backgroundSize: '100% 100%' 
              }">
            </span>
            <span v-else class="text-nowrap flex"
              :style="{ 
                color: part.type === 'accent' ? '#E67E22' : '#666666',
                fontWeight: part.type === 'accent' ? '600' : '400'
              }">
              {{ part.text }}
            </span>
          </template>
        </div>
        
      </div>
    </div>

    <!-- Right: Ticket Stub (80px) -->
    <div class="flex"
      :style="{
        width: '80px',
        height: '100%',
        flexShrink: '0',
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center'
      }">
      <!-- Rotated IMGX text -->
      <div class="flex"
        :style="{
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
          fontSize: '28px',
          fontWeight: '300',
          letterSpacing: '16px',
          color: '#666666',
          whiteSpace: 'nowrap'
        }">
        IMGX
      </div>
    </div>

  </div>
</div>`

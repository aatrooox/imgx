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
      position: 'relative',
      overflow: 'hidden'
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
          color: 'rgba(0, 0, 0, 0.7)',
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

    <!-- Center: Content Area (Premium Ticket Style) -->
    <div class="flex"
      :style="{
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 64px',
        gap: '32px',
        borderRight: '3px dashed rgba(0, 0, 0, 0.15)'
      }">
      
      <!-- Row 1: Brand/Account Name (Primary) -->
      <div class="flex"
        :style="{
          fontSize: fontSizes?.[0] ?? '64px',
          fontWeight: '700',
          color: colors?.[0] ?? '#0B1220',
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }">
        <template v-for="(part, partIdx) in content[0]" :key="partIdx">
          <span v-if="part.type === 'emoji'" class="flex"
            :style="{ 
              width: fontSizes?.[0] ?? '64px', 
              height: fontSizes?.[0] ?? '64px', 
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

      <!-- Row 2: Ticket Info Blocks (Date | Article Count) -->
      <div class="flex"
        :style="{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '48px'
        }">
        
        <!-- Date Block -->
        <div v-if="content[1]" class="flex"
          :style="{
            flexDirection: 'column',
            gap: '8px'
          }">
          <!-- Micro Label -->
          <div class="flex"
            :style="{
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: 'rgba(11, 18, 32, 0.45)'
            }">
            DATE
          </div>
          <!-- Value -->
          <div class="flex"
            :style="{
              fontSize: '28px',
              fontWeight: '600',
              color: 'rgba(11, 18, 32, 0.88)',
              gap: '4px',
              alignItems: 'baseline'
            }">
            <template v-for="(part, partIdx) in content[1]" :key="partIdx">
              <span v-if="part.type === 'emoji'" class="flex"
                :style="{ 
                  width: '28px', 
                  height: '28px', 
                  backgroundImage: \`url(\${part.base64URL})\`, 
                  backgroundSize: '100% 100%' 
                }">
              </span>
              <span v-else class="text-nowrap flex"
                :style="{ 
                  fontSize: part.type === 'accent' ? '16px' : '28px',
                  fontWeight: part.type === 'accent' ? '500' : '600',
                  color: part.type === 'accent' ? 'rgba(11, 18, 32, 0.5)' : 'rgba(11, 18, 32, 0.88)'
                }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </div>

        <!-- Vertical Divider -->
        <div class="flex"
          :style="{
            width: '1px',
            height: '56px',
            backgroundColor: 'rgba(11, 18, 32, 0.1)'
          }">
        </div>
        
        <!-- Article Count Block -->
        <div v-if="content[3]" class="flex"
          :style="{
            flexDirection: 'column',
            gap: '8px'
          }">
          <!-- Micro Label -->
          <div class="flex"
            :style="{
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: 'rgba(11, 18, 32, 0.45)'
            }">
            ARTICLE
          </div>
          <!-- Value -->
          <div class="flex"
            :style="{
              fontSize: '28px',
              fontWeight: '600',
              color: 'rgba(11, 18, 32, 0.88)',
              gap: '4px',
              alignItems: 'baseline'
            }">
            <template v-for="(part, partIdx) in content[3]" :key="partIdx">
              <span v-if="part.type === 'emoji'" class="flex"
                :style="{ 
                  width: '28px', 
                  height: '28px', 
                  backgroundImage: \`url(\${part.base64URL})\`, 
                  backgroundSize: '100% 100%' 
                }">
              </span>
              <span v-else class="text-nowrap flex"
                :style="{ 
                  color: part.type === 'accent' ? (accentColors?.[3] ?? '#E67E22') : 'rgba(11, 18, 32, 0.88)',
                  fontWeight: part.type === 'accent' ? '700' : '600'
                }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </div>
        
      </div>

      <!-- Row 3: Progress Strip (Percentage + Hairline Bar) -->
      <div v-if="content[2]" class="flex"
        :style="{
          flexDirection: 'row',
          alignItems: 'center',
          gap: '24px',
          marginTop: '8px'
        }">
        
        <!-- Progress Text -->
        <div class="flex"
          :style="{
            alignItems: 'baseline',
            gap: '6px'
          }">
          <template v-for="(part, partIdx) in content[2]" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ 
                width: '36px', 
                height: '36px', 
                backgroundImage: \`url(\${part.base64URL})\`, 
                backgroundSize: '100% 100%' 
              }">
            </span>
            <span v-else class="text-nowrap flex"
              :style="{ 
                fontSize: part.type === 'accent' ? '36px' : '18px',
                fontWeight: part.type === 'accent' ? '700' : '500',
                color: part.type === 'accent' ? 'rgba(11, 18, 32, 0.9)' : 'rgba(11, 18, 32, 0.5)',
                letterSpacing: part.type === 'accent' ? '-0.02em' : '0'
              }">
              {{ part.text }}
            </span>
          </template>
        </div>
        
        <!-- Hairline Progress Bar -->
        <div class="flex"
          :style="{
            flex: '1',
            maxWidth: '280px',
            height: '6px',
            backgroundColor: 'rgba(11, 18, 32, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden'
          }">
          <!-- Progress Fill -->
          <div class="flex"
            :style="{
              width: \`\${(() => {
                const percentText = content[2].find(p => p.text && p.text.includes('%'))?.text || '0%';
                const match = percentText.match(/\\d+/);
                return match ? match[0] : '0';
              })()}%\`,
              height: '100%',
              backgroundColor: 'rgba(11, 18, 32, 0.75)',
              borderRadius: '999px'
            }">
          </div>
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

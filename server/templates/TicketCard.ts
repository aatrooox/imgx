export const TicketCardTemplate = `<div class="w-full h-full flex"
  :style="{ 
    backgroundColor: bgColor ?? '#2C3E50',
    fontFamily: fontFamily,
    alignItems: 'center',
    justifyContent: 'center',
    padding: padding ?? '24px'
  }">
  
  <!-- Ticket container (white card) -->
  <div class="flex"
    :style="{
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      overflow: 'visible',
      flexDirection: 'row',
      position: 'relative',
      overflow: 'hidden'
    }">
    
    <!-- Left: Square Image Area (350x350) -->
    <div class="flex"
      :style="{
        width: '350px',
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
          fontSize: '36px',
          fontWeight: '300',
          letterSpacing: '6px'
        }">
        LOGO
      </div>
    </div>
    
    <!-- Top semicircle notch -->
    <div class="flex"
      :style="{
        position: 'absolute',
        left: '347px',
        top: '-16px',
        width: '32px',
        height: '32px',
        backgroundColor: bgColor ?? '#2C3E50',
        borderRadius: '50%'
      }">
    </div>
    
    <!-- Bottom semicircle notch -->
    <div class="flex"
      :style="{
        position: 'absolute',
        left: '347px',
        bottom: '-16px',
        width: '32px',
        height: '32px',
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
        padding: '24px 40px',
        gap: '16px',
        borderRight: '3px dashed rgba(0, 0, 0, 0.15)'
      }">
      
      <!-- Row 1: Brand/Account Name -->
      <div class="flex"
        :style="{
          fontSize: fontSizes?.[0] ?? '48px',
          fontWeight: '700',
          color: colors?.[0] ?? '#0B1220',
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }">
        <template v-for="(part, partIdx) in content[0]" :key="partIdx">
          <span v-if="part.type === 'emoji'" class="flex"
            :style="{ 
              width: fontSizes?.[0] ?? '48px', 
              height: fontSizes?.[0] ?? '48px', 
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

      <!-- Row 2: Info Blocks (YEAR | WEEK | ARTICLE) -->
      <div class="flex"
        :style="{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '24px'
        }">
        
        <!-- Year Block -->
        <div class="flex"
          :style="{
            flexDirection: 'column',
            gap: '4px'
          }">
          <div class="flex"
            :style="{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.12em',
              color: 'rgba(11, 18, 32, 0.45)'
            }">
            YEAR
          </div>
          <div class="flex"
            :style="{
              fontSize: '22px',
              fontWeight: '600',
              color: 'rgba(11, 18, 32, 0.88)'
            }">
            {{ new Date().getFullYear() }}
          </div>
        </div>

        <!-- Divider 1 -->
        <div class="flex"
          :style="{
            width: '1px',
            height: '40px',
            backgroundColor: 'rgba(11, 18, 32, 0.1)'
          }">
        </div>
        
        <!-- Week Block -->
        <div class="flex"
          :style="{
            flexDirection: 'column',
            gap: '4px'
          }">
          <div class="flex"
            :style="{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.12em',
              color: 'rgba(11, 18, 32, 0.45)'
            }">
            WEEK
          </div>
          <div class="flex"
            :style="{
              fontSize: '22px',
              fontWeight: '600',
              color: 'rgba(11, 18, 32, 0.88)'
            }">
            第{{ Math.ceil((((new Date()) - (new Date(new Date().getFullYear(), 0, 1))) / 86400000 + (new Date(new Date().getFullYear(), 0, 1)).getDay() + 1) / 7) }}周
          </div>
        </div>

        <!-- Divider 2 -->
        <div class="flex"
          :style="{
            width: '1px',
            height: '40px',
            backgroundColor: 'rgba(11, 18, 32, 0.1)'
          }">
        </div>
        
        <!-- Article Block -->
        <div class="flex"
          :style="{
            flexDirection: 'column',
            gap: '4px'
          }">
          <div class="flex"
            :style="{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.12em',
              color: 'rgba(11, 18, 32, 0.45)'
            }">
            ARTICLE
          </div>
          <div class="flex"
            :style="{
              fontSize: '22px',
              fontWeight: '600',
              color: 'rgba(11, 18, 32, 0.88)'
            }">
            <template v-for="(part, partIdx) in content[1]" :key="partIdx">
              <span class="flex"
                :style="{ 
                  color: part.type === 'accent' ? (accentColors?.[1] ?? '#E67E22') : 'rgba(11, 18, 32, 0.88)',
                  fontWeight: part.type === 'accent' ? '700' : '600'
                }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </div>
        
      </div>

      <!-- Row 3: Progress Bars -->
      <div class="flex"
        :style="{
          flexDirection: 'column',
          gap: '8px',
          marginTop: '4px'
        }">
        
        <!-- Year Progress -->
        <div class="flex"
          :style="{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px'
          }">
          <div class="flex"
            :style="{
              fontSize: '13px',
              fontWeight: '500',
              color: 'rgba(11, 18, 32, 0.5)',
              width: '56px',
              flexShrink: '0'
            }">
            本年剩余
          </div>
          <div class="flex"
            :style="{
              fontSize: '16px',
              fontWeight: '700',
              color: 'rgba(11, 18, 32, 0.85)',
              width: '40px',
              flexShrink: '0'
            }">
            {{ Math.round((1 - (((new Date()) - (new Date(new Date().getFullYear(), 0, 1))) / 86400000) / (((new Date(new Date().getFullYear(), 11, 31)) - (new Date(new Date().getFullYear(), 0, 1))) / 86400000 + 1)) * 100) }}%
          </div>
          <div class="flex"
            :style="{
              flex: '1',
              height: '12px',
              backgroundColor: 'rgba(11, 18, 32, 0.08)',
              overflow: 'hidden'
            }">
            <div class="flex"
              :style="{
                width: \`\${Math.round((1 - (((new Date()) - (new Date(new Date().getFullYear(), 0, 1))) / 86400000) / (((new Date(new Date().getFullYear(), 11, 31)) - (new Date(new Date().getFullYear(), 0, 1))) / 86400000 + 1)) * 100)}%\`,
                height: '100%',
                backgroundColor: 'rgba(11, 18, 32, 0.75)'
              }">
            </div>
          </div>
        </div>
        
        <!-- Month Progress -->
        <div class="flex"
          :style="{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px'
          }">
          <div class="flex"
            :style="{
              fontSize: '13px',
              fontWeight: '500',
              color: 'rgba(11, 18, 32, 0.5)',
              width: '56px',
              flexShrink: '0'
            }">
            本月剩余
          </div>
          <div class="flex"
            :style="{
              fontSize: '16px',
              fontWeight: '700',
              color: 'rgba(11, 18, 32, 0.85)',
              width: '40px',
              flexShrink: '0'
            }">
            {{ Math.round((1 - (new Date().getDate()) / (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).getDate()) * 100) }}%
          </div>
          <div class="flex"
            :style="{
              flex: '1',
              height: '12px',
              backgroundColor: 'rgba(11, 18, 32, 0.08)',
              overflow: 'hidden'
            }">
            <div class="flex"
              :style="{
                width: \`\${Math.round((1 - (new Date().getDate()) / (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).getDate()) * 100)}%\`,
                height: '100%',
                backgroundColor: 'rgba(11, 18, 32, 0.75)'
              }">
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Right: Ticket Stub (Vertical Character Stack) -->
    <div class="flex"
      :style="{
        width: '80px',
        height: '100%',
        flexShrink: '0',
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center'
      }">
      <!-- Vertical character stack -->
      <div class="flex"
        :style="{
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          fontSize: '24px',
          fontWeight: '300',
          color: '#666666'
        }">
        <template v-for="(char, idx) in (stubText ?? 'IMGX').split('')" :key="idx">
          <span class="flex">{{ char }}</span>
        </template>
      </div>
    </div>

  </div>
</div>`

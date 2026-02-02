/**
 * Pixel Matrix Template
 * 像素方格矩阵模板 - 用于渲染像素风格的卡通形象和日期
 */

// IMGX 字母像素图案 - 7行 x 23列 (4个字母，每个5列宽，间距1列)
// '#FFFFFF' = 白色填充
// '' = 透明
export const IMGX_LETTERS_MATRIX = [
  ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '', '', '', '#FFFFFF'],
  ['', '', '#FFFFFF', '', '', '', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '', '', '#FFFFFF'],
  ['', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '#FFFFFF', '', '#FFFFFF', '', '#FFFFFF', '', '', '', '', '', '', '#FFFFFF', '', '#FFFFFF', ''],
  ['', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '', '', '', '#FFFFFF', '', ''],
  ['', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', '#FFFFFF', '', '#FFFFFF', ''],
  ['', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '#FFFFFF', '', '', '', '#FFFFFF'],
  ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '', '', '', '#FFFFFF'],
]

// ZOTEPAD 字母 Emoji 版本 - 7个字母，O 完全填满 emoji
// 每个字母 5 列宽，字母之间 1 列间隔
// Z = 紫色, O = 🤩 星星眼 (填满), T = 蓝绿色, E = 橙色, P = 粉色, A = 青色, D = 黄色
export const ZOTEPAD_EMOJI_MATRIX = [
  // Row 1: Z O T E P A D
  ['#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '#1ABC9C', '#1ABC9C', '#1ABC9C', '#1ABC9C', '#1ABC9C', '', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '', '#E91E63', '#E91E63', '#E91E63', '#E91E63', '', '', '', '#00BCD4', '#00BCD4', '#00BCD4', '', '', '#F1C40F', '#F1C40F', '#F1C40F', '#F1C40F', ''],
  // Row 2
  ['', '', '', '', '#9B59B6', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '', '', '', '', '', '#E91E63', '', '', '', '#E91E63', '', '#00BCD4', '', '', '', '#00BCD4', '', '#F1C40F', '', '', '', '#F1C40F'],
  // Row 3
  ['', '', '', '#9B59B6', '', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '', '', '#E91E63', '#E91E63', '#E91E63', '#E91E63', '', '', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '', '#F1C40F', '', '', '', '#F1C40F'],
  // Row 4
  ['', '', '#9B59B6', '', '', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '', '', '', '', '', '#E91E63', '', '', '', '', '', '#00BCD4', '', '', '', '#00BCD4', '', '#F1C40F', '', '', '', '#F1C40F'],
  // Row 5: Z O T E P A D 底部
  ['#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '', '#E91E63', '', '', '', '', '', '#00BCD4', '', '', '', '#00BCD4', '', '#F1C40F', '#F1C40F', '#F1C40F', '#F1C40F', ''],
]

// IMGX 字母 Emoji 版本 - 使用各种表情符号填充
// 使用格式: 'twemoji:icon-name'（仅支持 twemoji-face-icons.json 中的图标）
// '' = 透明
export const IMGX_LETTERS_EMOJI_MATRIX = [
  // Row 1: I 顶部, M 顶部, G 顶部, X 顶部
  ['twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', '', 'twemoji:grinning-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', '', 'twemoji:star-struck', '', '', '', 'twemoji:star-struck'],
  // Row 2
  ['', '', 'twemoji:beaming-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:grinning-face-with-smiling-eyes', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:cowboy-hat-face', '', '', '', '', '', 'twemoji:star-struck', '', '', '', 'twemoji:star-struck'],
  // Row 3
  ['', '', 'twemoji:beaming-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:cowboy-hat-face', '', '', '', '', '', '', 'twemoji:star-struck', '', 'twemoji:star-struck', ''],
  // Row 4: 中间行
  ['', '', 'twemoji:beaming-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:cowboy-hat-face', '', '', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', '', '', '', 'twemoji:star-struck', '', ''],
  // Row 5
  ['', '', 'twemoji:beaming-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:cowboy-hat-face', '', '', '', 'twemoji:cowboy-hat-face', '', '', 'twemoji:star-struck', '', 'twemoji:star-struck', ''],
  // Row 6
  ['', '', 'twemoji:beaming-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:cowboy-hat-face', '', '', '', 'twemoji:cowboy-hat-face', '', 'twemoji:star-struck', '', '', '', 'twemoji:star-struck'],
  // Row 7: I 底部, M 底部, G 底部, X 底部
  ['twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', 'twemoji:beaming-face-with-smiling-eyes', '', 'twemoji:grinning-face-with-smiling-eyes', '', '', '', 'twemoji:grinning-face-with-smiling-eyes', '', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', 'twemoji:cowboy-hat-face', '', 'twemoji:star-struck', '', '', '', 'twemoji:star-struck'],
]

// 数字像素图案 - 5行 x 3列
export const DIGIT_PATTERNS: Record<string, string[][]> = {
  '0': [
    ['#', '#', '#'],
    ['#', '', '#'],
    ['#', '', '#'],
    ['#', '', '#'],
    ['#', '#', '#'],
  ],
  '1': [
    ['', '#', ''],
    ['#', '#', ''],
    ['', '#', ''],
    ['', '#', ''],
    ['#', '#', '#'],
  ],
  '2': [
    ['#', '#', '#'],
    ['', '', '#'],
    ['#', '#', '#'],
    ['#', '', ''],
    ['#', '#', '#'],
  ],
  '3': [
    ['#', '#', '#'],
    ['', '', '#'],
    ['#', '#', '#'],
    ['', '', '#'],
    ['#', '#', '#'],
  ],
  '4': [
    ['#', '', '#'],
    ['#', '', '#'],
    ['#', '#', '#'],
    ['', '', '#'],
    ['', '', '#'],
  ],
  '5': [
    ['#', '#', '#'],
    ['#', '', ''],
    ['#', '#', '#'],
    ['', '', '#'],
    ['#', '#', '#'],
  ],
  '6': [
    ['#', '#', '#'],
    ['#', '', ''],
    ['#', '#', '#'],
    ['#', '', '#'],
    ['#', '#', '#'],
  ],
  '7': [
    ['#', '#', '#'],
    ['', '', '#'],
    ['', '', '#'],
    ['', '', '#'],
    ['', '', '#'],
  ],
  '8': [
    ['#', '#', '#'],
    ['#', '', '#'],
    ['#', '#', '#'],
    ['#', '', '#'],
    ['#', '#', '#'],
  ],
  '9': [
    ['#', '#', '#'],
    ['#', '', '#'],
    ['#', '#', '#'],
    ['', '', '#'],
    ['#', '#', '#'],
  ],
  '.': [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '#', ''],
  ],
}

export const PixelMatrixTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ 
    backgroundColor: bgColor ?? '#1a1a2e', 
    fontFamily: fontFamily ?? 'YouSheBiaoTiHei',
    padding: padding ?? '40px'
  }">
  
  <!-- 居中: 字母像素图 -->
  <div class="flex items-center justify-center">
    <div class="flex flex-col" :style="{ gap: (pixelGap ?? 2) + 'px' }">
      <div v-for="(row, rowIdx) in characterMatrix" :key="'char-row-' + rowIdx" 
        class="flex" :style="{ gap: (pixelGap ?? 2) + 'px' }">
        <template v-for="(cell, colIdx) in row" :key="'char-cell-' + rowIdx + '-' + colIdx">
          <div v-if="cell && cell.startsWith && cell.startsWith('data:')"
            class="flex"
            :style="{
              width: (pixelSize ?? 20) + 'px',
              height: (pixelSize ?? 20) + 'px',
              backgroundImage: \`url(\${cell})\`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              borderRadius: (pixelRounded ?? 2) + 'px'
            }">
          </div>
          <div v-else-if="cell"
            class="flex"
            :style="{
              width: (pixelSize ?? 20) + 'px',
              height: (pixelSize ?? 20) + 'px',
              backgroundColor: cell,
              borderRadius: (pixelRounded ?? 2) + 'px'
            }">
          </div>
          <div v-else
            class="flex"
            :style="{
              width: (pixelSize ?? 20) + 'px',
              height: (pixelSize ?? 20) + 'px',
              backgroundColor: 'transparent'
            }">
          </div>
        </template>
      </div>
    </div>
  </div>
</div>`

// 颜色配置接口
interface ColorRange {
  saturationRange?: [number, number];
  lightnessRange?: [number, number];
  hueRange?: [number, number];
}

// 文字颜色配置接口
interface TextColorOptions {
  darkColor?: string;
  lightColor?: string;
}

// 渐变色类型定义
export type GradientColors = [string, string];

// 定义基础色系范围
const COLOR_RANGES = [
  { name: 'red', range: [0, 30] },        // 红色系
  { name: 'orange', range: [30, 60] },    // 橙色系
  { name: 'yellow', range: [60, 90] },    // 黄色系
  { name: 'green', range: [90, 150] },    // 绿色系
  { name: 'cyan', range: [150, 210] },    // 青色系
  { name: 'blue', range: [210, 270] },    // 蓝色系
  { name: 'purple', range: [270, 330] },  // 紫色系
  { name: 'pink', range: [330, 360] }     // 粉红色系
];

const ACHROMATIC_RANGES = [
  { name: 'black', lightness: [0, 10] },
  { name: 'darkGray1', lightness: [10, 25] },
  { name: 'darkGray2', lightness: [25, 35] },
  { name: 'gray1', lightness: [35, 50] },
  { name: 'gray2', lightness: [50, 65] },
  { name: 'lightGray1', lightness: [65, 75] },
  { name: 'lightGray2', lightness: [75, 85] },
  { name: 'white', lightness: [85, 100] }
];

export function randomHexColor({ 
  saturationRange = [0, 100],  // 饱和度范围
  lightnessRange = [0, 100],   // 亮度范围
  hueRange = [0, 360]          // 色相范围
} = {}) {
  const h = Math.floor(Math.random() * (hueRange[1] - hueRange[0])) + hueRange[0];
  const s = Math.floor(Math.random() * (saturationRange[1] - saturationRange[0])) + saturationRange[0];
  const l = Math.floor(Math.random() * (lightnessRange[1] - lightnessRange[0])) + lightnessRange[0];
  
  // HSL 转 RGB
  const hslToRgb = (h:number, s:number, l:number) => {
    s /= 100;
    l /= 100;
    const k = (n:number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n:number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

  const rgb = hslToRgb(h, s, l);
  return rgb.map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

// 相邻色系渐变
export function randomAdjacentGradientColors():GradientColors {
  const baseHue = Math.floor(Math.random() * 360);
  const offset = 45 + Math.floor(Math.random() * 30);
  const secondHue = (baseHue + (Math.random() < 0.5 ? offset : -offset) + 360) % 360;
  
  return [
    randomHexColor({
      hueRange: [baseHue, baseHue],
      saturationRange: [70, 90],
      lightnessRange: [45, 65]
    }), 
    randomHexColor({
      hueRange: [secondHue, secondHue],
      saturationRange: [70, 90],
      lightnessRange: [45, 65]
    })
  ]
}

// 互补色渐变
export function randomComplementaryGradientColors():GradientColors {
  const baseHue = Math.floor(Math.random() * 360);
  const complementaryHue = (baseHue + 180) % 360;
  return [
    randomHexColor({
      hueRange: [baseHue, baseHue],
      saturationRange: [70, 90],
      lightnessRange: [45, 65]
    }),
    randomHexColor({
      hueRange: [complementaryHue, complementaryHue],
      saturationRange: [70, 90],
      lightnessRange: [45, 65]
    })
  ]
}

export function randomGradientColors(
  style: 'adjacent' | 'monochromatic' | 'complementary' = 'adjacent',
  count: number = 1,
  mode: 'light' | 'dark' | 'pure' = 'light'
): GradientColors[] {
  if (count === 1) {
    return [generateSingleGradient(style, mode)];
  }

  // 根据模式选择范围
  let ranges = [];
  switch (mode) {
    case 'pure':
      ranges = ACHROMATIC_RANGES.map(range => ({
        name: range.name,
        type: 'achromatic' as const,
        lightness: range.lightness
      }));
      break;
    case 'light':
    case 'dark':
      ranges = COLOR_RANGES.map(range => ({
        ...range,
        type: 'chromatic' as const
      }));
      break;
  }

  const shuffledRanges = [...ranges].sort(() => Math.random() - 0.5);
  const selectedRanges = shuffledRanges.slice(0, count);

  return selectedRanges.map(range => {
    if (range.type === 'achromatic') {
      const baseLightness = Math.floor(
        Math.random() * (range.lightness[1] - range.lightness[0])
      ) + range.lightness[0];
      
      return [
        randomHexColor({
          hueRange: [0, 0],
          saturationRange: [0, 10],
          lightnessRange: [baseLightness, baseLightness + 5]
        }),
        randomHexColor({
          hueRange: [0, 0],
          saturationRange: [0, 10],
          lightnessRange: [Math.max(0, baseLightness - 10), baseLightness]
        })
      ];
    }

    const lightnessRanges = mode === 'light' 
      ? { main: [45, 65], secondary: [35, 55] }
      : { main: [20, 35], secondary: [15, 30] };

    switch(style) {
      case 'monochromatic':
        const hue = Math.floor(Math.random() * (range.range[1] - range.range[0])) + range.range[0];
        return [
          randomHexColor({
            hueRange: [hue, hue],
            saturationRange: [70, 90],
            lightnessRange: lightnessRanges.main
          }),
          randomHexColor({
            hueRange: [hue, hue],
            saturationRange: [70, 90],
            lightnessRange: lightnessRanges.secondary
          })
        ];

      case 'complementary':
        const baseHue = Math.floor(Math.random() * (range.range[1] - range.range[0])) + range.range[0];
        const complementaryHue = (baseHue + 180) % 360;
        return [
          randomHexColor({
            hueRange: [baseHue, baseHue],
            saturationRange: [70, 90],
            lightnessRange: lightnessRanges.main
          }),
          randomHexColor({
            hueRange: [complementaryHue, complementaryHue],
            saturationRange: [70, 90],
            lightnessRange: lightnessRanges.secondary
          })
        ];

      case 'adjacent':
      default:
        const mainHue = Math.floor(Math.random() * (range.range[1] - range.range[0])) + range.range[0];
        const offset = 30 + Math.floor(Math.random() * 15);
        const adjacentHue = (mainHue + (Math.random() < 0.5 ? offset : -offset) + 360) % 360;
        return [
          randomHexColor({
            hueRange: [mainHue, mainHue],
            saturationRange: [70, 90],
            lightnessRange: lightnessRanges.main
          }),
          randomHexColor({
            hueRange: [adjacentHue, adjacentHue],
            saturationRange: [70, 90],
            lightnessRange: lightnessRanges.secondary
          })
        ];
    }
  });
}

function generateSingleGradient(
  style: 'adjacent' | 'monochromatic' | 'complementary',
  mode: 'light' | 'dark' | 'pure'
): GradientColors {
  if (mode === 'pure') {
    const range = ACHROMATIC_RANGES[Math.floor(Math.random() * ACHROMATIC_RANGES.length)];
    const baseLightness = Math.floor(
      Math.random() * (range.lightness[1] - range.lightness[0])
    ) + range.lightness[0];
    
    return [
      randomHexColor({
        hueRange: [0, 0],
        saturationRange: [0, 10],
        lightnessRange: [baseLightness, baseLightness + 5]
      }),
      randomHexColor({
        hueRange: [0, 0],
        saturationRange: [0, 10],
        lightnessRange: [Math.max(0, baseLightness - 10), baseLightness]
      })
    ];
  }

  const lightnessRanges = mode === 'light'
    ? { main: [45, 65], secondary: [35, 55] }
    : { main: [20, 35], secondary: [15, 30] };

  switch(style) {
    case 'monochromatic':
      const hue = Math.floor(Math.random() * 360);
      return [
        randomHexColor({
          hueRange: [hue, hue],
          saturationRange: [70, 90],
          lightnessRange: lightnessRanges.main
        }),
        randomHexColor({
          hueRange: [hue, hue],
          saturationRange: [70, 90],
          lightnessRange: lightnessRanges.secondary
        })
      ];

    case 'complementary':
      const baseHue = Math.floor(Math.random() * 360);
      const complementaryHue = (baseHue + 180) % 360;
      return [
        randomHexColor({
          hueRange: [baseHue, baseHue],
          saturationRange: [70, 90],
          lightnessRange: lightnessRanges.main
        }),
        randomHexColor({
          hueRange: [complementaryHue, complementaryHue],
          saturationRange: [70, 90],
          lightnessRange: lightnessRanges.secondary
        })
      ];

    case 'adjacent':
    default:
      const mainHue = Math.floor(Math.random() * 360);
      const offset = 30 + Math.floor(Math.random() * 15);
      const adjacentHue = (mainHue + (Math.random() < 0.5 ? offset : -offset) + 360) % 360;
      return [
        randomHexColor({
          hueRange: [mainHue, mainHue],
          saturationRange: [70, 90],
          lightnessRange: lightnessRanges.main
        }),
        randomHexColor({
          hueRange: [adjacentHue, adjacentHue],
          saturationRange: [70, 90],
          lightnessRange: lightnessRanges.secondary
        })
      ];
  }
}

// 明亮色值生成函数
export function randomBrightHexColor() {
  return randomHexColor({
    saturationRange: [70, 100],  // 高饱和度
    lightnessRange: [45, 65],    // 较高亮度
  });
}

// 暗色值生成函数
export function randomDarkHexColor() {
  return randomHexColor({
    saturationRange: [50, 80],   // 中高饱和度
    lightnessRange: [20, 40],    // 较低亮度
  });
}

// 计算颜色的亮度
export function getLuminance(hexColor: string) {
  // 确保输入是字符串且去除可能的 # 前缀
  const color = (typeof hexColor === 'string' ? hexColor : '000000').replace(/^#/, '');
  
  // 确保是有效的 6 位十六进制颜色值
  const validColor = color.length === 6 ? color : '000000';
  
  const rgb = validColor.match(/.{2}/g)
    ?.map(x => parseInt(x, 16)) ?? [0, 0, 0];
  
  // 使用相对亮度公式 (0.299R + 0.587G + 0.114B)
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}

// 获取单个背景色的文字颜色
export function getTextColor(
  bgColor: string, 
  options: TextColorOptions = {}
): string {
  const {
    darkColor = '1a1a1a',
    lightColor = 'f7f7f7'
  } = options;

  const luminance = getLuminance(bgColor);
  return luminance > 128 ? darkColor : lightColor;
}

// 获取渐变背景的文字颜色
export function getGradientTextColor(
  gradientColors: GradientColors,
  options: TextColorOptions = {}
): string {
  const [fromColor, toColor] = gradientColors;
  const avgLuminance = (getLuminance(fromColor) + getLuminance(toColor)) / 2;
  
  const {
    darkColor = '1a1a1a',
    lightColor = 'f7f7f7'
  } = options;

  return avgLuminance > 128 ? darkColor : lightColor;
}

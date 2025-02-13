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

// 生成渐变色
export function randomGradientColors(style: 'adjacent' | 'monochromatic' | 'complementary' = 'adjacent'): GradientColors {
  switch(style) {
    case 'monochromatic': // 同色系
      const hue = Math.floor(Math.random() * 360);
      return [randomHexColor({
        hueRange: [hue, hue],
        saturationRange: [70, 90],
        lightnessRange: [60, 70]
      }), randomHexColor({
        hueRange: [hue, hue],
        saturationRange: [70, 90],
        lightnessRange: [30, 40]
      })]
      
      
    case 'complementary': // 互补色
      return randomComplementaryGradientColors();
      
    case 'adjacent': // 相邻色
    default:
      return randomAdjacentGradientColors();
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
  const rgb = hexColor.match(/.{2}/g)
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

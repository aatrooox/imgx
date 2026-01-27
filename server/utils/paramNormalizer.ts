/**
 * 参数标准化工具
 * 用于处理 GET/POST 请求中的数组类型属性
 */

/**
 * 数组类型的样式属性列表
 * 这些属性在预设中以数组形式存储，用于按索引对应不同的行/元素
 */
const ARRAY_STYLE_PROPS = new Set([
  'fontSizes',
  'iconSizes',
  'colors',
  'accentColors',
  'aligns',
  'verticalAligns'
])

/**
 * 需要添加 # 前缀的颜色属性
 */
const COLOR_PROPS = new Set([
  'colors',
  'accentColors',
  'bgColor',
  'titleColor',
  'subtitleColor',
  'authorColor',
  'textWrapBgColor',
  'borderColor'
])

/**
 * 需要添加 px 后缀的尺寸属性（如果是数字）
 */
const SIZE_WITH_UNIT_PROPS = new Set([
  'fontSizes',
  'padding',
  'textWrapPadding',
  'borderWidth',
  'borderRadius'
])

/**
 * 纯数字类型的尺寸属性（不需要单位）
 */
const NUMBER_SIZE_PROPS = new Set([
  'iconSizes'
])

/**
 * 标准化单个值
 * @param key 属性名
 * @param value 属性值
 * @param propsSchema 属性 schema（可选，用于更精确的类型判断）
 */
function normalizeValue(key: string, value: any, propsSchema?: any[]): any {
  // 如果值是 null/undefined，直接返回
  if (value === null || value === undefined) {
    return value
  }

  // 如果是数组，递归处理数组中的每个元素
  if (Array.isArray(value)) {
    return value.map(v => normalizeValue(key, v, propsSchema))
  }

  // 转换为字符串处理
  const strValue = String(value).trim()

  // 处理颜色属性
  if (COLOR_PROPS.has(key)) {
    // 如果已经有 # 前缀，保持不变
    if (strValue.startsWith('#')) {
      return strValue
    }
    // 添加 # 前缀
    return `#${strValue}`
  }

  // 处理需要 px 单位的尺寸属性
  if (SIZE_WITH_UNIT_PROPS.has(key)) {
    // 如果已经有单位，保持不变
    if (/px|em|rem|%/.test(strValue)) {
      return strValue
    }
    // 纯数字，添加 px
    if (!isNaN(Number(strValue))) {
      return `${strValue}px`
    }
    return strValue
  }

  // 处理纯数字类型
  if (NUMBER_SIZE_PROPS.has(key)) {
    const num = Number(strValue)
    return isNaN(num) ? value : num
  }

  // 使用 propsSchema 进行类型判断（如果提供）
  if (propsSchema && propsSchema.length > 0) {
    const schemaItem = propsSchema.find((item: any) => item.key === key)
    if (schemaItem?.type === 'size') {
      const num = parseInt(strValue)
      return isNaN(num) ? value : num
    }
  }

  return value
}

/**
 * 标准化样式属性
 * 主要处理数组类型属性的转换
 * 
 * @param customStyleProps 用户传入的自定义样式属性
 * @param propsSchema 属性 schema（可选）
 * @returns 标准化后的样式属性
 */
export function normalizeStyleProps(
  customStyleProps: Record<string, any>,
  propsSchema?: any[]
): Record<string, any> {
  const normalized: Record<string, any> = {}

  for (const key in customStyleProps) {
    let value = customStyleProps[key]

    // 跳过空值
    if (value === null || value === undefined || value === '') {
      continue
    }

    // 处理数组类型属性
    if (ARRAY_STYLE_PROPS.has(key)) {
      // 如果已经是数组，直接使用（POST 请求可能直接传数组）
      if (Array.isArray(value)) {
        normalized[key] = value.map(v => normalizeValue(key, v, propsSchema))
      } else {
        // 字符串类型，需要转换为数组
        const strValue = String(value)
        
        // 尝试用逗号分割（支持 "120,80,60" 这种格式）
        if (strValue.includes(',')) {
          normalized[key] = strValue
            .split(',')
            .map(v => v.trim())
            .filter(v => v)
            .map(v => normalizeValue(key, v, propsSchema))
        } else {
          // 单个值，转换为单元素数组
          normalized[key] = [normalizeValue(key, strValue, propsSchema)]
        }
      }
    } else {
      // 非数组属性，直接标准化
      normalized[key] = normalizeValue(key, value, propsSchema)
    }
  }

  return normalized
}

/**
 * 检查是否是数组类型的样式属性
 */
export function isArrayStyleProp(key: string): boolean {
  return ARRAY_STYLE_PROPS.has(key)
}

// 请求参数 做一些基础的类型转换 - 生成图片
export const imgGenerateSchame = z.object({
  // 整体配置
  bgColor: z.string().optional(),
  ratio: z.string().optional().transform((str) => isNaN(Number(str)) ? 1 : Number(str)),
  padding: z.string().optional().default('30px'),
  fontFamily: z.string().optional().default('YouSheBiaoTiHei'),
  closeColorRandom: z.string().optional().transform( (str) => str === '0'),

  // 内容区域
  textWrapBgColor: z.string().optional(),
  textWrapShadow: z.string().optional(),
  textWrapPadding: z.string().optional(),
  textWrapRounded: z.string().optional(),

  // 可应用于每一行的配置
  color: z.string().optional(),
  accentColor: z.string().optional(),
  iconSize: z.string().optional().transform((str) => isNaN(Number(str)) ? 0 : Number(str)),
  fontSize: z.string().optional().transform((str) => isNaN(Number(str)) ? 30 : Number(str)),
  center: z.string().optional(),
})
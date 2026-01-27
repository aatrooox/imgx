# 质量检查清单

本文档提供 IMGX 模板和预设从开发到发布的完整质量检查清单。

---

## 📋 模板开发阶段检查

### 1. 模板文件结构检查

**文件位置和命名**
- [ ] 文件位置：`server/templates/[Name].ts`
- [ ] 文件名采用 PascalCase：`SimpleText.ts`, `MultiLine.ts`
- [ ] 导出常量名为 `[Name]Template`：`export const SimpleTextTemplate = ...`

**代码结构**
- [ ] 导出的是模板字符串（字符串类型，不是函数）
- [ ] 模板使用 Vue 3 语法（v-for, v-if, :style 等）
- [ ] 所有变量通过 `:style` 绑定而非硬编码

### 2. 标记和布局检查

**Flex 布局标记**
- [ ] 根元素包含 `w-full h-full flex`
- [ ] 容器元素包含 `class="flex"`
- [ ] 列容器添加 `flex-col`
- [ ] 行容器添加 `flex-wrap`（支持换行）
- [ ] 对齐用 `items-center justify-center` 等

**绑定检查**
- [ ] 背景色使用 `:style="{ backgroundColor: bgColor }"`
- [ ] 背景图使用 `:style="{ backgroundImage: bgImage }"`
- [ ] 文本颜色使用 `:style="{ color: colors[...] }"`
- [ ] 字号使用 `:style="{ fontSize: fontSizes[...] }"`
- [ ] 对齐用 `:class="aligns[...]"` 而非内联样式

### 3. 循环应用检查

**使用正确的循环方式**
- [ ] 外层循环用 `v-for="(line, lineIndex) in content"`
- [ ] 内层循环用 `v-for="(part, partIndex) in line"`
- [ ] 样式循环用 `lineIndex % colors.length`（按行）而非 `partIndex`
- [ ] 确保没有调用 undefined 的数组索引

**样式循环一致性**
- [ ] colors、fontSizes、aligns 的循环逻辑一致
- [ ] 所有 lineIndex 循环都用相同的 `%` 操作符
- [ ] 没有硬编码索引值（如 colors[0]）

### 4. Satori 兼容性检查

**支持的属性**
- [ ] 使用支持的 CSS 属性（color, fontSize, padding, borderRadius 等）
- [ ] 不使用不支持的属性（box-shadow, animation, transform 等）
- [ ] 颜色格式正确（十六进制 #RRGGBB 或 rgba）
- [ ] 尺寸单位完整（px, em 等）

**避免常见错误**
- [ ] 没有使用 `outline` 属性（用 border 替代）
- [ ] 没有使用 `box-shadow`（用 border 模拟）
- [ ] 文本影子使用完整格式：`textShadow: "0px 2px 4px rgba(0,0,0,0.3)"`
- [ ] 没有外部 URL（仅 base64）

### 5. 特殊内容检查

**条件渲染**
- [ ] `v-if="part.type === 'text'"` 正确检查
- [ ] `v-else-if="part.type === 'accent'"` 正确检查
- [ ] 没有遗漏的部分类型

**可选元素**
- [ ] 使用 `v-if="topIcon"` 检查图标是否存在
- [ ] 使用 `v-if="part.text"` 检查文本是否为空

---

## 📝 Preset 配置检查

### 6. Preset 基本信息检查

**元数据**
- [ ] `code` 字段是 3-4 位数字（如 "010", "0123"）
- [ ] `code` 与文件名一致：`presets/010.json` 中 code 为 "010"
- [ ] `name` 字段描述简洁清晰（如 "Simple Text", "Accent Template"）
- [ ] `template` 字段指向正确的模板 key

**尺寸配置**
- [ ] `size.width` 和 `size.height` 是正整数
- [ ] 常见尺寸比例：`1200x630` (1.91:1), `1200x510` (2.35:1), `1200x800` (1.5:1)
- [ ] `ratio` 字段与实际尺寸匹配（格式：`"width:height"`）

### 7. contentProps 检查

**结构正确性**
- [ ] 内容与模板中使用的变量名对应
- [ ] 如果模板使用数组，contentProps 提供数组
- [ ] 如果模板使用对象，contentProps 提供对象

**示例数据**
- [ ] 提供有意义的示例数据
- [ ] 示例数据能够正常展示所有功能
- [ ] 如果支持强调，示例包含 type: "text" 和 type: "accent"

### 8. styleProps 必需字段检查

**必需字段（所有模板）**
- [ ] `bgColor` - 背景纯色（如 "#FFFFFF"）
- [ ] `bgImage` - 背景渐变或纹理（如 "linear-gradient(...)"）
- [ ] `colors` - 文本颜色数组（如 ["#000000"]）
- [ ] `fontSizes` - 字号数组（如 ["64px", "48px"]）
- [ ] `aligns` - 对齐方式数组（如 ["justify-center"]）
- [ ] `fontFamily` - 字体名（如 "YouSheBiaoTiHei"）
- [ ] `padding` - 整体内边距（如 "60px"）

**支持 Accent 的额外字段**
- [ ] `accentColors` - 强调色数组（如 ["#4CAF50"]）
- [ ] `textWrapBgColor` - 文本行背景色（如 "transparent"）
- [ ] `textWrapPadding` - 文本行内边距（如 "0px"）

**其他可选字段**
- [ ] `verticalAligns` - 垂直对齐（如 ["center"]）
- [ ] `textShadow` - 文字投影（如 "0px 2px 4px rgba(0,0,0,0.3)"）
- [ ] `iconSizes` - 图标尺寸数组（图标模板）

### 9. styleProps 数据检查

**类型和格式**
- [ ] `bgColor` 是十六进制颜色字符串
- [ ] `bgImage` 是有效的 CSS 渐变字符串
- [ ] `colors` 是十六进制或 rgba 颜色字符串数组
- [ ] `fontSizes` 是带单位的字符串数组（"64px" 而非 64）
- [ ] `aligns` 是 Tailwind justify 类名数组
- [ ] `fontFamily` 是系统支持的字体名称

**数组一致性**
- [ ] `colors` 数组长度与预期行数匹配（或能循环覆盖）
- [ ] `fontSizes` 数组长度一致
- [ ] `aligns` 数组长度一致
- [ ] 如果模板需要，`accentColors` 也有相应长度

---

## 🧪 功能测试检查

### 10. 基础显示测试

**URL 访问**
- [ ] 访问 `/{code}/default` 能正常显示
- [ ] HTTP 状态码为 200（不是 404 或 500）
- [ ] 图片生成成功（不是空或错误页面）

**默认内容**
- [ ] 显示的文字是 contentProps 中的默认值
- [ ] 布局符合预期（居中/左右对齐等）
- [ ] 字体、大小、颜色符合 styleProps

### 11. 单行/多行内容测试

**单行测试**
- [ ] `/{code}/单行文本` 正常显示
- [ ] 文本在画布内，不溢出
- [ ] 对齐方式正确

**多行测试**
- [ ] `/{code}/第一行/第二行/第三行` 正常显示
- [ ] 每行独立显示（有行间距）
- [ ] 每行颜色、大小按 styleProps 循环应用
- [ ] 换行对齐符合预期

### 12. 强调文本测试（如适用）

**强调语法**
- [ ] `/{code}/普通*强调*文本` 能识别并高亮
- [ ] 强调文本样式符合设计（背景、颜色、边框等）
- [ ] 多个强调词都能正确处理

**多行强调**
- [ ] `/{code}/第一行/第二行有*强调*/第三行` 显示正确
- [ ] 只有标记的部分被高亮，其他部分正常

### 13. 样式参数覆盖测试

**颜色参数**
- [ ] `?bgColor=%23FF0000` 能覆盖背景色
- [ ] `?fontSizes=72px` 能覆盖字号（如果支持 GET 参数）

**字体参数**
- [ ] `?fontFamily=YouSheBiaoTiHei` 字体正确应用
- [ ] 字体在 Satori 支持范围内

**背景参数**
- [ ] `?bgImage=linear-gradient(...)` 渐变背景正确显示
- [ ] 渐变方向和颜色符合参数

### 14. 错误处理测试

**缺失字段**
- [ ] 如果 GET 参数缺失，使用默认值
- [ ] 不会导致渲染失败

**超长内容**
- [ ] 超长文本会换行或截断（不溢出）
- [ ] 保持布局完整

**特殊字符**
- [ ] 包含中文、Emoji、特殊符号的文本正常显示
- [ ] URL 编码正确处理

### 15. 视觉质量检查

**字体清晰度**
- [ ] 文字清晰可读（不模糊）
- [ ] 字体大小合适，易于识别

**颜色对比**
- [ ] 文字颜色与背景对比度高
- [ ] 强调部分足够突出

**布局整齐**
- [ ] 元素对齐整齐，无歪斜
- [ ] 间距均匀

**无异常**
- [ ] 没有残留的调试信息
- [ ] 没有超出画布的元素

---

## 🔍 前端集成检查

### 16. 代码集成检查

**模板注册**
- [ ] 模板在 `server/utils/image.ts` 中导入
- [ ] 模板在 `templateStrings` 对象中注册
- [ ] Key 名与 Preset 的 template 字段匹配

**Preset 位置**
- [ ] Preset JSON 文件放在 `presets/` 目录
- [ ] 文件名与 code 匹配（`010.json` for code "010"）
- [ ] JSON 格式有效（可通过 jq 验证）

**文件权限**
- [ ] 文件可读（644 权限或更开放）
- [ ] 服务器有读取权限

### 17. 开发服务器测试

**启动检查**
- [ ] `pnpm dev` 启动成功，无错误
- [ ] 开发服务器监听正确端口（通常 4573）

**热重载**
- [ ] 修改 Preset 后刷新页面显示新内容
- [ ] 修改模板后重启服务器生效
- [ ] 没有缓存问题（如必要清空缓存）

**日志检查**
- [ ] 开发服务器日志无 ERROR 或 WARN
- [ ] 浏览器 Console 无 Vue 警告
- [ ] 没有 Satori 渲染错误

---

## 📱 跨设备测试检查

### 18. 浏览器兼容性

**主流浏览器**
- [ ] Chrome/Chromium 显示正确
- [ ] Firefox 显示正确
- [ ] Safari 显示正确（如可用）
- [ ] Edge 显示正确（如可用）

**移动设备**
- [ ] 手机浏览器显示正确
- [ ] 平板浏览器显示正确
- [ ] 图片生成成功（不因设备限制失败）

### 19. 图片导出检查

**导出格式**
- [ ] 导出 PNG 格式正确
- [ ] 导出 JPG（如支持）质量可接受

**尺寸一致**
- [ ] 导出图片尺寸与 Preset size 一致
- [ ] 分辨率足够清晰（不模糊）

**文件大小**
- [ ] 文件大小合理（不过大）
- [ ] 支持高效传输和存储

---

## 📚 文档检查

### 20. 文档完整性

**创建者文档**
- [ ] 模板用途清晰说明
- [ ] contentProps 和 styleProps 说明完整
- [ ] 包含使用示例 URL
- [ ] 包含样式变体说明（如有）

**用户文档**
- [ ] Preset 名称直观
- [ ] 提供推荐用途
- [ ] 说明参数含义

**维护文档**
- [ ] 记录已知限制
- [ ] 记录改进建议

---

## ✅ 发布前最终检查

### 21. 完整性检查清单

在发布前，确保以下所有项目都标记为 ✅：

**模板和代码**
- [ ] 模板文件完整正确
- [ ] 模板正确注册
- [ ] 没有调试代码或注释

**配置文件**
- [ ] Preset JSON 格式有效
- [ ] 所有必需字段存在
- [ ] 没有多余或错误的字段

**测试**
- [ ] 基础功能测试通过
- [ ] 错误处理测试通过
- [ ] 视觉质量符合预期

**文档**
- [ ] README 或说明文档完整
- [ ] 包含使用示例
- [ ] 参数说明清晰

### 22. 提交检查

**代码质量**
- [ ] 代码风格一致
- [ ] 没有 TypeScript 错误
- [ ] 没有 linting 错误

**Git 提交**
- [ ] 提交信息描述清晰
- [ ] 提交包含所有相关文件
- [ ] 没有意外提交的文件

---

## 🎯 常见的检查项目快速索引

| 问题 | 检查项 | 蓝图参考 |
|------|--------|---------|
| Vue 警告 | 8 | troubleshooting.md |
| Flex 错误 | 2, 4 | Satori 约束 |
| 文字不显示 | 11, 14 | 常见模式 |
| 颜色不对 | 9, 13 | Props 系统 |
| 渐变不显示 | 9, 13 | blueprint-with-gradient |
| 图标错误 | 特殊内容 | blueprint-with-icons |
| 模板不存在 | 16 | troubleshooting |

---

## 📊 检查统计

| 阶段 | 项数 | 关键性 |
|------|-----|--------|
| 模板开发 | 5 | 🔴 高 |
| Preset 配置 | 4 | 🔴 高 |
| 功能测试 | 6 | 🟡 中 |
| 集成测试 | 2 | 🟡 中 |
| 交叉测试 | 2 | 🟢 低 |
| 文档 | 1 | 🟢 低 |
| 发布 | 2 | 🔴 高 |

**总计：22 个检查项**

---

## 🔗 快速参考链接

- [Satori 约束](satori-constraints.md) - CSS 支持清单
- [Props 系统](props-system.md) - 数据结构说明
- [常见模式](patterns.md) - 实现参考
- [故障排除](troubleshooting.md) - 问题解决
- [所有蓝图](README.md) - 完整示例

---

**记住：好的检查流程能预防 90% 的问题！**


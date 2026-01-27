# 故障排除指南

本文档提供 IMGX 模板开发中常见问题的诊断和解决方案。

---

## 🔍 问题诊断流程

1. 识别错误现象（无显示、样式错、警告等）
2. 查看浏览器控制台/开发服务器日志
3. 对比对应问题部分
4. 按步骤执行解决方案
5. 验证修复效果

---

## ❌ 常见问题与解决方案

### 问题 1: 模板完全不显示（400 或 500 错误）

**症状**
- 访问 http://localhost:4573/010/test 返回：404 Not Found 或内部错误

**检查清单**
- 预设代码是否正确注册？（检查 presets/ 目录）
- JSON 格式是否有效？
- 模板文件是否存在？（server/templates/SimpleText.ts）
- 模板是否在 image.ts 中注册？
- 开发服务器是否重启？

**解决步骤**
1. 停止开发服务器：Ctrl+C
2. 检查 preset 文件存在且有效
3. 检查模板导入和注册
4. 重启开发服务器：pnpm dev
5. 访问测试 URL

---

### 问题 2: Vue 警告 - 属性未定义

**症状**
```
[Vue warn]: Property "textWrapPadding" was accessed during render but is not defined on instance.
```

**原因**
- Preset JSON 的 styleProps 缺少模板中使用的属性

**解决方案**
在 styleProps 中补充缺失属性（即使不使用，也要包含默认值）：

```json
{
  "styleProps": {
    "bgColor": "#FFF",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#000"],
    "accentColors": ["#4CAF50"],
    "fontSizes": ["64px"],
    "aligns": ["justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px"
  }
}
```

---

### 问题 3: Satori 渲染错误 - Flex 显示错误

**症状**
```
Error: <span> must have display: flex
Error: <div> has no display property
```

**原因**
- Satori 要求所有布局元素必须是 display:flex，且必须通过 class="flex" 显式设置

**解决方案**
添加 class="flex" 到所有 div 和 span：

```html
<!-- 正确示例 -->
<div class="flex flex-col items-center justify-center">
  <span class="flex">{{ text }}</span>
</div>
```

---

### 问题 4: 样式不生效 - 属性无法识别

**症状**
- 背景色正确，但 border-radius、box-shadow 等不生效

**原因**
- Satori 不支持所有 CSS 属性

**常见不支持属性及解决方案**

| 属性 | 解决方案 |
|------|---------|
| box-shadow | 使用 border 模拟 |
| text-shadow | 支持，但要完整格式 |
| animation | 不支持（静态渲染） |
| backdrop-filter | 不支持 |
| outline | 使用 border 替代 |

---

### 问题 5: 文字换行问题 - 单行显示或溢出

**症状**
- 多行内容显示在一行上，或溢出画布

**原因**
1. 容器没有 flex-wrap
2. 容器没有明确的宽度限制
3. 内容数据结构不正确

**解决方案**
```html
<!-- 正确：支持换行 -->
<div class="flex flex-wrap w-full">
  <!-- 内容 -->
</div>

<!-- 正确：按行布局 -->
<div v-for="(line, idx) in content" :key="idx" class="flex flex-wrap w-full">
  <!-- 每行内容 -->
</div>
```

---

### 问题 6: 文字无法识别 - 颜色或大小错误

**症状**
- 字体太小看不清，颜色不符合预期，或 fontSizes 无效

**原因**
1. fontSizes 数据类型错误（数字 vs 字符串）
2. colors 格式不对（RGB vs 十六进制）
3. 循环索引计算错误

**解决方案**
```json
<!-- 错误 -->
"fontSizes": [64, 48, 36]

<!-- 正确 -->
"fontSizes": ["64px", "48px", "36px"]
```

---

### 问题 7: 图标无法显示 - 图片加载失败

**症状**
- img 标签无显示，或出现加载错误

**原因**
1. 使用外部 URL（Satori 不支持）
2. Base64 编码格式错误
3. SVG 编码不正确

**解决方案**
```javascript
// 错误：外部 URL
"topIcon": "https://example.com/icon.png"

// 正确：Base64 Data URL
"topIcon": "data:image/png;base64,iVBORw0KGgo..."

// 正确：SVG 编码
"topIcon": "data:image/svg+xml,%3Csvg%3E...%3C/svg%3E"
```

---

### 问题 8: 强调文本显示不正确

**症状**
- 强调文本没有高亮效果，或背景色/颜色错误

**原因**
1. Preset 中缺少 accentColors 字段
2. 模板中 accent span 缺少 class="flex"
3. content 数据中没有标记 type: "accent"

**检查清单**
- Preset 包含 accentColors？
- 模板中 accent span 有 class="flex"？
- Content 正确标记了 accent？

---

### 问题 9: 渐变背景不显示

**症状**
- 背景显示为纯色或透明，而非预期的渐变

**原因**
1. bgImage 语法错误
2. 百分比未按递增顺序
3. Satori 不支持该渐变格式

**解决方案**
```json
<!-- 错误 -->
"bgImage": "linear-gradient(135deg, #667eea, #764ba2)"

<!-- 正确 -->
"bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

<!-- 正确：方向名称 -->
"bgImage": "linear-gradient(to right, #FF5722 0%, #FFC107 100%)"
```

---

### 问题 10: 预设加载失败 - 模板不存在错误

**症状**
```
Error: Template "XYZ" not found in templateStrings
```

**原因**
1. Preset 中 template 字段值与注册的 key 不匹配
2. 模板文件未导入
3. 服务器未重启

**解决方案**
```typescript
// server/utils/image.ts

// 第1步：导入模板
import { SimpleTextTemplate } from '../templates/SimpleText'

// 第2步：注册到 templateStrings 对象
const templateStrings: Record<string, string> = {
  'SimpleText': SimpleTextTemplate  // Key 必须与 preset 匹配
}
```

```json
// presets/010.json
{
  "template": "SimpleText"  // 必须与上面的 Key 一致
}
```

---

## 📋 测试与验证步骤

### 快速测试流程

```bash
# 1. 启动开发服务器
pnpm dev

# 2. 测试基础 URL
curl http://localhost:4573/010/default

# 3. 查看日志输出
# （检查是否有 Vue 警告或 Satori 错误）

# 4. 打开浏览器访问
open http://localhost:4573/010/test

# 5. 打开开发者工具（F12）
# 检查 Console 中的错误和警告
```

---

## 🔧 调试技巧

### 添加日志输出

在模板中添加调试信息（临时，检查数据是否传递正确）：

```html
<div style="fontSize: 12px; color: #999;">
  检查数据内容...
</div>
```

### 检查浏览器开发者工具

| 工具 | 用途 |
|------|------|
| **Console** | 查看 Vue 警告和错误 |
| **Network** | 检查请求/响应状态 |
| **Elements/Inspector** | 查看渲染后的 HTML 结构 |
| **Performance** | 分析渲染性能 |

---

## ✅ 问题排查清单

在报告问题前，检查以下项目：

- [ ] 预设 JSON 格式有效
- [ ] 模板文件存在
- [ ] 模板在 image.ts 中正确导入和注册
- [ ] Preset 的 template 字段与注册的 key 匹配
- [ ] 所有 div/span 有 class="flex"
- [ ] fontSizes 是字符串数组且包含单位
- [ ] colors 使用十六进制或 rgba 格式
- [ ] styleProps 包含所有必需字段
- [ ] 开发服务器已重启
- [ ] 浏览器已清空缓存（Ctrl+Shift+Del）

---

## 📚 相关参考

- [Satori 约束](satori-constraints.md) - 了解支持的 CSS
- [Props 系统](props-system.md) - 理解数据结构
- [常见模式](patterns.md) - 参考正确的实现方式
- [所有蓝图](README.md) - 查看完整示例


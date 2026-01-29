# Satori 库约束

Satori 是将 HTML/CSS 转换为 SVG 的渲染引擎，但**不是完整的浏览器引擎**，因此有严格的限制。

**最后更新：2026-01-29（基于 Satori 官方文档）**

---

## ✅ 必须做到

### 1. 每个元素必须是 Flexbox

**规则：所有 `<div>` 和 `<span>` 必须有 `display: flex`**

```html
<!-- ✅ 正确 -->
<div class="flex">内容</div>
<span class="flex">文本</span>

<!-- ❌ 错误 -->
<div>内容</div>
<span>文本</span>
```

**原因：**
- Satori 只实现了 Flexbox 布局引擎
- 不支持 `display: block`、`display: inline` 等
- 缺少 `flex` 类会导致渲染失败

**错误提示：**
```
Error: <div> must have display: flex
Error: <span> must have display: flex
```

---

### 2. 根元素必须占满容器

**规则：根元素必须使用 `w-full h-full`**

```html
<!-- ✅ 正确 -->
<div class="w-full h-full flex">
  <!-- 内容 -->
</div>

<!-- ❌ 错误 -->
<div class="flex">
  <!-- 内容会被裁剪 -->
</div>
```

**原因：**
- Satori 渲染到指定尺寸的画布（如 1200×630）
- 根元素不占满会导致内容被裁剪
- `w-full h-full` 确保使用全部空间

---

### 3. 使用 Tailwind CSS 类名 + 内联样式

**推荐组合：**

```html
<!-- ✅ 布局用 Tailwind，动态样式用 :style -->
<div 
  class="flex flex-col items-center justify-center"
  :style="{
    backgroundColor: bgColor,
    padding: padding
  }"
>
```

**支持的 Tailwind 工具类：**
- **Flexbox**: `flex`, `flex-col`, `flex-row`, `flex-wrap`
- **对齐**: `items-center`, `items-start`, `items-end`, `justify-center`, `justify-between`
- **尺寸**: `w-full`, `h-full`, `w-[200px]`, `h-[100px]`
- **间距**: `gap-4`, `space-x-2`
- **文本**: `text-center`, `text-nowrap`, `font-bold`

**不支持的 Tailwind 类：**
- ❌ 动画: `animate-*`
- ❌ 过渡: `transition-*`

---

### 4. 模板字符串插值语法

**规则：使用 `\${variable}` 而非 `{{variable}}`**

```typescript
// ✅ 正确：模板字符串插值
export const MyTemplate = `<div class="flex">
  \${content}
</div>`

// ❌ 错误：Vue 模板插值（在字符串中无效）
export const MyTemplate = `<div class="flex">
  {{content}}
</div>`
```

**动态绑定：使用 Vue 语法**

```typescript
export const MyTemplate = `<div 
  class="flex"
  :style="{color: colors[0]}"
>
  {{ part.text }}
</div>`
```

**注意：**
- 在模板字符串**外部**用 `\${}`（JavaScript 插值）
- 在模板字符串**内部**用 `{{ }}` 和 `:style`（Vue 语法）

---

## ❌ 有限制的功能

### 1. transform（变换）

✅ **支持：** translate, rotate, scale, skew
❌ **不支持：** 3D transforms

```html
<!-- ✅ 支持 -->
<div :style="{transform: 'translate(10px, 20px)'}">
<div :style="{transform: 'rotate(45deg)'}">
<div :style="{transform: 'scale(1.2)'}">
<div :style="{transform: 'skewX(10deg)'}">

<!-- ❌ 不支持 3D -->
<div :style="{transform: 'rotateX(45deg)'}">
<div :style="{transform: 'translate3d(0, 0, 10px)'}">
```

**transformOrigin**: 支持单值和双值语法（相对和绝对值）

---

### 2. 外部图片

```html
<!-- ❌ 不支持 -->
<img src="https://example.com/image.png" />
<img src="/local/image.png" />

<!-- ✅ 必须用 base64 dataURL -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." />
```

**原因：**
- Satori 在服务器端渲染，无法发起网络请求
- 必须内联所有资源

**解决方案：**
- 将图片转为 base64 编码
- 使用 SVG 字符串（可直接内联）
- 使用 Unicode 字符/Emoji 代替图标

---

### 3. z-index（层叠顺序）

```html
<!-- ❌ 不支持 -->
<div :style="{zIndex: 10}">
```

**替代方案：**
- 通过 DOM 顺序控制层级
- 后渲染的元素在上层

```html
<!-- ✅ 通过顺序控制 -->
<div class="flex">
  <div>背景层</div>
  <div>前景层</div>  <!-- 这个在上面 -->
</div>
```

---

### 4. calc() 不支持

```html
<!-- ❌ 不支持 -->
<div :style="{width: 'calc(100% - 20px)'}">
```

**替代方案：**
- 在 JavaScript 中预先计算
- 使用 Flexbox 自动布局

---

### 5. currentColor 限制

✅ **仅支持在 `color` 属性中使用**
❌ **在其他属性中不可用**

---

### 6. 嵌套 Vue 组件

```typescript
// ❌ 不支持
import MyComponent from './MyComponent.vue'

export const MyTemplate = `<div class="flex">
  <MyComponent />  // 无法识别
</div>`
```

**原因：**
- 模板字符串只能包含原生 HTML 标签
- Satori 不理解 Vue 组件系统

**替代方案：**
- 将组件内容直接写在模板字符串中
- 使用 `v-if`/`v-for` 等 Vue 指令实现逻辑

---

## 🎯 支持的 CSS 属性完整清单

### Display & Position

| 属性 | 支持的值 | 备注 |
|------|----------|------|
| `display` | `flex`, `contents`, `none` | 默认为 `flex` |
| `position` | `relative`, `static`, `absolute` | 默认为 `relative` |
| `top`, `right`, `bottom`, `left` | ✅ 支持 | 定位属性 |

### 尺寸（Size）

| 属性 | 支持情况 | 备注 |
|------|----------|------|
| `width`, `height` | ✅ 支持 | |
| `minWidth`, `minHeight` | ✅ 支持 | ❌ 不支持 `min-content`, `max-content`, `fit-content` |
| `maxWidth`, `maxHeight` | ✅ 支持 | ❌ 不支持 `min-content`, `max-content`, `fit-content` |

### 间距（Spacing）

| 属性 | 支持情况 |
|------|----------|
| `margin` | ✅ 支持（包括 `marginTop`, `marginRight` 等） |
| `padding` | ✅ 支持（包括 `paddingTop`, `paddingRight` 等） |

### 边框（Border）

| 属性 | 支持的值 | 备注 |
|------|----------|------|
| `borderWidth` | ✅ 支持 | 包括各方向 |
| `borderStyle` | `solid`, `dashed` | 默认 `solid` |
| `borderColor` | ✅ 支持 | 包括各方向 |
| `border` | ✅ 支持 | 简写形式，如 `1px solid gray` |
| `borderRadius` | ✅ 支持 | 支持简写和各角，如 `5px`, `50% / 5px` |

### Flexbox 布局

| 属性 | 支持的值 | 默认值 |
|------|----------|--------|
| `flexDirection` | `column`, `row`, `row-reverse`, `column-reverse` | `row` |
| `flexWrap` | `wrap`, `nowrap`, `wrap-reverse` | `wrap` |
| `flexGrow` | ✅ 支持 | |
| `flexShrink` | ✅ 支持 | |
| `flexBasis` | ✅ 支持 | ❌ 不支持 `auto` |
| `alignItems` | `stretch`, `center`, `flex-start`, `flex-end`, `baseline`, `normal` | `stretch` |
| `alignContent` | ✅ 支持 | |
| `alignSelf` | ✅ 支持 | |
| `justifyContent` | ✅ 支持 | |
| `gap` | ✅ 支持 | |

### 字体（Font）

| 属性 | 支持情况 |
|------|----------|
| `fontFamily` | ✅ 支持 |
| `fontSize` | ✅ 支持 |
| `fontWeight` | ✅ 支持 |
| `fontStyle` | ✅ 支持 |

### 文本（Text）

| 属性 | 支持的值 | 默认值 |
|------|----------|--------|
| `color` | ✅ 支持 | |
| `tabSize` | ✅ 支持 | |
| `textAlign` | `start`, `end`, `left`, `right`, `center`, `justify` | `start` |
| `textTransform` | `none`, `lowercase`, `uppercase`, `capitalize` | `none` |
| `textOverflow` | `clip`, `ellipsis` | `clip` |
| `textDecoration` | 支持 `underline`, `line-through`；样式 `dotted`, `dashed`, `double`, `solid` | |
| `textShadow` | ✅ 支持 | |
| `lineHeight` | ✅ 支持 | |
| `letterSpacing` | ✅ 支持 | |
| `whiteSpace` | `normal`, `pre`, `pre-wrap`, `pre-line`, `nowrap` | `normal` |
| `wordBreak` | `normal`, `break-all`, `break-word`, `keep-all` | `normal` |
| `textWrap` | `wrap`, `balance` | `wrap` |
| `lineClamp` | ✅ 支持 | 多行文本截断 |

### 背景（Background）

| 属性 | 支持情况 | 备注 |
|------|----------|------|
| `backgroundColor` | ✅ 支持 | 单一值 |
| `backgroundImage` | ✅ 支持 | `linear-gradient`, `radial-gradient`, `repeating-linear-gradient`, `repeating-radial-gradient`, `url` (base64) |
| `backgroundPosition` | ✅ 支持 | 单一值 |
| `backgroundSize` | ✅ 支持 | 双值语法，如 `10px 20%` |
| `backgroundClip` | `border-box`, `text` | |
| `backgroundRepeat` | `repeat`, `repeat-x`, `repeat-y`, `no-repeat` | 默认 `repeat` |

### 变换（Transform）

| 属性 | 支持情况 | 备注 |
|------|----------|------|
| `transform` | ✅ 支持 | `translate`, `translateX`, `translateY`, `rotate`, `scale`, `scaleX`, `scaleY`, `skew`, `skewX`, `skewY` |
| `transformOrigin` | ✅ 支持 | 单值和双值语法（相对和绝对值） |
| ❌ 3D transforms | 不支持 | `rotateX`, `translate3d` 等 |

### 对象适配（Object Fit）

| 属性 | 支持的值 | 默认值 |
|------|----------|--------|
| `objectFit` | `contain`, `cover`, `none` | `none` |
| `objectPosition` | 关键字：`top`, `bottom`, `left`, `right`, `center` 及组合 | `center` |

### 其他

| 属性 | 支持情况 |
|------|----------|
| `opacity` | ✅ 支持 |
| `boxSizing` | ✅ 支持 |
| `boxShadow` | ✅ 支持 |
| `overflow` | `visible`, `hidden` (默认 `visible`) |
| `filter` | ✅ 支持 |
| `clipPath` | ✅ 支持 |

### 遮罩（Mask）

| 属性 | 支持情况 |
|------|----------|
| `maskImage` | ✅ 支持 `linear-gradient`, `radial-gradient`, `url` |
| `maskPosition` | ✅ 支持 |
| `maskSize` | ✅ 支持双值语法，如 `10px 20%` |
| `maskRepeat` | `repeat`, `repeat-x`, `repeat-y`, `no-repeat` (默认 `repeat`) |

### WebKit 特性

| 属性 | 支持情况 |
|------|----------|
| `WebkitTextStrokeWidth` | ✅ 支持 |
| `WebkitTextStrokeColor` | ✅ 支持 |

---

## 🔧 调试技巧

### 常见错误模式

#### 错误 1: 缺少 flex

```
Error: <div> must have display: flex
```

**解决：** 给所有 `<div>` 和 `<span>` 添加 `class="flex"`

#### 错误 2: 使用不支持的属性

```
渲染成功但样式缺失
```

**解决：** 检查是否使用了不支持的属性值或 3D transforms

#### 错误 3: 图片加载失败

```
Error: Failed to load image
```

**解决：** 确保图片是 base64 dataURL

---

## 📚 相关资源

- [Satori 官方文档](https://github.com/vercel/satori)
- [Satori CSS 支持列表](https://github.com/vercel/satori#css)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Satori Playground](https://og-playground.vercel.app/)

---

## 📝 重要限制总结

1. ❌ **不支持 3D transforms**
2. ❌ **不支持 z-index**（通过 DOM 顺序控制）
3. ❌ **不支持 calc()**
4. ❌ **currentColor** 仅支持在 `color` 属性中
5. ❌ **min-content**, **max-content**, **fit-content** 不支持在 min/max 尺寸中
6. ❌ **动画和过渡**（Satori 生成静态图片）
7. ✅ **支持 boxShadow**（与旧版本不同）
8. ✅ **支持 filter**（与旧版本不同）
9. ✅ **支持 transform**（2D only）
10. ✅ **支持 overflow, clipPath, lineClamp, mask, textWrap, wordBreak, whiteSpace**

---

**记住：Satori 不是浏览器，只支持 Flexbox + 精选的 CSS 属性子集。**

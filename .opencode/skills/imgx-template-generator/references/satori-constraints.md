# Satori 库约束

Satori 是将 HTML/CSS 转换为 SVG 的渲染引擎，但**不是完整的浏览器引擎**，因此有严格的限制。

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
- **间距**: `gap-4`, `space-x-2`（部分支持）
- **文本**: `text-center`, `font-bold`（部分需要 inline style）

**不支持的 Tailwind 类：**
- ❌ 动画: `animate-*`
- ❌ 过渡: `transition-*`
- ❌ 阴影: `shadow-*`
- ❌ 滤镜: `blur-*`, `brightness-*`

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

## ❌ 不能使用

### 1. box-shadow（阴影）

```html
<!-- ❌ 不支持 -->
<div :style="{boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}">
```

**替代方案：**
- 使用边框模拟浅阴影
- 使用背景渐变创造深度感
- 接受 Satori 的限制

```html
<!-- ✅ 替代：边框模拟阴影 -->
<div :style="{
  border: '1px solid rgba(0,0,0,0.1)',
  borderBottom: '3px solid rgba(0,0,0,0.15)'
}">
```

---

### 2. transform（变换）

```html
<!-- ❌ 不支持 -->
<div :style="{transform: 'rotate(45deg)'}">
<div :style="{transform: 'scale(1.2)'}">
```

**替代方案：**
- 重新设计布局避免旋转需求
- 使用静态图标（已旋转的 SVG/图片）

---

### 3. filter（滤镜）

```html
<!-- ❌ 不支持 -->
<div :style="{filter: 'blur(10px)'}">
<div :style="{filter: 'brightness(0.8)'}">
<div :style="{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'}">
```

**注意：**
- `drop-shadow` 也不支持（虽然是 CSS 滤镜的阴影实现）

---

### 4. animations & transitions（动画和过渡）

```html
<!-- ❌ 不支持 -->
<div :style="{animation: 'spin 1s linear infinite'}">
<div :style="{transition: 'all 0.3s ease'}">
```

**原因：**
- Satori 渲染静态图片（SVG → PNG）
- 图片无法展示动画效果

---

### 5. 外部图片

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

### 6. z-index（层叠顺序）

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

### 7. 嵌套 Vue 组件

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

## 🎯 支持的 CSS 属性清单

### 布局（Layout）
- ✅ `display: flex`
- ✅ `flex-direction`
- ✅ `flex-wrap`
- ✅ `justify-content`
- ✅ `align-items`
- ✅ `align-content`
- ✅ `gap`

### 尺寸（Size）
- ✅ `width`, `height`
- ✅ `min-width`, `max-width`
- ✅ `min-height`, `max-height`

### 间距（Spacing）
- ✅ `padding`, `padding-*`
- ✅ `margin`, `margin-*`

### 边框（Border）
- ✅ `border`, `border-*`
- ✅ `border-radius`
- ✅ `border-color`, `border-width`

### 背景（Background）
- ✅ `background-color`
- ✅ `background-image` (渐变)
- ❌ `background-image` (url)

### 文字（Text）
- ✅ `color`
- ✅ `font-size`
- ✅ `font-weight`
- ✅ `font-family`
- ✅ `line-height`
- ✅ `text-align`
- ✅ `letter-spacing`
- ✅ `word-spacing`

### 不透明度（Opacity）
- ✅ `opacity`

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
渲染成功但样式缺失（如阴影、变换）
```

**解决：** 检查是否使用了 `box-shadow`, `transform`, `filter`

#### 错误 3: 图片加载失败

```
Error: Failed to load image
```

**解决：** 确保图片是 base64 dataURL

---

## 📚 相关资源

- [Satori 官方文档](https://github.com/vercel/satori)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [支持的 CSS 属性列表](https://github.com/vercel/satori#css)

---

**记住：Satori 不是浏览器，只支持 Flexbox + 基础样式。**

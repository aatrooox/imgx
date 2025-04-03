# IMGX

文字生成卡片(图片)以及图片处理的 API 工具

## 最新动态

`V0.6.0`之后的版本已经包含了一套**模板录入+预设保存的机制**，用于解决一大堆参数的问题，保存预设时会得到一个 4(或3)位数的预设码，这个预设码包含了使用哪个模板、使用什么默认样式等信息。

比如 https://imgx.zzao.club/008/吾身所立，即是幽都/幽都/秦凤青?titleSize=60 (最近刚二刷了牧神记🤪)

![](https://imgx.zzao.club/008/吾身所立，即是幽都/幽都/秦凤青?titleSize=60)

目前（2025 年 3 月 27 日）我只新增了一个预设 **[008]**，因为重构后的代码 [imgx-nitro](https://github.com/aatrooox/imgx-nitro) 还有非常多可以优化的点，但总算是把主线流程打通了。

模板是通过 Vue3 的组件完成，我把组件拆成两部分：

一部分是 `template`，里面只包含符合 `satori` 要求的 `html` 和 `tailwindcss`。

另一部分是 `props` , 这个 `props` 并且是组件里定义的那个 `defineProps` ，而是传进来的 `props` 对象。

通过 props ，我会解析为一个 `propsSchema` 数组，会尝试把 props 的每个 key=value，解析为 内容、尺寸、颜色 这三种类型。

生成后的 `propsSchema` 会以表单的形式在前端展示，**创建者需要自己勘误**，确认无误后即可保存模板。

然后就可以去新增预设

预设指的是包含了一组默认 `props` 、`width`、`height` 的模板，所以在 template 中准确的生成 `propsSchema`，才能在预设中正常使用。

其中预设中保存的 props 分为两类：`contentProps` 、 `styleProps`。

`contentProps` 指的是文字内容，在 `GET` 请求中以 `url` 路径的形式传递，如上文的示例，传递顺序会在 `propsSchema` 中由**模板创建者定义**

`styleProps` 指的是样式，在 `GET` 请求中以 `query` 形式进行传递，如上边的 `?titleSize=60`

GET 请求中包含的 props，会和预设中保存的 props 合并，所以，即使你的预设中包含很多文字，但可能需要动态改变的文字没有那么多，只需要把不需要改的文字排序放在最后，然后在 GET 请求时只传入动态的内容即可。

在 `POST` 请求中只需要正常在 Body 中按 JSON 格式来传值。

所以 `GET` 请求具有局限性，如果你的模板的内容有一个 `props` 要求是**数组**，则需要在 `propsSchema` 中指明分隔符，对应的，在使用者发出 GET请求时，要按照你设置的分隔符进行分割。

所以 GET 请求看起来很繁琐，局限性很大，但 GET 请求的玩法要比 POST 多的多（我觉得）。

比如自己生成一些 SVG 小图标，装饰 Github 主页，装饰笔记 App 的内容，装饰个人网站等等

那要如何创建 template 呢，一个一个的写未免有些太麻烦，所以我测试了两套 `AI 提示词`

一个是提供一个图片，让 AI 用 Vue3组件 仿写
一个是提供描述，让 AI 自己生成美观的图片

这样就可以大大提高模板的制作效率，降低制作门槛了，当然如果自己具备调试模板的能力，还是要更方便一些。

制作这个工具的初衷，只是为了满足常用的文字生成图片场景，所以一般情况下每个人、每个场景有一个常用的预设就足够了。

其他的边做边看吧


## 背景

有时候写文章时需要上传封面图，大部分情况我只需要简单的文字、LOGO、强调文字等即可。

现有的App、Web端需要我打开他们的平台，然后选择合适的模板，最后还要充个会员，不然就限制我下载图片的大小，给我加个水印什么的。

此 API 可以帮助我快速在任意场景下拿到一张想要的图片。必要时可以下载，临时使用直接用链接。

并且如果是文章中配图，大部分技术平台都支持自动转存，很省心。

## 定位

本项目属于 `“消费者”` ，使用了 [imgx-nitro](https://github.com/aatrooox/imgx-nitro) 的接口，实现了文字转图片的功能


## 后续

此项目会逐步变为 [imgx-nitro](https://github.com/aatrooox/imgx-nitro) 的前端展示、管理、录入的入口项目

最初的接口会在某个版本直接删除

## 使用

API格式：<code> GET https://imgx.zzao.club/[预设码]/[文字内容]?[样式参数]=xxx </code>

如： <code> https://imgx.zzao.club/008/吾身所立，即是幽都/幽都/秦凤青?titleSize=60 </code>

![](https://imgx.zzao.club/008/吾身所立，即是幽都/幽都/秦凤青?titleSize=60)

## 模板示例

template:

```vue
<div class="flex w-full h-full" :style="{ backgroundColor: bgColor }">
  <div class="flex flex-col w-full h-full items-center justify-center" :style="{ padding: padding + 'px' }">
    <div class="flex w-full justify-center items-center mb-4">
      <div class="flex text-center font-bold" :style="{ color: titleColor, fontSize: titleSize + 'px' }">
        <span v-if="title.includes(highlightText)">
          {{ title.split(highlightText)[0] }}
          <span :style="{ color: highlightColor }">{{ highlightText }}</span>
          {{ title.split(highlightText)[1] }}
        </span>
        <span v-else>{{ title }}</span>
      </div>
    </div>
    <div class="flex w-full justify-center items-center mb-6">
      <div class="flex text-center" :style="{ color: subtitleColor, fontSize: subtitleSize + 'px' }">{{ subtitle }}</div>
    </div>
    <div class="flex w-full justify-end items-center">
      <div class="flex" :style="{ color: authorColor, fontSize: authorSize + 'px' }">{{ author }}</div>
    </div>
  </div>
</div>
```

props

```js
{
  "title": "深入理解Vue3组合式API及其最佳实践",
  "highlightText": "Vue3",
  "highlightColor": "#42b883",
  "subtitle": "探索现代前端开发的新范式",
  "author": "@前端技术专家",
  "bgColor": "#1e40af",
  "titleColor": "#ffffff",
  "subtitleColor": "#e5e7eb",
  "authorColor": "#e5e7eb",
  "titleSize": 36,
  "subtitleSize": 24,
  "authorSize": 18,
  "padding": 40
}
```

然后在预设中 props 会分成三部分存储：

```js
contenProps: {
    "title": "深入理解Vue3组合式API及其最佳实践",
    "highlightText": "Vue3",
    "subtitle": "探索现代前端开发的新范式",
    "author": "@前端技术专家",
}

styleProps: {
   "highlightColor": "#42b883",
   "bgColor": "#1e40af",
   "titleColor": "#ffffff",
   "subtitleColor": "#e5e7eb",
   "authorColor": "#e5e7eb",
   "titleSize": 36,
   "subtitleSize": 24,
   "authorSize": 18,
   "padding": 40
}

contentKeys: "title,highlightText,subtitle,author"

```

所以 GET 请求的格式为 https://imgx.zzao.club/008/{title}/{highlightText}/{subtitle}/{author}?bgColor=xxx&titleColor=xxx

传入的 /{title}/{highlightText}/{subtitle}/{author} 部分会按 `/` 分割出来，然后按 `contentKeys` 的顺序映射到 `customContentProps` 上，query 部分则是直接解析出来 `customStyleProps`。

然后 `customContentProps` 和 `customStyleProps` 会分别与默认的 contentProps 和 styleProps 合并，没有传入的值就会使用预设的值

当然！正常实际使用没是有一串的参数的，预设的目的就是把样式固定下来，只传内容进去。甚至不传内容，只用默认值。

所以只需要自己上传一个模板，或是使用别的人的模板，再修改尺寸和样式，就能变成自己的预设了！

## 开发规划

### 当前版本
- [x] 自定义模板
- [x] 自定义预设
- [x] GET、POST API 支持
- [x] 支持免费字体: 优设标体黑、抖音美好体

### 0.5.0
- [x] 每行文字不同颜色
- [x] 每行文字不同对齐方式
- [x] 每行强调文字不同颜色

### 0.6.0
- [x] 模板管理系统
- [x] 预设码机制

### 0.7.0 [规划]
~~新增预设配置界面，登录后可配置，使用时无需登录~~
- [ ] 丰富使用场景：Github、笔记 App、自定义小图标、头像等
- [ ] 丰富模板和预设
- [ ] 私有化部署流程，完全本地化
- [ ] 完善模板缓存机制、预设缓存机制、图片存储机制

### 0.8.0 [规划]
- [ ] Docker
- [ ] NAS
- [ ] 客户端
- [ ] 图片服务 IPX (自带图片压缩、剪裁)

### 0.9.0
- [ ] 代码优化
- [ ] 功能完善

### 1.0.0
- [ ] 发布稳定版


## 新模板、功能建议、围观
发邮件给我：gnakzz@qq.com

添加微信好友 (请备注 IMGX)：

![](https://img.zzao.club/article/202412301618241.jpg)


## 致谢

- [v-satori](https://github.com/wobsoriano/v-satori)

## MIT

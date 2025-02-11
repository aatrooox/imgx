# IMGX

> 一行 URL 快速生成图片

## 背景

有时候写文章时需要上传封面图，大部分情况我只需要简单的文字、LOGO、强调文字等即可。

现有的App、Web端需要我打开他们的平台，然后选择合适的模板，最后还要充个会员，不然就限制我下载图片的大小，给我加个水印什么的。

此 API 可以帮助我快速在任意场景下拿到一张想要的图片。

并且如果是文章中配图，大部分技术平台都支持自动转存，很省心。


## 使用

如：  https://imgx.zzao.club/api/img/001/001/[Nuxt实战]从入门到放弃系列+点击就送屠龙宝刀?bgColor=292a3a-536976&accentColor=0088a9&color=ffffff


![](https://imgx.zzao.club/api/img/001/001/[Nuxt实战]从入门到放弃系列+点击就送屠龙宝刀?bgColor=292a3a-536976&accentColor=0088a9&color=ffffff)

直接右键下载即可

## 规划

- [x] 简单的文字生成图片
- [x] 支持换行
- [x] 支持强调色 `[强调的内容]`  
- [x] 支持背景色 query.bgColor （两个颜色的渐变色支持`-`分割）
- [x] 支持文字颜色 query.color
- [x] 支持居中或左对齐 query.center === 1 ?
- [x] 支持多种比例的图片大小
- [ ] 支持 x2 x3 等倍图 
- [ ] 支持更多模板
- [ ] 支持更多字体
- [ ] 登录后保存配置，不需要再输入一大串参数
- [ ] 接入公众号，发送消息得到一张图片
- [ ] 其他写作 App 等插件

## 致谢

- [v-satori](https://github.com/wobsoriano/v-satori)

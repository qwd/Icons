---
title: 使用
description: 和风天气图标使用SVG格式，因此你可以通过多种方式进行使用，包括使用图标字体、以\<SVG>标签嵌入网页或当作图片处理，当然你也可以下载到本地进行再创作。
---

> 对于[和风天气的开发者](https://dev.qweather.com/)来说，图标的文件名与天气数据中的`icon`或预警数据中的`warning.type`字段的返回值是一样的，因此你可以非常简单的将天气状况与图标进行匹配。
> 
> **例如:** `now.icon = 301`对应**301.svg** 或`<i class="qi-301"></i>`，`warning.type = 1010`对应**1010.svg** 或`<i class="qi-1010"></i>`。关于和风天气开发服务中使用的图标代码和名称，请参考[图标信息](https://dev.qweather.com/docs/resource/icons/)。

## 嵌入 {#embedded}

使用`<svg>`标签将图标嵌入到你的网站中。

```html
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="qi-307-fill" viewBox="0 0 16 16"><path d="M1 12.5a1 1 0 1 0 2 0c0-.5-.555-1.395-1-2-.445.605-1 1.5-1 2ZM5 15a1 1 0 1 0 2 0c0-.5-.555-1.395-1-2-.445.605-1 1.5-1 2Zm4.293.707A1 1 0 0 1 9 15c0-.5.555-1.395 1-2 .445.605 1 1.5 1 2a1 1 0 0 1-1.707.707ZM13 12.5a1 1 0 0 0 2 0c0-.5-.555-1.395-1-2-.445.605-1 1.5-1 2Zm-1.273-4.283A4.99 4.99 0 0 1 7.9 10a4.988 4.988 0 0 1-3.773-1.719 3 3 0 1 1-.586-5.732A4.998 4.998 0 0 1 7.9 0a4.999 4.999 0 0 1 4.38 2.587 3 3 0 1 1-.553 5.63Z"/></svg>
```

## 使用图片 {#img-element}

SVG格式的图标也可以被视为一张普通图片，就像平时一样在网页中使用`<img>`标签插入图片。

```html
<img src="/some/path/301.svg" alt="QWeather Icons" width="32" height="32">
```

## 图标字体 {#icon-font}

和风天气图标提供了图标字体，像使用其他图标字体一样，你可以使用[CDN](/install/#cdn)或在[本地](https://github.com/qwd/Icons/releases/latest/)导入字体样式。

```html
<html>
<head>
    <!-- 引入字体样式 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/qweather-icons@1.3.0/font/qweather-icons.css">
</head>
<body>
    <div>
        <!-- 试试大雨和寒冷 -->
        It's raining <i class="qi-307"></i> and cold <i class="qi-cold"></i>
    </div>
</body>
</html>
```

## CSS

你可以将SVG加入到你的CSS中，请注意SVG的颜色需要用`%23`代替`#`

```css
.someClass::after {
  content: "";
  background-image: url("data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill='%23FF843F' class="qi-100-fill" viewBox="0 0 16 16"><path d="M8.005 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm.004-.997a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5ZM3.766 4.255a.498.498 0 0 1-.353-.147l-1.062-1.06a.5.5 0 0 1 .707-.707L4.122 3.4a.5.5 0 0 1-.355.854v.001ZM2.004 8.493h-1.5a.5.5 0 1 1 0-1h1.5a.5.5 0 1 1 0 1Zm.691 5.303a.5.5 0 0 1-.354-.854l1.062-1.06a.5.5 0 0 1 .708.707l-1.063 1.06a.497.497 0 0 1-.353.147Zm5.301 2.201a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5Zm5.304-2.191a.496.496 0 0 1-.353-.147l-1.06-1.06a.5.5 0 1 1 .706-.707l1.06 1.06a.5.5 0 0 1-.353.854Zm2.203-5.299h-1.5a.5.5 0 0 1 0-1h1.5a.5.5 0 1 1 0 1ZM12.25 4.265a.5.5 0 0 1-.354-.854l1.06-1.06a.5.5 0 1 1 .708.707l-1.06 1.06a.498.498 0 0 1-.354.147Z"/></svg>");
  background-repeat: no-repeat;
}
```

如果你已经引用了和风天气图标字体，你还可以这样使用：

```css
.someClass::before {
    font-family: "qweather-icons" !important;
    content: "\f110";
  }
```

## 自定义

SVG是一种矢量图形，因此你可以自由的编辑它的样式，或者当你完成新的设计后，可以通过和风天气图标项目将这些图标进行压缩和创建字体文件。关于更多自定义的说明，请参考[自定义文档](/customize/)。
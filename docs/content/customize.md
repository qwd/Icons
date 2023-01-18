---
title: 自定义
description: QWeather Icons 项目可以帮助你创建自定义图标和图标字体。
---

各花入各眼，你可能希望修改图标的颜色，或者修改一些图标样式以更加适配你的设计风格，这里将介绍如何使用和风天气项目创建你的自定义图标和字体。

## 编辑图标和字体 {#edit-icons-and-fonts}

👉 [在Figma中获取所有设计文件](https://www.figma.com/community/file/1196353857920331062)

你可以对这些图标修改颜色或调整样式，然后导出新的SVG或其他格式的图片。

如果需要创建新的字体，你必须：

- 导出SVG格式的图标
- SVG图片必须进行**Flatten**和**Outline stroke**操作
- 确保SVG图片的`fill-rule`的值**不是**`evenodd`。如果你是在Figma中进行的编辑，推荐使用[Fill Rule Editor](https://www.figma.com/community/plugin/771155994770327940)这个插件来修正。

当完成上述图标和字体的重新设计后，参考下方[运行QWeather Icons](#run-qweather-icons)，可以对SVG图标进行压缩和优化（我们使用[SVGO](https://github.com/svg/svgo)）并创建字体。

## 运行 QWeather Icons {#run-qweather-icons}

QWeather Icons项目将帮助你优化SVG图标和创建新的字体。

#### 1. 安装Node.js

请访问 <https://nodejs.org> 下载并安装Node.js，我们在v14和v18版本测试通过。

#### 2. 下载项目

```sh
git clone https://github.com/qwd/Icons.git
```

#### 3. 导入自定义SVG

将你修改后的所有SVG粘贴到`/icons`目录下并替换原文件。

如果有新增/删除/重命名的图标，你需要编辑`icons-list.json`文件。

#### 4. 安装依赖

进入项目目录，安装依赖库（这可能会需要一些时间，取决于你的网络环境，或者尝试更改npm源）：

```
npm install
```

#### 5. 运行

```
npm run icons
```

稍等片刻，所有SVG图标在`/icons`目录生成，字体文件在`/font`目录下生成，你也可以打开`/font/demo.html`查看效果。

搞定 🎉
# 和风天气图标 QWeather Icons

[English](#qweather-icons)

和风天气图标是一个开源、漂亮的天气图标库，支持SVG和Web Font，兼容[和风天气API](https://dev.qweather.com)，适用于任何需要天气图标的项目。 

## 下载和安装

你可以通过多种方式下载和安装和风天气图标:

**npm**

```bash
npm i qweather-icons
```

**CDN**

```bash
<link href="https://cdn.jsdelivr.net/npm/qweather-icons@1.3.2/font/qweather-icons.css" rel="stylesheet">
```

或[下载.zip](https://github.com/qwd/Icons/releases)

## 如何使用

- 在HTML中嵌入SVG
- 在`img`中使用
- 通过web font加载

> 如果你是[和风天气开发者](https://dev.qweather.com/)，图标和字体的命名与`icon`字段是一致的，因此你可以直接通过`icon`字段找到你需要的图标和字体。

具体使用方式请参考[使用文档](https://icons.qweather.com/usage/)。

## 设计文件

所有图标的设计资源可以[在Figma中查看](https://www.figma.com/community/file/1196353857920331062)。

## 开发

假设你已经拥有[Node.js](https://nodejs.org)环境。克隆本项目到本地，并安装依赖。

```bash
git clone https://github.com/qwd/Icons.git
cd Icons
npm install
```

### 运行文档

```bash
npm run docs
```

在浏览器打开`https://localhost:1313`即可。

### 创建图标

```bash
npm run icons
```

### 其他scripts

请查看`package.json`。

## 自定义图标

参考[自定义文档](https://icons.qweather.com/customize/)。

## 灵感

灵感来自[Boogstrap Icons](https://icons.getbootstrap.com/)

## 许可

版权所属 [QWeather](https://www.qweather.com/)

代码 [MIT](https://github.com/qwd/Icons/blob/main/LICENSE)

图标 [知识共享署名4.0](https://creativecommons.org/licenses/by/4.0/deed.zh)

# QWeather Icons

QWeather Icons is an open source, beautiful weather icon library that supports SVG and Web Font, compatible with [QWeather API](https://dev.qweather.com/en/), and also works in any project that needs weather icons. 

## Install

**npm**

```bash
npm i qweather-icons
```

**CDN**

```bash
<link href="https://cdn.jsdelivr.net/npm/qweather-icons@1.3.2/font/qweather-icons.css" rel="stylesheet">
```

Or [Download .zip](https://github.com/qwd/Icons/releases)

## How to Use

- Embedding SVG in HTML
- Use `img` element
- Loading via web font

> For [QWeather developers](https://dev.qweather.com/en/), the icons and fonts are named the same as the `icon` field, so you can find the icons and fonts you need directly through the `icon` field.

See [Usage](https://icons.qweather.com/en/usage/) for more.

## Design resources

All design resources for icons can be found in [Figma](https://www.figma.com/community/file/1196353857920331062).

## Development

Assume you already have a [Node.js](https://nodejs.org) environment. Clone this project locally and install the dependencies.

```bash
git clone https://github.com/qwd/Icons.git
cd Icons
npm install
```

### Run docs server

```bash
npm run docs
```

Open `https://localhost:1313` in your browser.

### Build icons

```bash
npm run icons
```

### Other scripts

See `package.json` for more.

## Customize

See [Customize](https://icons.qweather.com/customize/) for more.

## Inspiration

Inspired by [Boogstrap Icons](https://icons.getbootstrap.com/)

## License

Copyright [QWeather](https://www.qweather.com/en/)

Code for [MIT](https://github.com/qwd/Icons/blob/main/LICENSE)

Icon for [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

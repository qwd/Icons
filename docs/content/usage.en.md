---
title: Usage
description: QWeather Icons use SVG format, so it is very easy to use and modification.
---

> For [QWeather developers](https://dev.qweather.com/en/), the icon name or style name is the same as the `icon` in weather data or `warning.type` in warning data, so you can simply map the icons to the weather conditions.
> 
> **Example:** `now.icon = 301` corresponds **301.svg** or `<i class="qi-301"></i>`, `warning.type = 1010` corresponds **1010.svg** or `<i class="qi-1010"></i>`. For the icons code and name used in QWeather Develop Service, please refer to [Icon info](https://dev.qweather.com/docs/resource/icons/).

## Embedded {#embedded}

Use the `<svg>` element to embed the icon into your HTML.

```html
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="qi-307-fill" viewBox="0 0 16 16"><path d="M1 12.5a1 1 0 1 0 2 0c0-.5-.555-1.395-1-2-.445.605-1 1.5-1 2ZM5 15a1 1 0 1 0 2 0c0-.5-.555-1.395-1-2-.445.605-1 1.5-1 2Zm4.293.707A1 1 0 0 1 9 15c0-.5.555-1.395 1-2 .445.605 1 1.5 1 2a1 1 0 0 1-1.707.707ZM13 12.5a1 1 0 0 0 2 0c0-.5-.555-1.395-1-2-.445.605-1 1.5-1 2Zm-1.273-4.283A4.99 4.99 0 0 1 7.9 10a4.988 4.988 0 0 1-3.773-1.719 3 3 0 1 1-.586-5.732A4.998 4.998 0 0 1 7.9 0a4.999 4.999 0 0 1 4.38 2.587 3 3 0 1 1-.553 5.63Z"/></svg>
```

## \<img> element {#img-element}

SVG can also be treated as a normal image, just insert the image in the HTML using the `<img>` element as usual.

```html
<img src="/some/path/301.svg" alt="QWeather" width="32" height="32">
```

## Icon font {#icon-font}

QWeather Icons provides icon fonts, and just like using other icon fonts, you can import font styles using [CDN](/install/#cdn) or [locally](https://github.com/qwd/Icons/releases/latest/).


```html
<html>
<head>
    <!-- import font style -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/qweather-icons@1.3.0/font/qweather-icons.css">
</head>
<body>
    <div>
        <!-- try "heavy rain" and "cold" icons -->
        It's raining <i class="qi-307"></i> and cold <i class="qi-901"></i>
    </div>
</body>
</html>
```

## CSS

You can add SVG to your CSS, please note that the svg color needs to be `%23` instead of `#`

```css
.someClass::after {
  content: "";
  background-image: url("data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill='%23FF843F' class="qi-100-fill" viewBox="0 0 16 16"><path d="M8.005 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm.004-.997a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5ZM3.766 4.255a.498.498 0 0 1-.353-.147l-1.062-1.06a.5.5 0 0 1 .707-.707L4.122 3.4a.5.5 0 0 1-.355.854v.001ZM2.004 8.493h-1.5a.5.5 0 1 1 0-1h1.5a.5.5 0 1 1 0 1Zm.691 5.303a.5.5 0 0 1-.354-.854l1.062-1.06a.5.5 0 0 1 .708.707l-1.063 1.06a.497.497 0 0 1-.353.147Zm5.301 2.201a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5Zm5.304-2.191a.496.496 0 0 1-.353-.147l-1.06-1.06a.5.5 0 1 1 .706-.707l1.06 1.06a.5.5 0 0 1-.353.854Zm2.203-5.299h-1.5a.5.5 0 0 1 0-1h1.5a.5.5 0 1 1 0 1ZM12.25 4.265a.5.5 0 0 1-.354-.854l1.06-1.06a.5.5 0 1 1 .708.707l-1.06 1.06a.498.498 0 0 1-.354.147Z"/></svg>");
  background-repeat: no-repeat;
}
```

If you have referenced the QWeather Icons font, you can also use it like this:

```css
.someClass::before {
    font-family: "qweather-icons" !important;
    content: "\f110";
  }
```

## Customize

SVG is a vector graphic, so you can freely edit its style, or when you have created new designs, you can compress these icons and create icon font with QWeather Icons project. See [Customize](/en/customize/) to learn more.




---
title: Usage
description: QWeather Icons use SVG format, so it is very easy to use and modification.
---

> For [QWeather developers](https://dev.qweather.com/docs/), the icon name or style name is the same as the `icon` field in the Weather API/SDK, so you just need to match the icon with the same name.
> 
> **Example:** the API returns `"icon": "301"`, then you just need to use the image `301.svg` or the icon font `<i class="qi-301"></i>`.

## Embedded {#embedded}

Use the `svg` element to embed the icon into your HTML.

```html
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="qi-301" viewBox="0 0 16 16"><path d="M7.012 14.985a1 1 0 0 0 2 0 6.605 6.605 0 0 0-1-2 6.605 6.605 0 0 0-1 2zM3.959 14a1 1 0 0 0 2 0 6.605 6.605 0 0 0-1-2 6.605 6.605 0 0 0-1 2zm6.028 0a1 1 0 0 0 2 0 6.605 6.605 0 0 0-1-2 6.605 6.605 0 0 0-1 2zM5.207 1.904h.007a.5.5 0 0 0 .493-.506L5.695.494a.5.5 0 0 0-.5-.494h-.007a.5.5 0 0 0-.493.506l.012.905a.5.5 0 0 0 .5.493zm-2.892.946a.5.5 0 1 0 .698-.716l-.648-.63a.5.5 0 1 0-.697.715zm-.179 2.203a.5.5 0 0 0-.5-.493h-.007l-.905.011a.5.5 0 0 0 .007 1h.007l.904-.011a.5.5 0 0 0 .494-.507zm5.638-2.12a.5.5 0 0 0 .359-.151l.63-.648a.5.5 0 0 0-.716-.698l-.631.648a.5.5 0 0 0 .358.849z"/><path d="M12.028 5.579a2.927 2.927 0 0 0-.37.037 4.364 4.364 0 0 0-7.316 0 2.926 2.926 0 0 0-.37-.037 2.972 2.972 0 1 0 1.16 5.709 4.302 4.302 0 0 0 5.735 0 2.972 2.972 0 1 0 1.16-5.71zm0 4.944a1.959 1.959 0 0 1-.77-.156 1 1 0 0 0-1.05.168 3.303 3.303 0 0 1-4.417 0 1 1 0 0 0-1.05-.168 1.972 1.972 0 1 1-.769-3.788 1.077 1.077 0 0 1 .15.017l.095.012a1 1 0 0 0 .962-.444 3.364 3.364 0 0 1 5.642 0 1 1 0 0 0 .962.444l.095-.012a1.08 1.08 0 0 1 .15-.017 1.972 1.972 0 1 1 0 3.944zM2.482 5.315A3.53 3.53 0 0 1 3.5 5.027a1.831 1.831 0 0 1 1.81-1.603 1.81 1.81 0 0 1 .553.095 4.933 4.933 0 0 1 1.281-.405A2.82 2.82 0 0 0 2.476 5.26c0 .02.006.037.006.056z"/></svg>
```

## img element {#img-element}

SVG can also be treated as a normal image, just insert the image in the HTML using the `img` element as usual.

```html
<img src="/some/path/301.svg" alt="QWeather" width="32" height="32">
```

## Icon font {#icon-font}

QWeather Icons provides icon fonts that you can use like any other icon font when you introduce the stylesheet [using CDN](/install/#cdn) or import it in your local project.

```html
<i class="qi-301"></i>
```

## CSS

You can add SVG to your CSS, please note that the svg color needs to be `%23` instead of `#`

```css
.someClass::after {
  content: "";
  background-image: url("data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill='%23066ff5' class="qi-102-fill" viewBox="0 0 16 16"><path d="M8 3a4.99 4.99 0 0 0-4.18 2.267 3.345 3.345 0 0 0-.423-.042 3.397 3.397 0 1 0 1.326 6.524 4.917 4.917 0 0 0 6.554 0 3.397 3.397 0 1 0 1.326-6.524 3.345 3.345 0 0 0-.423.042A4.99 4.99 0 0 0 8 3z"/></svg>");
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

## Download

If you need to modify QWeather Icons, or want to use these icons elsewhere, just [download all the icons](https://github.com/qwd/Icons/releases/latest) locally to create more personalized icons and export them to various formats you like, such as .png/.jpg and etc.




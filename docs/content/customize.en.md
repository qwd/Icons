---
title: Customize
description: QWeather Icons project helps you create customized icons and icon fonts.
---

You may want to change the icons color or redesign the icons to better fit your project style. Here's how to create your customized icons and fonts using the QWeather Icons project.

## Edit Icons and Fonts

👉 [Get all design resources in Figma](https://www.figma.com/community/file/1196353857920331062)

You can change the color or redesign these icons, and then export new images in SVG or other formats.

If you need to create new fonts, you must:

- Export the icons in SVG format.
- SVGs must be **Flatten** and **Outline stroke**
- Make sure the value of `fill-rule` for SVGs **IS NOT** `evenodd`. If you are editing in Figma, it is recommended to use [Fill Rule Editor](https://www.figma.com/community/plugin/771155994770327940) to fix it.

Once your icons and fonts are redesigned, go to [Run QWeather Icons](#run-qweather-icons) below to optimize the SVGs (we use [SVGO](https://github.com/svg/svgo)) and create the icon fonts.

## Run QWeather Icons

The QWeather Icons project will help you optimize SVGs and create new icon fonts.

#### 1. Install Node.js

[Download and install Node.js](https://nodejs.org), we tested in v14 and v18. Typically, other versions are supported as well.

#### 2. Download source code for QWeather Icons 

```sh
git clone https://github.com/qwd/Icons.git
```

#### 3. Import customized SVGs

Paste all your customized SVGs into the `/icons` and replace the original SVGs.

If there are new/deleted/renamed SVGs, you need to edit the `icons-list.json` file.

#### 4. Install Dependencies

Go into the project directory and install the dependencies (this may take some time depending on your network environment):

```
npm install
```

#### 5. Run

```
npm run icons
```

Wait a moment, all SVGs are generated in `/icons`, and fonts are generated in `/font`, you can also open `/font/demo.html` to see the demo.

Done 🎉
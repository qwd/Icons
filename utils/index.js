import fs from 'fs'
import path from 'path'

// Code point decimal recommended range 57344 - 63743
const codePointRange = {
  min: 57344,
  max: 63743
}

import {
  createSVG,
  createTTF,
  createWOFF,
  createWOFF2,
  createJSON,
  createCSS,
  processFiles, createHTML, readAllFilesSync
} from './utils.js'

export default async function SvgToFont (options) {
  if (!options) options = {};
  options.dist = options.dist || path.join(process.cwd(), "font");
  options.src = options.src || path.join(process.cwd(), "icons");
  options.fontsUrl = options.fontsUrl || path.join(process.cwd(), "font/fonts");
  options.fontName = options.fontName || "iconfont";
  options.svgicons2svgfont = options.svgicons2svgfont || {
    fontHeight: 1000,
    fixedWidth: true,
    normalize: true
  };
  options.svgicons2svgfont.fontName = options.svgicons2svgfont.fontName || options.fontName;
  options.classNamePrefix = options.classNamePrefix || options.fontName;
  options.suffix = 'fill'

  // clear options.dist
  if (fs.existsSync(options.dist)) {
    if (fs.existsSync(options.fontsUrl)) {
      fs.readdirSync(options.fontsUrl).forEach((file) => {
        fs.unlinkSync(path.join(options.fontsUrl, file));
      });
      fs.rmdirSync(options.fontsUrl);
    }
    fs.readdirSync(options.dist).forEach((file) => {
      fs.unlinkSync(path.join(options.dist, file));
    });

    fs.rmdirSync(options.dist);
  }
  fs.mkdirSync(options.dist)

  // read all svg files
  let otherStartCode = codePointRange.max
  let allSvgFiles = readAllFilesSync(options.src, 'svg');
  const codeHasTrueMap = new Map();
  const codeHasUnicode = new Map();
  allSvgFiles = allSvgFiles.map(itemPath => {
    const pathInfo = path.parse(itemPath)
    const nameComponentList = pathInfo.name.split('-')
    const code = nameComponentList[0]
    const fill = pathInfo.name.includes(options.suffix)
    if (fill) {
      codeHasTrueMap.set(code, true);
    }
    let abbreviation = nameComponentList.filter(item => item !== options.suffix && (isNaN(Number(code)) || (!isNaN(Number(code)) && item !== code))).join('-')
    return {
      fullPath: itemPath,
      code,
      name: pathInfo.name,
      abbreviation,
      fill
    }
  }).sort((a, b) => {
    if (isNaN(Number(a.code)) || isNaN(Number(b.code))) {
      return 1
    } else {
      if (a.code === b.code) {
        return a.name.length > b.name.length
      } else {
        return Number(a.code) - Number(b.code)
      }
    }
  }).map(item => {
    let unicode
    if (codeHasUnicode.has(item.code)) {
      unicode = codeHasUnicode.get(item.code)
    } else {
      if (isNaN(Number(item.code))) {
        unicode = otherStartCode.toString(16)
        otherStartCode++
      } else {
        unicode = (Number(item.code) + codePointRange.min).toString(16)
      }
      codeHasUnicode.set(item.code, unicode)
    }
    return {
      ...item,
      haveFill: codeHasTrueMap.has(item.code),
      unicode
    }
  })

  // start create icons

  return createSVG(options, allSvgFiles)
    .then(() => createTTF(options))
    .then(() => createWOFF(options))
    .then(() => createWOFF2(options))
    .then(() => createCSS(options, allSvgFiles))
    .then(() => createHTML(options, allSvgFiles))
    .then(() => createJSON(options, allSvgFiles))
    .then(() => processFiles(options))
}

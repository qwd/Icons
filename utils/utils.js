import fs from 'fs'
import path from "path";
import {SVGIcons2SVGFontStream} from 'svgicons2svgfont'
import Handlebars from 'handlebars';
import svg2ttf from 'svg2ttf'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'
import 'colors'

const globalTtf = {}
const __dirname = import.meta.dirname;

export const readAllFilesSync = (dirPath, fileType) => {
  if (!fileType || !dirPath) {
    return []
  }

  const files = [];
  const direntList = fs.readdirSync(dirPath, {withFileTypes: true});
  for (const dirent of direntList) {
    const fullPath = path.join(dirPath, dirent.name);
    if (dirent.isFile()) {
      if (path.extname(fullPath).toLowerCase() === `.${fileType}`) {
        files.push(fullPath);
      }
    } else if (dirent.isDirectory()) {
      const subDirFiles = readAllFilesSync(fullPath);
      files.push(...subDirFiles);
    }
  }

  return files;
}

/**
 * SVG to SVG font
 */

export const createSVG = (options, allSvgFiles) => {
  return new Promise((resolve, reject) => {
    const normalFontList = allSvgFiles.filter(item => !item.fill)
    const fillFontList = allSvgFiles.filter(item => item.fill || (!item.fill && !item.haveFill))
    if (normalFontList.length === 0 && fillFontList.length === 0) {
      reject()
    }

    const count = normalFontList.length !== 0 && fillFontList.length !== 0 ? 2 : 1
    const promiseList = []
    for (let i = 0; i < count; i++) {
      let list = []
      let DIST_PATH
      if (normalFontList.length !== 0 && fillFontList.length !== 0) {
        list = i === 0 ? normalFontList : fillFontList
        DIST_PATH = i === 0 ? path.join(options.dist, `${options.fontName}.svg`) : path.join(options.dist, `${options.fontName}-${options.suffix}.svg`)
      } else {
        list = normalFontList.length !== 0 ? normalFontList : fillFontList
        DIST_PATH = normalFontList.length !== 0 ? path.join(options.dist, `${options.fontName}.svg`) : path.join(options.dist, `${options.fontName}-${options.suffix}.svg`)
      }
      const promise = new Promise((resolve, reject) => {
        const fontStream = new SVGIcons2SVGFontStream({
          ...options.svgicons2svgfont
        });
        fontStream.pipe(fs.createWriteStream(DIST_PATH)).on("finish", resolve).on("error", reject);

        list.forEach(itemSvg => {
          const glyph = fs.createReadStream(itemSvg.fullPath);
          glyph.metadata = {
            unicode: [String.fromCharCode(`0x${itemSvg.unicode}`)],
            name: itemSvg.code
          };
          fontStream.write(glyph);
          const glyphSelf = fs.createReadStream(itemSvg.fullPath);
          glyphSelf.metadata = {
            unicode: [`${itemSvg.code}`],
            name: `${itemSvg.code}-self`
          };
          fontStream.write(glyphSelf);
        })

        fontStream.end();
      })
      promiseList.push(promise)
    }
    Promise.all(promiseList).then(resolve).catch(reject)
  })
}

/**
 * SVG font to TTF
 */
export const createTTF = (options) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(options.fontsUrl)) {
      fs.mkdirSync(options.fontsUrl);
    }
    options.svg2ttf = options.svg2ttf || {};

    let haveNormalFile
    let haveFillFile
    try {
      fs.readFileSync(path.join(options.dist, `${options.fontName}.svg`), "utf8")
      haveNormalFile = true
    } catch {
      haveNormalFile = false
    }
    try {
      fs.readFileSync(path.join(options.dist, `${options.fontName}-${options.suffix}.svg`), "utf8")
      haveFillFile = true
    } catch {
      haveFillFile = false
    }
    if (!haveNormalFile && !haveFillFile) {
      reject()
    }
    const count = haveNormalFile && haveFillFile ? 2 : 1
    const promiseList = []
    for (let i = 0; i < count; i++) {
      const promise = new Promise((resolve, reject) => {
        let targetFilePath
        let keyName
        let DIST_PATH
        if (haveNormalFile && haveFillFile) {
          targetFilePath = i === 0 ? path.join(options.dist, `${options.fontName}.svg`) : path.join(options.dist, `${options.fontName}-${options.suffix}.svg`)
          keyName = `ttf${i === 0 ? '' : ('-' + options.suffix)}`
          DIST_PATH = i === 0 ? path.join(options.fontsUrl, `${options.fontName}.ttf`) : path.join(options.fontsUrl, `${options.fontName}-${options.suffix}.ttf`)
        } else {
          targetFilePath = haveNormalFile ? path.join(options.dist, `${options.fontName}.svg`) : path.join(options.dist, `${options.fontName}-${options.suffix}.svg`)
          keyName = haveNormalFile ? 'ttf' : `ttf-${options.suffix}`
          DIST_PATH = haveNormalFile ? path.join(options.fontsUrl, `${options.fontName}.ttf`) : path.join(options.fontsUrl, `${options.fontName}-${options.suffix}.ttf`)
        }
        const targetFile = fs.readFileSync(targetFilePath, "utf8")
        let ttf = svg2ttf(targetFile, options.svg2ttf)
        ttf = globalTtf[keyName] = Buffer.from(ttf.buffer);
        fs.writeFile(DIST_PATH, ttf, (err, data) => {
          if (err) {
            return reject(err);
          }
          console.log(`${"SUCCESS".green} ${"TTF".blue} font successfully created! ${DIST_PATH}`);
          resolve(data)
        });
      })
      promiseList.push(promise)
    }
    Promise.all(promiseList).then(resolve).catch(reject)
  });
};

/**
 * TTF font to WOFF
 */
export const createWOFF = (options) => {
  return new Promise((resolve, reject) => {
    if (!globalTtf[`ttf`] && !globalTtf[`ttf-${options.suffix}`]) {
      reject()
    }

    let count = globalTtf[`ttf`] && globalTtf[`ttf-${options.suffix}`] ? 2 : 1
    const promiseList = []
    for (let i = 0; i < count; i++) {
      const promise = new Promise((resolve, reject) => {
        let ttf
        let DIST_PATH
        if (globalTtf[`ttf`] && globalTtf[`ttf-${options.suffix}`]) {
          ttf = i === 0 ? globalTtf[`ttf`] : globalTtf[`ttf-${options.suffix}`]
          DIST_PATH = i === 0 ? path.join(options.fontsUrl, `${options.fontName}.woff`) : path.join(options.fontsUrl, `${options.fontName}-${options.suffix}.woff`)
        } else {
          ttf = !!globalTtf[`ttf`] ? globalTtf[`ttf`] : globalTtf[`ttf-${options.suffix}`]
          DIST_PATH = !!globalTtf[`ttf`] ? path.join(options.fontsUrl, `${options.fontName}.woff`) : path.join(options.fontsUrl, `${options.fontName}-${options.suffix}.woff`)
        }
        const woff = Buffer.from(ttf2woff(ttf).buffer);
        fs.writeFile(DIST_PATH, woff, (err, data) => {
          if (err) {
            return reject(err);
          }
          console.log(`${"SUCCESS".green} ${"WOFF".blue} font successfully created! ${DIST_PATH}`);
          resolve(data)
        });
      })
      promiseList.push(promise)
    }
    Promise.all(promiseList).then(resolve).catch(reject)
  });
};

/**
 * TTF font to WOFF2
 */
export const createWOFF2 = (options, toSuffix) => {
  return new Promise((resolve, reject) => {
    if (!globalTtf[`ttf`] && !globalTtf[`ttf-${options.suffix}`]) {
      reject()
    }

    let count = globalTtf[`ttf`] && globalTtf[`ttf-${options.suffix}`] ? 2 : 1
    const promiseList = []
    for (let i = 0; i < count; i++) {
      const promise = new Promise((resolve, reject) => {
        let ttf
        let DIST_PATH
        if (globalTtf[`ttf`] && globalTtf[`ttf-${options.suffix}`]) {
          ttf = i === 0 ? globalTtf[`ttf`] : globalTtf[`ttf-${options.suffix}`]
          DIST_PATH = i === 0 ? path.join(options.fontsUrl, `${options.fontName}.woff2`) : path.join(options.fontsUrl, `${options.fontName}-${options.suffix}.woff2`)
        } else {
          ttf = !!globalTtf[`ttf`] ? globalTtf[`ttf`] : globalTtf[`ttf-${options.suffix}`]
          DIST_PATH = !!globalTtf[`ttf`] ? path.join(options.fontsUrl, `${options.fontName}.woff2`) : path.join(options.fontsUrl, `${options.fontName}-${options.suffix}.woff2`)
        }
        const woff2 = Buffer.from(ttf2woff2(ttf).buffer);
        fs.writeFile(DIST_PATH, woff2, (err, data) => {
          if (err) {
            return reject(err);
          }
          console.log(`${"SUCCESS".green} ${"WOFF2".blue} font successfully created! ${DIST_PATH}`);
          resolve(data)
        });
      })
      promiseList.push(promise)
    }
    Promise.all(promiseList).then(resolve).catch(reject)
  });
};

/**
 * Copy template files
 */
export const copyTemplate = (TEMPLATE_PATH, Vars, DIST_DIR, DIST_PATH) => {
  return new Promise(resolve => {
    const templateSource = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    const template = Handlebars.compile(templateSource, {
      noEscape: true
    });
    const content = template(Vars);
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, {recursive: true})
    }
    const fileType = DIST_PATH.split('.').pop().toUpperCase()
    fs.writeFileSync(DIST_PATH, content, 'utf8');
    console.log(`${"SUCCESS".green} ${fileType.blue} file successfully created! ${DIST_PATH}`);
    resolve();
  });
};

export const createCSS = (options, allSvgFiles) => {
  const font_temp = path.join(__dirname, 'templates/css', 'qweather-icons.hbs');
  const DIST_PATH = path.join(options.dist, options.fontName + ".css");

  const classList = allSvgFiles.map(item => item.fill ? null : `.${options.classNamePrefix}-${item.code}::before { content: "\\${item.unicode}"; }`).filter(item => item)
  return copyTemplate(font_temp, {
    fontname: options.fontName,
    classList: classList,
    timestamp: new Date().getTime(),
    prefix: options.classNamePrefix || options.fontName,
    iconsClassName: options.QweatherIconsClassName || 'qweather-icons',
    suffix: options.suffix || 'fill'
  }, options.dist, DIST_PATH);
};

export const createHTML = (options, allSvgFiles) => {
  const font_temp = path.join(__dirname, 'templates/html', 'qweather-icons.hbs');
  const DIST_PATH = path.join(options.dist, options.fontName + ".html");

  const codeList = allSvgFiles.map(item => item.fill ? null : `${item.code}`).filter(item => item)
  const unicodeList = allSvgFiles.map(item => item.fill ? null : `${item.unicode}`).filter(item => item)
  return copyTemplate(font_temp, {
    codeList: codeList,
    unicodeList: unicodeList,
    prefix: options.classNamePrefix || options.fontName,
    iconsClassName: options.QweatherIconsClassName || 'qweather-icons',
  }, options.dist, DIST_PATH);
};

/**
 * Create icons-code json
 */
export const createJSON = (options, allSvgFiles) => {
  return new Promise((resolve, reject) => {
    let unicodeJsonPath = path.join(options.dist, `./${options.fontName}.json`)

    const jsonList = allSvgFiles.map(item => item.fill ? null : {
      code: item.code,
      name: item.abbreviation,
      unicode: item.unicode
    }).filter(item => item)
    fs.writeFile(unicodeJsonPath, JSON.stringify(jsonList), (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

/**
 * Process files
 */
export const processFiles = (options) => {
  return new Promise((resolve, reject) => {
    let svgFilePath = path.join(options.dist, `./${options.fontName}.svg`)
    fs.unlink(svgFilePath, (e) => {
      if (e) {
        reject(e)
      }
      let svgFilePath2 = path.join(options.dist, `./${options.fontName}-${options.suffix}.svg`)
      fs.unlink(svgFilePath2, (e) => {
        if (e) {
          reject(e)
        }
        resolve()
      });
    });
  });
};

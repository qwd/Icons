const fs = require("fs");
const path = require("path");
const SVGIcons2SVGFont = require("svgicons2svgfont");
const copy = require("copy-template-dir");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2woff2 = require("ttf2woff2");
require("colors-cli/toxic");

let UnicodeObj = {};
let UnicodeSelfObj = {}
let startUnicode = 0xea60;

function getIconUnicode(name, toGet, isUnicode) {
  let unicode
  let code = name.includes('-') ? name.split('-')[0] : name
  if (isNaN(Number(code))) {
    if (isUnicode) {
      unicode = toGet ? UnicodeSelfObj[code] : code
    } else {
      unicode = toGet ? UnicodeObj[code] : String.fromCharCode(startUnicode++)
    }
  } else {
    if (isUnicode) {
      unicode = toGet ? UnicodeSelfObj[code] : code
    } else {
      // unicode = toGet ? UnicodeObj[code] : String.fromCharCode(startUnicode++)
      unicode = toGet ? UnicodeObj[code] : String.fromCharCode('0x' + Number(code).toString(16))
    }
  }
  if (isUnicode) {
    UnicodeSelfObj[name] = unicode;
  } else {
    UnicodeObj[name] = unicode;
  }

  return [unicode];
}

exports.filterSvgFiles = (svgFolderPath) => {
  let files = fs.readdirSync(svgFolderPath, 'utf-8');
  let svgArr = [];
  if (!files) {
    throw new Error(`Error! Svg folder is empty.${svgFolderPath}`);
  }

  for (let i in files) {
    if (typeof files[i] !== 'string' || path.extname(files[i]) !== '.svg') continue;
    if (!~svgArr.indexOf(files[i])) {
      svgArr.push(path.join(svgFolderPath, files[i]));
    }
  }
  return svgArr;
}
/**
 * SVG to SVG font
 */
exports.createSVG = (OPTIONS, toSuffix) => {
  UnicodeObj = toSuffix ? UnicodeObj : {}
  UnicodeSelfObj = toSuffix ? UnicodeSelfObj : {}
  return new Promise((resolve, reject) => {
    const fontStream = new SVGIcons2SVGFont({
      ...OPTIONS.svgicons2svgfont
    });

    function _getSvgFileName (name) {
      let list = name.split('-')
      return list[list.length - 1] === OPTIONS.suffix ? (list[0] + '-' + list[list.length - 1]) : list[0]
    }

    function writeFontStream(svgPath) {
      let _name = path.basename(svgPath, ".svg");
      if (toSuffix || (!toSuffix && !_name.includes(OPTIONS.suffix))) {
        _name = _name.includes('-') ? _getSvgFileName(_name) : _name
        const glyph = fs.createReadStream(svgPath);
        glyph.metadata = {
          unicode: getIconUnicode(_name, toSuffix),
          name: _name
        };
        fontStream.write(glyph);
        const glyphSelf = fs.createReadStream(svgPath);
        glyphSelf.metadata = {
          unicode: getIconUnicode(_name, toSuffix, true),
          name: _name + '-self'
        };
        fontStream.write(glyphSelf);
      }
    }

    const DIST_PATH = path.join(OPTIONS.dist, (OPTIONS.fontName + (toSuffix ? ("-" + OPTIONS.suffix) : '') + ".svg"));

    // Setting the font destination
    let self = this
    fontStream.pipe(fs.createWriteStream(DIST_PATH)).on("finish", () => {
      if (!toSuffix) {
        self.createSVG(OPTIONS, true).then((res) => {
          resolve(res);
        }).catch((e) => {
          reject(e);
        })
      } else {
        resolve(UnicodeObj);
      }
    }).on("error", (err) => {
      if (err) {
        reject(err);
      }
    });

    this.filterSvgFiles(OPTIONS.src).sort((a, b) => {
      let name_a = path.basename(a, ".svg");
      let name_b = path.basename(b, ".svg");
      let code_a = Number(name_a.split('-')[0])
      let code_b = Number(name_b.split('-')[0])
      if (isNaN(code_a) || isNaN(code_b)) {
        return 1
      } else {
        if (code_a === code_b) {
          return name_a.length > name_b.length
        } else {
          return code_a - code_b
        }
      }
    }).forEach(svg => {
      writeFontStream(svg);
    });

    // Do not forget to end the stream
    fontStream.end();
  });
};

/**
 * SVG font to TTF
 */
exports.createTTF = (OPTIONS, toSuffix) => {
  let self = this
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(OPTIONS.fontsUrl)) {
      fs.mkdirSync(OPTIONS.fontsUrl);
    }
    OPTIONS.svg2ttf = OPTIONS.svg2ttf || {};
    const DIST_PATH = path.join(OPTIONS.fontsUrl, OPTIONS.fontName + (toSuffix ? ("-" + OPTIONS.suffix) : '') + ".ttf");
    let ttf = svg2ttf(fs.readFileSync(path.join(OPTIONS.dist, OPTIONS.fontName + (toSuffix ? ("-" + OPTIONS.suffix) : '') + ".svg"), "utf8"), OPTIONS.svg2ttf);
    ttf = this[('ttf' + (toSuffix ? ('_' + OPTIONS.suffix) : ''))] = Buffer.from(ttf.buffer);
    fs.writeFile(DIST_PATH, ttf, (err, data) => {
      if (err) {
        return reject(err);
      }

      console.log(`${"SUCCESS".green} ${"TTF".blue_bt} font successfully created! ${DIST_PATH}`);

      if (!toSuffix) {
        self.createTTF(OPTIONS, true).then((res) => {
          resolve(res);
        }).catch((e) => {
          reject(e);
        })
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * TTF font to WOFF
 */
exports.createWOFF = (OPTIONS, toSuffix) => {
  let self = this
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(OPTIONS.fontsUrl)) {
      fs.mkdirSync(OPTIONS.fontsUrl);
    }
    const DIST_PATH = path.join(OPTIONS.fontsUrl, OPTIONS.fontName + (toSuffix ? ("-" + OPTIONS.suffix) : '') + ".woff");
    if (!this[('ttf' + (toSuffix ? ('_' + OPTIONS.suffix) : ''))]) {
      let ttf = svg2ttf(fs.readFileSync(path.join(OPTIONS.dist, OPTIONS.fontName + (toSuffix ? ("-" + OPTIONS.suffix) : '') + ".svg"), "utf8"), {});
      self[('ttf' + (toSuffix ? ('_' + OPTIONS.suffix) : ''))] = Buffer.from(ttf.buffer);
    }
    const woff = Buffer.from(ttf2woff(this[('ttf' + (toSuffix ? ('_' + OPTIONS.suffix) : ''))]).buffer);
    fs.writeFile(DIST_PATH, woff, (err, data) => {
      if (err) {
        return reject(err);
      }
      console.log(`${"SUCCESS".green} ${"WOFF".blue_bt} font successfully created! ${DIST_PATH}`);

      if (!toSuffix) {
        self.createWOFF(OPTIONS, true).then((res) => {
          resolve(res);
        }).catch((e) => {
          reject(e);
        })
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * TTF font to WOFF2
 */
exports.createWOFF2 = (OPTIONS, toSuffix) => {
  let self = this
  return new Promise((resolve, reject) => {
    const DIST_PATH = path.join(OPTIONS.fontsUrl, OPTIONS.fontName + (toSuffix ? ("-" + OPTIONS.suffix) : '') + ".woff2");
    const woff2 = Buffer.from(ttf2woff2(this[('ttf' + (toSuffix ? ('_' + OPTIONS.suffix) : ''))]).buffer);
    fs.writeFile(DIST_PATH, woff2, (err, data) => {
      if (err) {
        return reject(err);
      }
      console.log(`${"SUCCESS".green} ${"WOFF2".blue_bt} font successfully created! ${DIST_PATH}`);

      if (!toSuffix) {
        self.createWOFF2(OPTIONS, true).then((res) => {
          resolve(res);
        }).catch((e) => {
          reject(e);
        })
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Copy template files
 */
exports.copyTemplate = (inDir, outDir, vars, DIST_PATH, reNamePath) => {
  return new Promise((resolve, reject) => {
    copy(inDir, outDir, vars, (err, createdFiles) => {
      if (err) reject(err);
      fs.rename(reNamePath.old, reNamePath.new, (err) => {
        if (err) reject(err);
        console.log(`${"SUCCESS".green} ${"CSS".blue_bt} file successfully created! ${DIST_PATH}`);
        resolve(createdFiles);
      });
    })
  });
};

exports.createCSS = (options, cssString) => {
  const font_temp = path.resolve(__dirname, "template");
  const DIST_PATH = path.join(options.dist, options.fontName + ".css");
  const reNamePath = {
    old: path.join(options.dist, options.fontName + ".template"),
    new: path.join(options.dist, options.fontName + ".css")
  }

  return this.copyTemplate(font_temp, options.dist, {
    fontname: options.fontName,
    cssString: cssString.join(""),
    timestamp: new Date().getTime(),
    prefix: options.classNamePrefix || options.fontName
  }, DIST_PATH, reNamePath);
};

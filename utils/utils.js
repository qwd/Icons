const fs = require("fs");
const path = require("path");
const SVGIcons2SVGFont = require("svgicons2svgfont");
const copy = require("copy-template-dir");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2woff2 = require("ttf2woff2");
require("colors-cli/toxic");

let unicodeList = [];
let unicodeSelfList = []
let startUnicode = 0xea60;
let fileSuffix = ''


function _getSvgFileName (name) {
  let list = name.split('-')
  return list[list.length - 1] === fileSuffix ? (list[0] + '-' + list[list.length - 1]) : list[0]
}

function _getListCode (isSelf, code) {
  let list = isSelf ? unicodeSelfList : unicodeList
  return list.find(item => item.code === code).unicode
}

function _createCodeAlias (name) {
  if (name.includes('-')) {
    let _nameList = name.split('-')
    if (isNaN(Number(_nameList[0]))) {
      return name
    } else {
      return _nameList.slice(1).join('-')
    }
  } else {
    return name
  }
}

function getIconUnicode(name, toGet, isUnicode) {
  // toGet means "fill" file
  // isUnicode is itself as unicode
  let unicode
  let _name = name.includes('-') ? _getSvgFileName(name) : name
  let code = _name.includes('-') ? _name.split('-')[0] : _name
  if (isUnicode) {
    unicode = toGet ? _getListCode(true, code) : code
  } else {
    unicode = toGet ? _getListCode(false, code) : String.fromCharCode((isNaN(Number(code)) ? startUnicode++ : '0x' + Number(code).toString(16)));
  }

  let item = {
    code: _name,
    name: _createCodeAlias(name),
    unicode: unicode
  }
  if (isUnicode) {
    unicodeSelfList.push(item)
  } else {
    unicodeList.push(item)
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
exports.createSVG = (options, toSuffix) => {
  fileSuffix = options.suffix
  unicodeList = toSuffix ? unicodeList : []
  unicodeSelfList = toSuffix ? unicodeSelfList : []
  return new Promise((resolve, reject) => {
    const fontStream = new SVGIcons2SVGFont({
      ...options.svgicons2svgfont
    });

    function writeFontStream(svgPath) {
      let _name = path.basename(svgPath, ".svg");
      if ((toSuffix && _name.includes(options.suffix)) || (!toSuffix && !_name.includes(options.suffix))) {
        let _glyphName = _name.includes('-') ? _getSvgFileName(_name) : _name
        const glyph = fs.createReadStream(svgPath);
        glyph.metadata = {
          unicode: getIconUnicode(_name, toSuffix),
          name: _glyphName
        };
        fontStream.write(glyph);
        const glyphSelf = fs.createReadStream(svgPath);
        glyphSelf.metadata = {
          unicode: getIconUnicode(_name, toSuffix, true),
          name: _glyphName + '-self'
        };
        fontStream.write(glyphSelf);
      }
    }

    const DIST_PATH = path.join(options.dist, (options.fontName + (toSuffix ? ("-" + options.suffix) : '') + ".svg"));

    // Setting the font destination
    let self = this
    fontStream.pipe(fs.createWriteStream(DIST_PATH)).on("finish", () => {
      if (!toSuffix) {
        self.createSVG(options, true).then((res) => {
          resolve(res);
        }).catch((e) => {
          reject(e);
        })
      } else {
        resolve(unicodeList);
      }
    }).on("error", (err) => {
      if (err) {
        reject(err);
      }
    });

    this.filterSvgFiles(options.src).sort((a, b) => {
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
exports.createTTF = (options, toSuffix) => {
  let self = this
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(options.fontsUrl)) {
      fs.mkdirSync(options.fontsUrl);
    }
    options.svg2ttf = options.svg2ttf || {};
    const DIST_PATH = path.join(options.fontsUrl, options.fontName + (toSuffix ? ("-" + options.suffix) : '') + ".ttf");
    let ttf = svg2ttf(fs.readFileSync(path.join(options.dist, options.fontName + (toSuffix ? ("-" + options.suffix) : '') + ".svg"), "utf8"), options.svg2ttf);
    ttf = this[('ttf' + (toSuffix ? ('_' + options.suffix) : ''))] = Buffer.from(ttf.buffer);
    fs.writeFile(DIST_PATH, ttf, (err, data) => {
      if (err) {
        return reject(err);
      }

      console.log(`${"SUCCESS".green} ${"TTF".blue_bt} font successfully created! ${DIST_PATH}`);

      if (!toSuffix) {
        self.createTTF(options, true).then((res) => {
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
exports.createWOFF = (options, toSuffix) => {
  let self = this
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(options.fontsUrl)) {
      fs.mkdirSync(options.fontsUrl);
    }
    const DIST_PATH = path.join(options.fontsUrl, options.fontName + (toSuffix ? ("-" + options.suffix) : '') + ".woff");
    if (!this[('ttf' + (toSuffix ? ('_' + options.suffix) : ''))]) {
      let ttf = svg2ttf(fs.readFileSync(path.join(options.dist, options.fontName + (toSuffix ? ("-" + options.suffix) : '') + ".svg"), "utf8"), {});
      self[('ttf' + (toSuffix ? ('_' + options.suffix) : ''))] = Buffer.from(ttf.buffer);
    }
    const woff = Buffer.from(ttf2woff(this[('ttf' + (toSuffix ? ('_' + options.suffix) : ''))]).buffer);
    fs.writeFile(DIST_PATH, woff, (err, data) => {
      if (err) {
        return reject(err);
      }
      console.log(`${"SUCCESS".green} ${"WOFF".blue_bt} font successfully created! ${DIST_PATH}`);

      if (!toSuffix) {
        self.createWOFF(options, true).then((res) => {
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
exports.createWOFF2 = (options, toSuffix) => {
  let self = this
  return new Promise((resolve, reject) => {
    const DIST_PATH = path.join(options.fontsUrl, options.fontName + (toSuffix ? ("-" + options.suffix) : '') + ".woff2");
    const woff2 = Buffer.from(ttf2woff2(this[('ttf' + (toSuffix ? ('_' + options.suffix) : ''))]).buffer);
    fs.writeFile(DIST_PATH, woff2, (err, data) => {
      if (err) {
        return reject(err);
      }
      console.log(`${"SUCCESS".green} ${"WOFF2".blue_bt} font successfully created! ${DIST_PATH}`);

      if (!toSuffix) {
        self.createWOFF2(options, true).then((res) => {
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

/**
 * Create icons-code json
 */
exports.createJSON = (options, jsonList) => {
  return new Promise((resolve, reject) => {
    let unicodeJsonPath = path.join(options.dist, `./${options.fontName}.json`)
    jsonList.forEach(item => {
      item.unicode = item.unicode.charCodeAt(0).toString(16)
    })
    // unicodeList[i] = parseInt(unicodeList[i].charCodeAt(0).toString(16), 16)
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
exports.processFiles = (options) => {
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

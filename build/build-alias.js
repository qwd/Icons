const {generateFonts} = require('fantasticon');
const codepoints = require('../font/qweather-icons.json');
const iconWords = require('../icons-list.json');
let generateFontsOption = require('../fantasticonrc')
const path = require("path");
const fs = require("fs");
const oldIconsFile = '../font/old-qweather-icons.json'

function iconTrans(key) {
  let exist = iconWords.find(item => item.icon_code == key)
  return exist ? exist.icon_name : key
}

function getAllCodePoints(onlyCodepoints) {
  let onlyNamePoints = {}
  for (let i in onlyCodepoints) {
    onlyNamePoints[iconTrans(i)] = onlyCodepoints[i]
  }
  return Object.assign(onlyCodepoints, onlyNamePoints)
}

fs.readFile(path.join(__dirname, oldIconsFile), 'utf8', (err, data) => {
  let oldCodepoints = err ? {} : JSON.parse(data)
  let onlyCodepoints = {}
  let noHave = {}
  for (let i in codepoints) {
    if (oldCodepoints[i]) {
      onlyCodepoints[i] = oldCodepoints[i]
    } else {
      noHave[i] = codepoints[i]
    }
  }
  const values = Object.values(onlyCodepoints).sort((a, b) => a - b);
  if (values.length > 0) {
    let start = values[values.length - 1]
    for (let i in noHave) {
      start++
      onlyCodepoints[i] = start
    }
  } else {
    onlyCodepoints = JSON.parse(JSON.stringify(noHave))
  }
  if (!err) {
    fs.unlink(path.join(__dirname, oldIconsFile), (deleteErr) => {});
  }
  generateFontsOption.codepoints = getAllCodePoints(onlyCodepoints)
  generateFonts(generateFontsOption)
});

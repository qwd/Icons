const {generateFonts} = require('fantasticon');
const codepoints = require('../font/qweather-icons.json');
const iconWords = require('../icons-list.json');
let generateFontsOption = require('../fantasticonrc')

function iconTrans(key) {
    let name = ''
    iconWords.forEach((item, index) => {
        if (item.icon_code == key) {
            name = item.icon_name
        }
    })
    return name
}

function getAllCodePoints() {
    let newCodepoints = {}
    for (let i in codepoints) {
        newCodepoints[iconTrans(i)] = codepoints[i]
    }
    return Object.assign(codepoints, newCodepoints)
}

generateFontsOption.codepoints = getAllCodePoints()
generateFonts(generateFontsOption)

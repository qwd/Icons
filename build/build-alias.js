const path = require('path');
const svgtofont = require("../utils/index");

const options = {
  src: path.resolve(process.cwd(), "icons"),
  dist: path.resolve(process.cwd(), "font"),
  fontsUrl: path.resolve(process.cwd(), "font/fonts"),
  styleTemplates: path.resolve(process.cwd(), "./to_font_utils/styles"),
  fontName: "qweather-icons",
  classNamePrefix: 'qi'
}

svgtofont(options).then(() => {
  console.log("done!");
});

console.log('process.cwd()', process.cwd())
